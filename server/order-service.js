import crypto from 'node:crypto';
import nodemailer from 'nodemailer';

const MAX_BODY_BYTES = 64 * 1024;
const DEFAULT_COMMENT = 'Как можно скорее';
const DEFAULT_PICKUP_LOCATION = 'Самовывоз Белинского, 6Б';
const DEFAULT_PAYMENT_METHOD = 'Оплата наличными или банковской картой при получении заказа';
const RATE_LIMIT_STORE = new Map();

let cachedTransporter;
let cachedTransporterKey;

export class OrderRequestError extends Error {
  constructor(status, publicMessage) {
    super(publicMessage);
    this.name = 'OrderRequestError';
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

export function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function cleanText(value, fieldName, { min = 1, max, multiline = false } = {}) {
  if (typeof value !== 'string') {
    throw new OrderRequestError(400, `Некорректное поле: ${fieldName}`);
  }

  const normalized = value.normalize('NFKC').trim();
  const forbiddenControlCharacters = multiline
    ? /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/
    : /[\u0000-\u001F\u007F]/;

  if (forbiddenControlCharacters.test(normalized)) {
    throw new OrderRequestError(400, `Некорректное поле: ${fieldName}`);
  }

  if (normalized.length < min || normalized.length > max) {
    throw new OrderRequestError(400, `Некорректная длина поля: ${fieldName}`);
  }

  return normalized;
}

function cleanEmail(value) {
  const email = cleanText(value, 'email', { min: 3, max: 254 }).toLowerCase();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u;

  if (!emailPattern.test(email) || /[\r\n]/.test(email)) {
    throw new OrderRequestError(400, 'Укажите корректный email');
  }

  return email;
}

function cleanPhone(value) {
  const phone = cleanText(value, 'телефон', { min: 10, max: 32 });
  const digits = phone.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 15 || !/^[+\d\s().-]+$/u.test(phone)) {
    throw new OrderRequestError(400, 'Укажите корректный номер телефона');
  }

  return phone;
}

function cleanMoney(value, fieldName) {
  if (!Number.isInteger(value) || value < 0 || value > 1_000_000) {
    throw new OrderRequestError(400, `Некорректное поле: ${fieldName}`);
  }

  return value;
}

export function validateOrderPayload(payload) {
  if (!isPlainObject(payload) || !isPlainObject(payload.customer) || !Array.isArray(payload.items)) {
    throw new OrderRequestError(400, 'Некорректные данные заказа');
  }

  if (payload.items.length < 1 || payload.items.length > 50) {
    throw new OrderRequestError(400, 'Заказ должен содержать от 1 до 50 позиций');
  }

  const customer = {
    name: cleanText(payload.customer.name, 'имя', { min: 2, max: 80 }),
    phone: cleanPhone(payload.customer.phone),
    email: cleanEmail(payload.customer.email),
  };

  const items = payload.items.map((item) => {
    if (!isPlainObject(item)) {
      throw new OrderRequestError(400, 'Некорректная позиция заказа');
    }

    const price = cleanMoney(item.price, 'цена');
    const quantity = item.quantity;

    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new OrderRequestError(400, 'Некорректное количество блюда');
    }

    const calculatedTotal = price * quantity;
    if (!Number.isSafeInteger(calculatedTotal) || calculatedTotal > 10_000_000) {
      throw new OrderRequestError(400, 'Некорректная стоимость позиции');
    }

    if (item.total !== undefined && item.total !== calculatedTotal) {
      throw new OrderRequestError(400, 'Стоимость позиции не совпадает с расчётом');
    }

    return {
      name: cleanText(item.name, 'название блюда', { min: 1, max: 160 }),
      price,
      quantity,
      total: calculatedTotal,
    };
  });

  const calculatedTotalPrice = items.reduce((sum, item) => sum + item.total, 0);
  if (!Number.isSafeInteger(calculatedTotalPrice) || calculatedTotalPrice > 10_000_000) {
    throw new OrderRequestError(400, 'Некорректная сумма заказа');
  }

