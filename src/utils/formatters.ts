/**
 * Утилиты для форматирования цен, телефонов и прочих данных
 */

/** Форматировать цену в рубли с двумя знаками после запятой */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/** Форматировать телефон по маске +7 (999) 123-45-67 */
export function formatPhone(value: string): string {
  const cleaned = value.replace(/[^\d+]/g, '').replace(/(?!^)\+/g, '');

  let formatted = cleaned;
  if (formatted.startsWith('8')) {
    formatted = `+7${formatted.slice(1)}`;
  } else if (formatted.startsWith('7') && !formatted.startsWith('+')) {
    formatted = `+${formatted}`;
  } else if (!formatted.startsWith('+7') && formatted.length > 0) {
    formatted = `+7${formatted}`;
  }

  const match = formatted.match(/^\+?7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (match) {
    const [, group1, group2, group3, group4] = match;
    let result = '+7';
    if (group1) result += ` (${group1}`;
    if (group2) result += `) ${group2}`;
    if (group3) result += `-${group3}`;
    if (group4) result += `-${group4}`;
    return result;
  }

  return formatted;
}

/** Форматировать дату и время в человекочитаемый формат */
export function formatDateTime(dateTime: string): string {
  try {
    const date = new Date(dateTime);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateTime;
  }
}

/** Получить текущую дату и время в формате для datetime-local */
export function getNowDateTimeLocal(): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
}

/** Проверить, валиден ли email */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/** Проверить, валиден ли телефон (после очистки должно быть 11 цифр) */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11;
}

/** Получить количество товаров в человекочитаемом формате для бейджа */
export function getCartBadgeText(count: number): string {
  if (count === 0) return '';
  if (count > 99) return '99+';
  return count.toString();
}
