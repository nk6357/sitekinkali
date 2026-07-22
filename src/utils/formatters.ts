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
  
  // Привести к стандартной форме: 11 цифр, начинающихся с 7
  let normalizedDigits: string;
  
  if (digits.length === 0) {
    return '';
  }
  
  // Если уже начинается с 7 и ровно 11 цифр
  if (digits.startsWith('7') && digits.length === 11) {
    normalizedDigits = digits.slice(1); // Берем 10 цифр без начальной 7
  }
  // Если начинается с 8 (вариант записи внутри России)
  else if (digits.startsWith('8') && digits.length === 11) {
    normalizedDigits = digits.slice(1); // Берем 10 цифр без начальной 8
  }
  // Если ровно 10 цифр
  else if (digits.length === 10) {
    normalizedDigits = digits;
  }
  // Если 11 цифр и не начинается с 7 или 8
  else if (digits.length === 11) {
    normalizedDigits = digits.slice(1);
  }
  // Во всех остальных случаях паддируем или обрезаем до 10 цифр
  else {
    normalizedDigits = digits.padStart(10, '0').slice(-10);
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