  if (payload.totalPrice !== calculatedTotalPrice) {
    throw new OrderRequestError(400, 'Итоговая сумма заказа не совпадает с расчётом');
  }

  const comment =
    typeof payload.comment === 'string' && payload.comment.trim()
      ? cleanText(payload.comment, 'комментарий', { min: 1, max: 500, multiline: true })
      : DEFAULT_COMMENT;

  return {
    customer,
    items,
    totalPrice: calculatedTotalPrice,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    pickupLocation: process.env.PICKUP_LOCATION || DEFAULT_PICKUP_LOCATION,
    paymentMethod: process.env.PAYMENT_METHOD || DEFAULT_PAYMENT_METHOD,
    comment,
    orderId: crypto.randomUUID(),
    createdAt: new Date(),
  };
}

function getRestaurantDateTimeParts(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: process.env.ORDER_TIME_ZONE || 'Asia/Yekaterinburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(value);
  const getPart = (type) => parts.find((part) => part.type === type)?.value || '';

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: getPart('hour'),
    minute: getPart('minute'),
  };
}

function validateLocalDateTime(value) {
  const dateTime = cleanText(value, 'дата и время', { min: 16, max: 16 });
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/u.exec(dateTime);

  if (!match) {
    throw new OrderRequestError(400, 'Укажите корректные дату и время');
  }

  const [, year, month, day, hour, minute] = match;
  const numeric = [year, month, day, hour, minute].map(Number);
  const [numericYear, numericMonth, numericDay, numericHour, numericMinute] = numeric;
  const calendarDate = new Date(
    Date.UTC(numericYear, numericMonth - 1, numericDay, numericHour, numericMinute),
  );

  if (
    calendarDate.getUTCFullYear() !== numericYear ||
    calendarDate.getUTCMonth() !== numericMonth - 1 ||
    calendarDate.getUTCDate() !== numericDay ||
    numericHour > 23 ||
    numericMinute > 59
  ) {
    throw new OrderRequestError(400, 'Укажите корректные дату и время');
  }

  const now = getRestaurantDateTimeParts();
  const currentRestaurantMinute =
    `${now.year}-${now.month}-${now.day}T${now.hour}:${now.minute}`;

  if (dateTime <= currentRestaurantMinute) {
    throw new OrderRequestError(400, 'Выберите будущие дату и время');
  }

  return dateTime;
}

export function validateReservationPayload(payload) {
  if (!isPlainObject(payload)) {
    throw new OrderRequestError(400, 'Некорректные данные бронирования');
  }

  if (payload.consent !== true) {
    throw new OrderRequestError(400, 'Необходимо согласие на обработку данных');
  }

  if (!Number.isInteger(payload.guests) || payload.guests < 1 || payload.guests > 50) {
    throw new OrderRequestError(400, 'Количество человек должно быть целым числом от 1 до 50');
  }

  return {
    name: cleanText(payload.name, 'имя', { min: 2, max: 80 }),
    phone: cleanPhone(payload.phone),
    guests: payload.guests,
    dateTime: validateLocalDateTime(payload.dateTime),
    reservationId: crypto.randomUUID(),
    createdAt: new Date(),
  };
}

function parseAllowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

export function isRequestOriginAllowed(origin, host) {
  if (!origin) {
    return process.env.NODE_ENV !== 'production';
  }

  let normalizedOrigin;
  try {
    normalizedOrigin = new URL(origin).origin;
  } catch {
    return false;
  }

  if (host) {
    try {
      const hostOrigin = new URL(`https://${host}`).origin;
      if (normalizedOrigin === hostOrigin) {
        return true;
      }
    } catch {
      return false;
    }
  }

  return parseAllowedOrigins().some((allowedOrigin) => {
    try {
      return new URL(allowedOrigin).origin === normalizedOrigin;
    } catch {
      return false;
    }
  });
}

function getPositiveIntegerEnvironmentValue(name, fallback, maximum) {
  const parsed = Number.parseInt(process.env[name] || '', 10);
  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }
  return Math.min(parsed, maximum);
}

