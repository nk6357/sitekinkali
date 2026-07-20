import type { IconProps, IconSize } from '../../types';

/** Размеры иконок в пикселях */
const SIZE_MAP: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

/**
 * Компонент для рендеринга PNG-иконок из брендбука.
 * Использует только файлы из /public/icons/ — без SVG и сторонних библиотек.
 */
export function Icon({
  name,
  size = 'md',
  className = '',
  alt,
}: IconProps) {
  const dimension = SIZE_MAP[size];
  const src = `/icons/${encodeURIComponent(name)}.png`;

  return (
    <img
      src={src}
      alt={alt ?? name}
      width={dimension}
      height={dimension}
      className={`inline-block object-contain ${className}`}
      loading="lazy"
      decoding="async"
    />
  );
}

export default Icon;
