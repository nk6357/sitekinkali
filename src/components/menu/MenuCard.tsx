import { useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';
import type { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface MenuCardProps {
  item: MenuItem;
}

/**
 * Карточка блюда: фото, название, описание, цена, кнопка "В корзину"
 */
export function MenuCard({ item }: MenuCardProps) {
  const { addItem, items, updateQuantity } = useCart();

  const cartItem = items.find((cartItem) => cartItem.menuItem.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAddToCart = () => {
    addItem(item);
  };

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1);
  };

  const placeholderImage = '/brandbook/аватар.png';
  const pngImage = `/id21/${item.id}.png`;
  const jpgImage = `/id21/${item.id}.jpg`;
  const imageSources = [
    item.image || '',
    pngImage,
    jpgImage,
    placeholderImage,
  ].filter(Boolean);

  const [imageSrc, setImageSrc] = useState<string>(imageSources[0]);

  useEffect(() => {
    setImageSrc(imageSources[0]);
  }, [item.image, item.id]);

  const handleImageError = () => {
    setImageSrc((currentSrc) => {
      const currentIndex = imageSources.indexOf(currentSrc);
      const nextIndex = Math.min(currentIndex + 1, imageSources.length - 1);
      return imageSources[nextIndex];
    });
  };

  return (
    <div
      data-menu-id={item.id}
      className="group flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-brand-200 bg-white transition-all duration-300 hover:shadow-lg"
    >
      <span className="sr-only">ID блюда {item.id}</span>

      {/* Фото блюда */}
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
        <img
          src={imageSrc}
          alt={item.name}
          loading="lazy"
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Контент карточки */}
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {/* Название */}
        <h3 className="mb-1.5 line-clamp-3 font-heading text-sm font-semibold leading-snug text-brand-900 sm:mb-2 sm:text-lg">
          {item.name}
        </h3>

        {/* Описание */}
        {item.description && (
          <p className="mb-2 line-clamp-3 font-body text-xs leading-snug text-brand-700 sm:mb-3 sm:text-sm">
            {item.description}
          </p>
        )}

        {/* Вес/выход */}
        {item.weight && (
          <p className="mb-2 font-body text-[11px] leading-snug text-brand-500 sm:mb-3 sm:text-xs">
            {item.weight}
          </p>
        )}

        <div className="mt-auto border-t border-brand-100 pt-3 sm:pt-4">
          <div className="flex flex-col gap-2 sm:gap-3 xl:flex-row xl:items-center xl:justify-between">
            <span className="whitespace-nowrap font-heading text-base font-semibold text-brand-900 sm:text-xl">
              {formatPrice(item.price)}
            </span>

            {quantity > 0 ? (
              <div className="inline-flex h-10 w-full items-center justify-between rounded-lg bg-brand-900 px-2 font-heading text-sm font-semibold text-brand-50 xl:max-w-[150px]">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-900 font-semibold transition-colors hover:bg-brand-100"
                  aria-label="Уменьшить количество"
                >
                  −
                </button>
                <span className="min-w-[1.5rem] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 text-brand-900 font-semibold transition-colors hover:bg-brand-100"
                  aria-label="Увеличить количество"
                >
                  +
                </button>
              </div>
            ) : (
              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={!item.isAvailable}
                className="h-10 w-full whitespace-nowrap px-2 text-xs sm:text-sm xl:max-w-[140px]"
              >
                {item.isAvailable ? 'В корзину' : 'Нет в наличии'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
