import {
  createSecurityHeaders,
  getPublicReservationError,
  processReservationRequest,
} from '../../server/order-service.js';

function getRequestHeaders(request) {
  const headers = {};
  for (const [name, value] of Object.entries(request.headers || {})) {
    headers[name.toLowerCase()] = Array.isArray(value) ? value[0] : value;
  }
  return headers;
}

function getIpAddress(request) {
  const forwarded = request.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.socket?.remoteAddress || 'unknown';
}

export default async function handler(request, response) {
  const headers = getRequestHeaders(request);

  try {
    const result = await processReservationRequest({
      method: request.method,
      headers,
      body: request.body,
      ipAddress: getIpAddress(request),
    });

    response.status(result.status);
    for (const [name, value] of Object.entries(createSecurityHeaders())) {
      response.setHeader(name, value);
    }
    if (result.origin) {
      response.setHeader('Access-Control-Allow-Origin', result.origin);
      response.setHeader('Vary', 'Origin');
    }
    if (request.method === 'OPTIONS') {
      response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      return response.end();
    }
    return response.json(result.body);
  } catch (error) {
    const publicError = getPublicReservationError(error);
    response.status(publicError.status);
    for (const [name, value] of Object.entries({
      ...createSecurityHeaders(),
      ...publicError.headers,
    })) {
      response.setHeader(name, value);
    }
    return response.json(publicError.body);
  }
}
