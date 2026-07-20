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

/** Форматировать телефон +7 (999) 999-99-99 */
export function formatPhone(phone: string): string {
  // Удалить все нецифровые символы
  const digits = phone.replace(/\D/g, '');
  
  // Если начинается с 7, удалить её (будет добавлена с +)
  let normalizedDigits = digits.startsWith('7') ? digits.slice(1) : digits;
  
  // Если осталось менее 10 цифр, добавить нули в начало
  if (normalizedDigits.length < 10) {
    normalizedDigits = normalizedDigits.padStart(10, '0');
  }
  
  // Форматировать: +7 (XXX) XXX-XX-XX
  return `+7 (${normalizedDigits.slice(0, 3)}) ${normalizedDigits.slice(3, 6)}-${normalizedDigits.slice(6, 8)}-${normalizedDigits.slice(8, 10)}`;
}

/** Очистить и валидировать телефон (вернуть только цифры с +7 в начале) */
export function cleanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  let cleanedDigits = digits.startsWith('7') ? digits : `7${digits}`;
  
  // Убедиться, что это 11 цифр (7 + 10 цифр номера)
  if (cleanedDigits.length !== 11) {
    cleanedDigits = cleanedDigits.slice(0, 11);
  }
  
  return `+${cleanedDigits}`;
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
