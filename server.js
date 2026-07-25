import express from 'express';
import dotenv from 'dotenv';
import {
  createSecurityHeaders,
  getPublicError,
  processOrderRequest,
} from './server/order-service.js';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use((request, response, next) => {
  for (const [name, value] of Object.entries(createSecurityHeaders())) {
    response.setHeader(name, value);
  }
  next();
});
app.use(express.json({ limit: '64kb', strict: true }));

app.all('/api/orders/send-email', async (request, response) => {
  try {
    const result = await processOrderRequest({
      method: request.method,
      headers: request.headers,
      body: request.body,
      ipAddress: request.ip || request.socket.remoteAddress || 'unknown',
    });

    if (result.origin) {
      response.setHeader('Access-Control-Allow-Origin', result.origin);
      response.setHeader('Vary', 'Origin');
    }
    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return response.status(204).end();
    }
    return response.status(result.status).json(result.body);
  } catch (error) {
    const publicError = getPublicError(error);
    for (const [name, value] of Object.entries(publicError.headers)) {
      response.setHeader(name, value);
    }
    return response.status(publicError.status).json(publicError.body);
  }
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use((error, _request, response, _next) => {
  if (error?.type === 'entity.too.large') {
    return response.status(413).json({ success: false, error: 'Заказ слишком большой' });
  }
  if (error instanceof SyntaxError) {
    return response.status(400).json({ success: false, error: 'Некорректный JSON' });
  }
  console.error('Unhandled API error', { name: error?.name || 'UnknownError' });
  return response.status(500).json({ success: false, error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Order API server is running on port ${PORT}`);
});