function enforceRateLimit(ipAddress) {
  const now = Date.now();
  const windowMs = getPositiveIntegerEnvironmentValue(
    'ORDER_RATE_LIMIT_WINDOW_MS',
    15 * 60 * 1000,
    24 * 60 * 60 * 1000,
  );
  const maximumRequests = getPositiveIntegerEnvironmentValue('ORDER_RATE_LIMIT_MAX', 5, 100);
  const key = crypto.createHash('sha256').update(ipAddress || 'unknown').digest('hex');
  const current = RATE_LIMIT_STORE.get(key);

  if (!current || current.resetAt <= now) {
    RATE_LIMIT_STORE.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  if (current.count >= maximumRequests) {
    const retryAfterSeconds = Math.max(1, Math.ceil((current.resetAt - now) / 1000));
    const error = new OrderRequestError(429, 'Слишком много попыток. Попробуйте позже.');
    error.retryAfterSeconds = retryAfterSeconds;
    throw error;
  }

  current.count += 1;

  if (RATE_LIMIT_STORE.size > 10_000) {
    for (const [storedKey, entry] of RATE_LIMIT_STORE) {
      if (entry.resetAt <= now) {
        RATE_LIMIT_STORE.delete(storedKey);
      }
    }
  }
}

function getRequiredEnvironmentValue(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getTransporter() {
  const configuration = {
    host: getRequiredEnvironmentValue('SMTP_HOST'),
    port: getPositiveIntegerEnvironmentValue('SMTP_PORT', 587, 65_535),
    secure: process.env.SMTP_SECURE === 'true',
    user: getRequiredEnvironmentValue('SMTP_USER'),
    password: getRequiredEnvironmentValue('SMTP_PASSWORD'),
  };
  const transporterKey = JSON.stringify(configuration);

  if (!cachedTransporter || cachedTransporterKey !== transporterKey) {
    cachedTransporter = nodemailer.createTransport({
      host: configuration.host,
      port: configuration.port,
      secure: configuration.secure,
      auth: {
        user: configuration.user,
        pass: configuration.password,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
      tls: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: true,
      },
    });
    cachedTransporterKey = transporterKey;
  }

  return cachedTransporter;
}

function formatPrice(value) {
  return `${value.toLocaleString('ru-RU')} ₽`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: process.env.ORDER_TIME_ZONE || 'Asia/Yekaterinburg',
  }).format(value);
}

function formatReservationDateTime(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/u.exec(value);
  if (!match) {
    return value;
  }

  const [, year, month, day, hour, minute] = match;
  return `${day}.${month}.${year} в ${hour}:${minute}`;
}

