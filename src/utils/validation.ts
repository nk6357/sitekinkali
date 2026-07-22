/**
 * Утилиты валидации для формы оформления заказа
 */

export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name.trim()) {
    return { valid: false, error: 'Имя обязательно' };
  }
  if (name.trim().length < 2) {
    return { valid: false, error: 'Имя должно содержать минимум 2 символа' };
  }
  return { valid: true };
};

export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone.trim()) {
    return { valid: false, error: 'Номер телефона обязателен' };
  }
  // Ожидаемый формат: +7 (XXX) XXX-XX-XX
  const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: 'Введите номер в формате +7 (000) 000-00-00' };
  }
  return { valid: true };
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email.trim()) {
    return { valid: false, error: 'Email обязателен' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Укажите корректный email' };
  }
  return { valid: true };
};

export const validateConsent = (consent: boolean): { valid: boolean; error?: string } => {
  if (!consent) {
    return { valid: false, error: 'Необходимо согласие на обработку данных' };
  }
  return { valid: true };
};
