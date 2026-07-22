import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Mailer configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER
    ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    : undefined,
});

// API Routes
app.post('/api/orders/send-email', async (req, res) => {
  try {
    const { customer, items, totalPrice, pickupLocation, paymentMethod, comment, timestamp } = req.body;

    if (!customer || !items || !customer.email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate HTML for items list
    const itemsHtml = items
      .map(
        (item) =>
          `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong>
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          x${item.quantity}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          <strong>${item.total.toLocaleString('ru-RU')} ₽</strong>
        </td>
      </tr>`
      )
      .join('');

    // Email template for admin
    const adminEmailHtml = `
      <h2>Новый заказ поступил!</h2>
      <h3>Информация о клиенте:</h3>
      <p><strong>Имя:</strong> ${customer.name}</p>
      <p><strong>Телефон:</strong> ${customer.phone}</p>
      <p><strong>Email:</strong> ${customer.email}</p>
      
      <h3>Информация о заказе:</h3>
      <p><strong>Место самовывоза:</strong> ${pickupLocation}</p>
      <p><strong>Способ оплаты:</strong> ${paymentMethod}</p>
      <p><strong>Комментарий:</strong> ${comment}</p>
      
      <h3>Заказанные блюда:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Блюдо</th>
            <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Кол-во</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <h3 style="margin-top: 20px; text-align: right; font-size: 18px;">
        <span>Итого: </span>
        <span style="color: #1f2937;">${totalPrice.toLocaleString('ru-RU')} ₽</span>
      </h3>
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Время получения: ${new Date(timestamp).toLocaleString('ru-RU')}
      </p>
    `;

    // Email template for customer
    const customerEmailHtml = `
      <h2 style="color: #1f2937;">✓ Ваш заказ принят!</h2>
      <p>Спасибо за заказ, <strong>${customer.name}</strong>!</p>
      
      <h3>Деталь вашего заказа:</h3>
      <p><strong>Место самовывоза:</strong> ${pickupLocation}</p>
      <p><strong>Способ оплаты:</strong> ${paymentMethod}</p>
      <p><strong>Комментарий:</strong> ${comment}</p>
      
      <h3>Заказанные блюда:</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e5e7eb;">Блюдо</th>
            <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e5e7eb;">Кол-во</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e5e7eb;">Сумма</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <h3 style="margin-top: 20px; text-align: right; font-size: 18px;">
        <span>Итого: </span>
        <span style="color: #1f2937;">${totalPrice.toLocaleString('ru-RU')} ₽</span>
      </h3>
      
      <p style="margin-top: 30px; line-height: 1.6;">
        Мы свяжемся с вами в ближайшее время для подтверждения заказа.<br/>
        Спасибо за выбор нашего ресторана!
      </p>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `Новый заказ от ${customer.name}`,
      html: adminEmailHtml,
      replyTo: customer.email,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: customer.email,
      subject: 'Ваш заказ принят',
      html: customerEmailHtml,
    });

    res.json({ success: true, message: 'Order sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
const PORT = parseInt(process.env.PORT || '3000');
app.listen(PORT, () => {
  console.log(`📧 Email API server running on port ${PORT}`);
});