function createItemsHtml(items) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eadfce;color:#2f251d">
            <strong>${escapeHtml(item.name)}</strong>
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #eadfce;text-align:center;color:#5f5146">
            ${item.quantity}
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #eadfce;text-align:right;color:#2f251d;white-space:nowrap">
            <strong>${escapeHtml(formatPrice(item.total))}</strong>
          </td>
        </tr>`,
    )
    .join('');
}

function createItemsText(items) {
  return items
    .map((item) => `${item.name} — ${item.quantity} × ${formatPrice(item.price)} = ${formatPrice(item.total)}`)
    .join('\n');
}

function createEmailLayout({ eyebrow, title, intro, order, recipientDetails }) {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f3ede3;font-family:Arial,sans-serif;color:#2f251d">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3ede3;padding:24px 12px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#fffaf2;border-radius:20px;overflow:hidden;border:1px solid #dfd1bd">
            <tr>
              <td style="padding:32px;background:#3e2017;color:#fffaf2;text-align:center">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#d9b77f">${escapeHtml(eyebrow)}</div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.25">${escapeHtml(title)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px">
                <p style="margin:0 0 22px;line-height:1.6;color:#5f5146">${intro}</p>
                ${recipientDetails}
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin-top:24px">
                  <thead>
                    <tr>
                      <th align="left" style="padding:10px 8px;border-bottom:2px solid #b7894d;color:#3e2017">Блюдо</th>
                      <th style="padding:10px 8px;border-bottom:2px solid #b7894d;color:#3e2017">Кол-во</th>
                      <th align="right" style="padding:10px 8px;border-bottom:2px solid #b7894d;color:#3e2017">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>${createItemsHtml(order.items)}</tbody>
                </table>
                <div style="margin-top:22px;padding:18px;background:#f3e6d2;border-radius:14px;text-align:right">
                  <span style="color:#6b594a">Итого (${order.totalItems}):</span>
                  <strong style="margin-left:8px;font-size:22px;color:#3e2017">${escapeHtml(formatPrice(order.totalPrice))}</strong>
                </div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:24px">
                  <tr><td style="padding:5px 0;color:#7a695a">Самовывоз</td><td align="right" style="padding:5px 0;color:#2f251d">${escapeHtml(order.pickupLocation)}</td></tr>
                  <tr><td style="padding:5px 0;color:#7a695a">Оплата</td><td align="right" style="padding:5px 0;color:#2f251d">${escapeHtml(order.paymentMethod)}</td></tr>
                  <tr><td style="padding:5px 0;color:#7a695a">Комментарий</td><td align="right" style="padding:5px 0;color:#2f251d">${escapeHtml(order.comment).replaceAll('\n', '<br>')}</td></tr>
                  <tr><td style="padding:5px 0;color:#7a695a">Создан</td><td align="right" style="padding:5px 0;color:#2f251d">${escapeHtml(formatDate(order.createdAt))}</td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#ead8bd;color:#6b594a;font-size:12px;text-align:center">
                Номер заказа: ${escapeHtml(order.orderId)}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function createAdminEmail(order) {
  const customerDetails = `
    <div style="padding:18px;background:#fff;border:1px solid #eadfce;border-radius:14px">
      <div style="margin-bottom:8px"><strong>Имя:</strong> ${escapeHtml(order.customer.name)}</div>
      <div style="margin-bottom:8px"><strong>Телефон:</strong> ${escapeHtml(order.customer.phone)}</div>
      <div><strong>Email:</strong> ${escapeHtml(order.customer.email)}</div>
    </div>`;

  return {
    subject: `Новый заказ Кинкали · ${order.orderId.slice(0, 8)}`,
    html: createEmailLayout({
      eyebrow: 'Новый заказ',
      title: 'Заказ готов к подтверждению',
      intro: 'Свяжитесь с гостем, чтобы подтвердить заказ и время самовывоза.',
      order,
      recipientDetails: customerDetails,
    }),
    text: `Новый заказ ${order.orderId}

Имя: ${order.customer.name}
Телефон: ${order.customer.phone}
Email: ${order.customer.email}

${createItemsText(order.items)}

Итого: ${formatPrice(order.totalPrice)}
Самовывоз: ${order.pickupLocation}
Оплата: ${order.paymentMethod}
Комментарий: ${order.comment}
Создан: ${formatDate(order.createdAt)}`,
  };
}

function createCustomerEmail(order) {
  return {
    subject: `Ваш заказ в ресторане «Кинкали» · ${order.orderId.slice(0, 8)}`,
    html: createEmailLayout({
      eyebrow: 'Ресторан «Кинкали»',
      title: 'Спасибо, заказ принят!',
      intro: `Здравствуйте, <strong>${escapeHtml(order.customer.name)}</strong>! Ниже ваш электронный чек. Мы свяжемся с вами, чтобы подтвердить заказ.`,
      order,
      recipientDetails: '',
    }),
    text: `Здравствуйте, ${order.customer.name}!

Ваш заказ в ресторане «Кинкали» принят.

${createItemsText(order.items)}

Итого: ${formatPrice(order.totalPrice)}
Самовывоз: ${order.pickupLocation}
Оплата: ${order.paymentMethod}
Комментарий: ${order.comment}
Номер заказа: ${order.orderId}

