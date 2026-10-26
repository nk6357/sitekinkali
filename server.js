import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  createSecurityHeaders,
  getPublicError,
  getPublicReservationError,
  processOrderRequest,
  processReservationRequest,
} from './server/order-service.js';

dotenv.config();

const app = express();
const PORT = Number.parseInt(process.env.PORT || '3000', 10);
const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const staticDirectory = path.join(appDirectory, 'dist');

if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', 1);
}

app.disable('x-powered-by');
app.use((request, response, next) => {
  for (const [name, value] of Object.entries(createSecurityHeaders())) {
    // Express sets the correct media type for JSON responses and static files.
    // Applying the API JSON type globally would make HTML fallbacks fail when
    // X-Content-Type-Options is set to nosniff.
    if (name.toLowerCase() !== 'content-type') {
      response.setHeader(name, value);
    }
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

app.all('/api/reservations/send-email', async (request, response) => {
  try {
    const result = await processReservationRequest({
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
    const publicError = getPublicReservationError(error);
    for (const [name, value] of Object.entries(publicError.headers)) {
      response.setHeader(name, value);
    }
    return response.status(publicError.status).json(publicError.body);
  }
});

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api', (_request, response) => {
  response.status(404).json({ success: false, error: 'API-маршрут не найден' });
});

// Passenger receives requests for extensionless paths before Apache can resolve
// directories such as /privacy/index.html. Serving the production build here
// keeps those public documents available on Beget without exposing application
// files or turning unknown addresses into successful SPA responses.
app.use(express.static(staticDirectory, { index: 'index.html', redirect: true }));

app.use((_request, response) => {
  response.status(404).sendFile(path.join(staticDirectory, '404.html'));
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
