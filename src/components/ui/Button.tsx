import type { ButtonProps } from '../../types';

/**
 * Универсальная кнопка с поддержкой разных стилей
 * Используется для всех действий: добавление в корзину, отправка форм, навигация
 */
export function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
  href,
  target,
  rel,
}: ButtonProps) {
  // Базовые стили для всех кнопок
  const baseClasses =
    'inline-flex items-center justify-center px-6 py-3 rounded-lg font-heading font-semibold ' +
    'transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  // Стили в зависимости от варианта
  const variantClasses = {
    primary:
      'bg-brand-900 text-brand-50 hover:bg-brand-800 active:bg-brand-700',
    secondary:
      'bg-transparent border-2 border-brand-900 text-brand-900 hover:bg-brand-900 hover:text-brand-50',
    yandex:
      'bg-yellow-400 text-black hover:bg-yellow-500 active:bg-yellow-600',
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  // Если это ссылка
  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={buttonClasses}
      >
        {children}
      </a>
    );
  }

  // Обычная кнопка
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={buttonClasses}
    >
      {children}
    </button>
  );
}
