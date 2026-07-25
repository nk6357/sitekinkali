import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OrderRequestError,
  escapeHtml,
  isRequestOriginAllowed,
  validateOrderPayload,
} from '../server/order-service.js';

function createValidPayload(overrides = {}) {
  return {
    customer: {
      name: 'Иван',
      phone: '+7 (999) 123-45-67',
      email: 'guest@example.com',
    },
    items: [
      {
        name: 'Хинкали',
        price: 150,
        quantity: 2,
        total: 300,
      },
    ],
    totalPrice: 300,
    comment: '',
    ...overrides,
  };
}

test('escapes every dangerous HTML character', () => {
  assert.equal(
    escapeHtml(`<img src=x onerror="alert('x')">&`),
    '&lt;img src=x onerror=&quot;alert(&#039;x&#039;)&quot;&gt;&amp;',
  );
});

test('uses the default comment when the comment is empty', () => {
  const order = validateOrderPayload(createValidPayload());
  assert.equal(order.comment, 'Как можно скорее');
});

test('rejects a forged order total', () => {
  assert.throws(
    () => validateOrderPayload(createValidPayload({ totalPrice: 1 })),
    (error) => error instanceof OrderRequestError && error.status === 400,
  );
});

test('rejects CRLF injection in customer email', () => {
  const payload = createValidPayload();
  payload.customer.email = 'guest@example.com\r\nBcc: attacker@example.com';
  assert.throws(
    () => validateOrderPayload(payload),
    (error) => error instanceof OrderRequestError && error.status === 400,
  );
});

test('allows the request host and rejects unrelated origins', () => {
  assert.equal(isRequestOriginAllowed('https://kinkali.example', 'kinkali.example'), true);
  assert.equal(isRequestOriginAllowed('https://evil.example', 'kinkali.example'), false);
});
