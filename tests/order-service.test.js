import test from 'node:test';
import assert from 'node:assert/strict';
import {
  OrderRequestError,
  escapeHtml,
  isRequestOriginAllowed,
  validateOrderPayload,
  validateReservationPayload,
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
  assert.equal(order.orderFormat, 'В зале');
});

test('accepts only supported order formats', () => {
  const takeawayOrder = validateOrderPayload(createValidPayload({ orderFormat: 'С собой' }));
  assert.equal(takeawayOrder.orderFormat, 'С собой');

  assert.throws(
    () => validateOrderPayload(createValidPayload({ orderFormat: '<script>alert(1)</script>' })),
    (error) => error instanceof OrderRequestError && error.status === 400,
  );
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

test('accepts a valid table reservation with an integer guest count', () => {
  const reservation = validateReservationPayload({
    name: 'Анна',
    phone: '+7 (999) 123-45-67',
    guests: 4,
    dateTime: '31 декабря в 20:00',
    offerAccepted: true,
    personalDataConsent: true,
  });

  assert.equal(reservation.guests, 4);
  assert.equal(reservation.dateTime, '31 декабря в 20:00');
});

test('rejects a fractional guest count in a reservation', () => {
  assert.throws(
    () =>
      validateReservationPayload({
        name: 'Анна',
        phone: '+7 (999) 123-45-67',
        guests: 2.5,
        dateTime: '2099-12-31T20:00',
        offerAccepted: true,
        personalDataConsent: true,
      }),
    (error) => error instanceof OrderRequestError && error.status === 400,
  );
});

test('rejects a reservation without personal data consent', () => {
  assert.throws(
    () =>
      validateReservationPayload({
        name: 'Анна',
        phone: '+7 (999) 123-45-67',
        guests: 2,
        dateTime: '2099-12-31T20:00',
        offerAccepted: true,
        personalDataConsent: false,
      }),
    (error) => error instanceof OrderRequestError && error.status === 400,
  );
});

test('rejects a reservation without accepting the public offer', () => {
  assert.throws(
    () =>
      validateReservationPayload({
        name: 'Анна',
        phone: '+7 (999) 123-45-67',
        guests: 2,
        dateTime: '2099-12-31T20:00',
        offerAccepted: false,
        personalDataConsent: true,
      }),
    (error) => error instanceof OrderRequestError && error.status === 400,
  );
});