Мы свяжемся с вами, чтобы подтвердить заказ.`,
  };
}

async function sendOrderEmails(order) {
  const adminEmail = getRequiredEnvironmentValue('ADMIN_EMAIL');
  const fromAddress = getRequiredEnvironmentValue('SMTP_FROM');
  const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Ресторан Кинкали';
  const transporter = getTransporter();
  const adminMessage = createAdminEmail(order);
  const customerMessage = createCustomerEmail(order);

  const results = await Promise.allSettled([
    transporter.sendMail({
      from: { name: fromName, address: fromAddress },
      to: adminEmail,
      replyTo: order.customer.email,
      ...adminMessage,
    }),
    transporter.sendMail({
      from: { name: fromName, address: fromAddress },
      to: order.customer.email,
      replyTo: adminEmail,
      ...customerMessage,
    }),
  ]);

  if (results.some((result) => result.status === 'rejected')) {
    throw new Error('One or more email deliveries failed');
  }
}

function createReservationAdminEmail(reservation) {
  const formattedDateTime = formatReservationDateTime(reservation.dateTime);

  return {
    subject: `Новая бронь Кинкали · ${reservation.reservationId.slice(0, 8)}`,
    html: `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Новая заявка на бронирование</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f1eb;font-family:Arial,sans-serif;color:#302f2d">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f1eb;padding:24px 12px">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#fff;border:1px solid #d2cccc;border-radius:20px;overflow:hidden">
            <tr>
              <td style="padding:30px;background:#302f2d;color:#f5f3ed;text-align:center">
                <div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#c4c4bc">Ресторан «Кинкали»</div>
                <h1 style="margin:10px 0 0;font-size:28px;line-height:1.25">Новая заявка на столик</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:28px">
                <p style="margin:0 0 20px;line-height:1.6;color:#7c7c74">Позвоните гостю, чтобы подтвердить бронирование.</p>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                  <tr><td style="padding:12px;border-bottom:1px solid #dcdcd4;color:#7c7c74">Имя</td><td align="right" style="padding:12px;border-bottom:1px solid #dcdcd4"><strong>${escapeHtml(reservation.name)}</strong></td></tr>
                  <tr><td style="padding:12px;border-bottom:1px solid #dcdcd4;color:#7c7c74">Телефон</td><td align="right" style="padding:12px;border-bottom:1px solid #dcdcd4"><strong>${escapeHtml(reservation.phone)}</strong></td></tr>
                  <tr><td style="padding:12px;border-bottom:1px solid #dcdcd4;color:#7c7c74">Гостей</td><td align="right" style="padding:12px;border-bottom:1px solid #dcdcd4"><strong>${reservation.guests}</strong></td></tr>
                  <tr><td style="padding:12px;color:#7c7c74">Дата и время</td><td align="right" style="padding:12px"><strong>${escapeHtml(formattedDateTime)}</strong></td></tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px;background:#dcdcd4;color:#7c7c74;font-size:12px;text-align:center">
                Номер заявки: ${escapeHtml(reservation.reservationId)} · Отправлено: ${escapeHtml(formatDate(reservation.createdAt))}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    text: `Новая заявка на бронирование

Имя: ${reservation.name}
Телефон: ${reservation.phone}
Количество гостей: ${reservation.guests}
Дата и время: ${formattedDateTime}
Номер заявки: ${reservation.reservationId}
Отправлено: ${formatDate(reservation.createdAt)}

Позвоните гостю, чтобы подтвердить бронирование.`,
  };
}

async function sendReservationEmail(reservation) {
  const adminEmail = getRequiredEnvironmentValue('ADMIN_EMAIL');
  const fromAddress = getRequiredEnvironmentValue('SMTP_FROM');
  const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Ресторан Кинкали';
  const transporter = getTransporter();

  await transporter.sendMail({
    from: { name: fromName, address: fromAddress },
    to: adminEmail,
    ...createReservationAdminEmail(reservation),
  });
}

