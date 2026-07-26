import { useCallback, useEffect, useState } from 'react';
import { useCart } from '../../hooks/useCart';
import { Button } from '../ui/Button';
import type { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { MenuItemModal } from './MenuItemModal';

interface MenuCardProps {
  item: MenuItem;
}

/**
 * Карточка блюда: фото, название, описание, цена, кнопка "В корзину"
 */
export function MenuCard({ item }: MenuCardProps) {
  const { addItem, items, updateQuantity } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItem = items.find((cartItem) => cartItem.menuItem.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

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
    <>
      <article
        data-menu-id={item.id}
        className="group relative flex h-full min-h-0 cursor-pointer flex-col overflow-hidden rounded-xl border border-brand-200 bg-white transition-all duration-300 hover:shadow-lg"
      >
        <button
          type="button"
          onClick={handleOpenModal}
          className="absolute inset-0 z-10 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-900 focus-visible:ring-offset-2"
          aria-label={`Открыть карточку блюда «${item.name}»`}
        />

        <span className="sr-only">ID блюда {item.id}</span>

        {/* Фото блюда */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
          {item.spiceLevel > 0 && (
            <div
              className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-0.5"
              aria-label={`Острота: ${item.spiceLevel}`}
            >
              {Array.from({ length: item.spiceLevel }, (_, index) => (
                <img
                  key={index}
                  src="/icons/chili.png"
                  alt=""
                  aria-hidden="true"
                  className="h-5 w-5 object-contain drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]"
                />
              ))}
            </div>
          )}
          <img
            src={imageSrc}
            alt={item.name}
            loading="lazy"
            onError={handleImageError}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
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
                <div
                  className="relative z-20 inline-flex h-10 w-full items-center justify-between rounded-lg bg-brand-900 px-2 font-heading text-sm font-semibold text-brand-50 xl:max-w-[150px]"
                >
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
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
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-50 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>
              ) : (
                <div
                  className="relative z-20 w-full xl:max-w-[140px]"
                >
                  <Button
                    variant="primary"
                    onClick={handleAddToCart}
                    disabled={!item.isAvailable}
                    className="h-10 w-full whitespace-nowrap px-2 text-xs sm:text-sm"
                  >
                    {item.isAvailable ? 'В корзину' : 'Нет в наличии'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      <MenuItemModal
        item={item}
        imageSrc={imageSrc}
        quantity={quantity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onImageError={handleImageError}
        onAddToCart={handleAddToCart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
    </>
  );
}
