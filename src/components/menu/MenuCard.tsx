import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';
import type { MenuItem } from '../../types';
import type { SyntheticEvent } from 'react';
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

  const handleImageError = (
    event: SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const img = event.currentTarget;
    if (img.src.includes(`${pngImage}`)) {
      img.onerror = null;
      img.src = jpgImage;
      return;
    }

    if (img.src.includes(`${jpgImage}`)) {
      img.onerror = null;
      img.src = placeholderImage;
      return;
    }

    img.onerror = null;
  };

  return (
    <div
      data-menu-id={item.id}
      className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-brand-200 
        bg-white hover:shadow-lg hover:scale-102 transition-all duration-300"
    >
      <span className="sr-only">ID блюда {item.id}</span>

      {/* Фото блюда */}
      <div className="relative h-48 bg-brand-100 overflow-hidden">
        <img
          src={pngImage}
          alt={item.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>

      {/* Контент карточки */}
      <div className="p-4 flex flex-col flex-1">
        {/* Название */}
        <h3 className="font-heading font-semibold text-lg text-brand-900 mb-2 line-clamp-2">
          {item.name}
        </h3>

        {/* Описание */}
        {item.description && (
          <p className="font-body text-sm text-brand-700 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Вес/выход */}
        {item.weight && (
          <p className="font-body text-xs text-brand-500 mb-3">
            {item.weight}
          </p>
        )}

        <div className="mt-auto border-t border-brand-100 pt-4 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <span className="font-heading text-2xl font-semibold text-brand-900">
              {formatPrice(item.price)}
            </span>

            {quantity > 0 ? (
              <div className="inline-flex h-10 min-w-[140px] items-center justify-between rounded-lg bg-brand-900 px-3 text-brand-50 font-heading font-semibold text-sm">
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
                className="h-10 min-w-[140px] px-3 text-sm"
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