export function createSecurityHeaders() {
  return {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'Referrer-Policy': 'no-referrer',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  };
}

export async function processOrderRequest({ method, headers, body, ipAddress }) {
  if (method === 'OPTIONS') {
    const origin = headers.origin;
    const host = headers.host;
    if (!isRequestOriginAllowed(origin, host)) {
      throw new OrderRequestError(403, 'Источник запроса не разрешён');
    }
    return { status: 204, body: null, origin };
  }

  if (method !== 'POST') {
    throw new OrderRequestError(405, 'Метод не поддерживается');
  }

  const contentLength = Number.parseInt(headers['content-length'] || '0', 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new OrderRequestError(413, 'Заказ слишком большой');
  }

  if (!String(headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new OrderRequestError(415, 'Ожидается JSON');
  }

  const origin = headers.origin;
  const host = headers.host;
  if (!isRequestOriginAllowed(origin, host)) {
    throw new OrderRequestError(403, 'Источник запроса не разрешён');
  }

  const fetchSite = headers['sec-fetch-site'];
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    throw new OrderRequestError(403, 'Межсайтовый запрос отклонён');
  }

  enforceRateLimit(ipAddress);
  const order = validateOrderPayload(body);
  await sendOrderEmails(order);

  return {
    status: 200,
    origin,
    body: {
      success: true,
      orderId: order.orderId,
      message: 'Заказ принят',
    },
  };
}

export async function processReservationRequest({ method, headers, body, ipAddress }) {
  if (method === 'OPTIONS') {
    const origin = headers.origin;
    const host = headers.host;
    if (!isRequestOriginAllowed(origin, host)) {
      throw new OrderRequestError(403, 'Источник запроса не разрешён');
    }
    return { status: 204, body: null, origin };
  }

  if (method !== 'POST') {
    throw new OrderRequestError(405, 'Метод не поддерживается');
  }

  const contentLength = Number.parseInt(headers['content-length'] || '0', 10);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new OrderRequestError(413, 'Заявка слишком большая');
  }

  if (!String(headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    throw new OrderRequestError(415, 'Ожидается JSON');
  }

  const origin = headers.origin;
  const host = headers.host;
  if (!isRequestOriginAllowed(origin, host)) {
    throw new OrderRequestError(403, 'Источник запроса не разрешён');
  }

  const fetchSite = headers['sec-fetch-site'];
  if (fetchSite && !['same-origin', 'same-site', 'none'].includes(fetchSite)) {
    throw new OrderRequestError(403, 'Межсайтовый запрос отклонён');
  }

  enforceRateLimit(ipAddress);
  const reservation = validateReservationPayload(body);
  await sendReservationEmail(reservation);

  return {
    status: 200,
    origin,
    body: {
      success: true,
      reservationId: reservation.reservationId,
      message: 'Заявка на бронирование отправлена',
    },
  };
}

export function getPublicError(error) {
  if (error instanceof OrderRequestError) {
    return {
      status: error.status,
      headers:
        error.retryAfterSeconds !== undefined
          ? { 'Retry-After': String(error.retryAfterSeconds) }
          : {},
      body: { success: false, error: error.publicMessage },
    };
  }

  console.error('Order email delivery failed', {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : 'Unknown error',
  });

  return {
    status: 503,
    headers: {},
    body: { success: false, error: 'Не удалось отправить заказ. Попробуйте позже.' },
  };
}

export function getPublicReservationError(error) {
  if (error instanceof OrderRequestError) {
    return {
      status: error.status,
      headers:
        error.retryAfterSeconds !== undefined
          ? { 'Retry-After': String(error.retryAfterSeconds) }
          : {},
      body: { success: false, error: error.publicMessage },
    };
  }

  console.error('Reservation email delivery failed', {
    name: error instanceof Error ? error.name : 'UnknownError',
    message: error instanceof Error ? error.message : 'Unknown error',
  });

  return {
    status: 503,
    headers: {},
    body: { success: false, error: 'Не удалось отправить заявку. Попробуйте позже.' },
  };
}
