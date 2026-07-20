import { useState, useCallback, type ChangeEvent } from 'react';
import type { InputProps } from '../../types';
import { formatPhone, cleanPhone } from '../../utils/formatters';

/**
 * Универсальный компонент Input для всех типов полей ввода
 * Поддерживает валидацию, маски для телефонов, placeholder
 */
export function Input({
  id,
  label,
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  required = false,
  className = '',
  maxLength,
  pattern,
  disabled = false,
  rows,
  checked,
}: InputProps & {
  value?: string;
  onChange?: (value: string | boolean) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  rows?: number;
  checked?: boolean;
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Специальная обработка для телефона: форматирование и маска
  const handlePhoneChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const cleaned = cleanPhone(input);
      const formatted = formatPhone(cleaned);
      onChange?.(formatted);
    },
    [onChange]
  );

  // Базовые классы для всех инпутов
  const baseClasses =
    'w-full px-4 py-3 rounded-lg font-body border-2 transition-all duration-200';

  // Стили в зависимости от состояния
  const stateClasses = isFocused
    ? 'border-brand-900 bg-brand-50'
    : 'border-brand-200 bg-white hover:border-brand-300';

  const inputClasses = `${baseClasses} ${stateClasses} ${className}`;

  // Чекбокс
  if (type === 'checkbox') {
    return (
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="w-5 h-5 rounded border-2 border-brand-200 cursor-pointer accent-brand-900"
          disabled={disabled}
        />
        <span className="text-sm text-brand-700">{label}</span>
      </label>
    );
  }

  // Textarea
  if (type === 'textarea') {
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-brand-900">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          rows={rows || 4}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`${inputClasses} resize-none`}
        />
      </div>
    );
  }

  // Обычный инпут (text, tel, datetime-local)
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-brand-900">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={type === 'tel' ? handlePhoneChange : (e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        pattern={pattern}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={inputClasses}
      />
    </div>
  );
}
