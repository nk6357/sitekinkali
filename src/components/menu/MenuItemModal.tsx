import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { MenuItem } from '../../types';
import { formatPrice } from '../../utils/formatters';
import { Button } from '../ui/Button';

interface MenuItemModalProps {
  item: MenuItem;
  imageSrc: string;
  quantity: number;
  isOpen: boolean;
  onClose: () => void;
  onImageError: () => void;
  onAddToCart: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ANIMATION_DURATION_MS = 350;

/**
 * Полноэкранная карточка блюда с полным текстом и управлением корзиной.
 */
export function MenuItemModal({
  item,
  imageSrc,
  quantity,
  isOpen,
  onClose,
  onImageError,
  onAddToCart,
  onIncrement,
  onDecrement,
}: MenuItemModalProps) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let animationFrameId: number | undefined;
    let timeoutId: number | undefined;

    if (isOpen) {
      setIsMounted(true);
      animationFrameId = window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else if (isMounted) {
      setIsVisible(false);
      timeoutId = window.setTimeout(() => {
        setIsMounted(false);
      }, ANIMATION_DURATION_MS);
    }

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [isOpen, isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const previousOverflow = document.body.style.overflow;
    let focusFrameId: number | undefined;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    if (isOpen) {
      focusFrameId = window.requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
    }

    return () => {
      if (focusFrameId) {
        window.cancelAnimationFrame(focusFrameId);
      }
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMounted, isOpen, onClose]);

  if (!isMounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-[70] flex bg-brand-900/70 p-0 backdrop-blur-sm transition-opacity duration-[350ms] ease-out md:p-5 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={`menu-item-title-${item.id}`}
        className={`relative m-auto flex h-full w-full flex-col overflow-hidden bg-brand-50 shadow-2xl transition-[opacity,transform] duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:max-h-[calc(100vh-2.5rem)] md:max-w-6xl md:rounded-2xl lg:flex-row ${
          isVisible
            ? 'translate-y-0 scale-100 opacity-100'
            : 'translate-y-5 scale-[0.97] opacity-0'
        }`}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-brand-50/95 font-heading text-3xl leading-none text-brand-900 shadow-md transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-brand-900 focus:ring-offset-2 sm:right-5 sm:top-5"
          aria-label="Закрыть карточку блюда"
        >
          ×
        </button>

        <div className="relative min-h-[34vh] shrink-0 overflow-hidden bg-brand-100 sm:min-h-[42vh] lg:h-full lg:min-h-0 lg:w-[58%]">
          {item.spiceLevel > 0 && (
            <div
              className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1 sm:left-5 sm:top-5"
              aria-label={`Острота: ${item.spiceLevel}`}
            >
              {Array.from({ length: item.spiceLevel }, (_, index) => (
                <img
                  key={index}
                  src="/icons/chili.png"
                  alt=""
                  aria-hidden="true"
                  className="h-6 w-6 object-contain drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)] sm:h-7 sm:w-7"
                />
              ))}
            </div>
          )}

          <img
            src={imageSrc}
            alt={item.name}
            onError={onImageError}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-5 pt-6 sm:p-8 lg:w-[42%] lg:p-10">
          <span className="sr-only">ID блюда {item.id}</span>

          <h2
            id={`menu-item-title-${item.id}`}
            className="pr-12 font-heading text-2xl font-semibold leading-tight text-brand-900 sm:text-3xl lg:pr-0 lg:text-4xl"
          >
            {item.name}
          </h2>

          {item.description && (
            <p className="mt-5 whitespace-pre-line font-body text-base leading-relaxed text-brand-700 sm:text-lg">
              {item.description}
            </p>
          )}

          {item.weight && (
            <p className="mt-4 font-body text-sm leading-relaxed text-brand-500 sm:text-base">
              {item.weight}
            </p>
          )}

          <div className="mt-auto pt-8">
            <div className="border-t border-brand-200 pt-5">
              <span className="block whitespace-nowrap font-heading text-2xl font-semibold text-brand-900 sm:text-3xl">
                {formatPrice(item.price)}
              </span>

              <div className="mt-5">
                {quantity > 0 ? (
                  <div className="inline-flex h-12 w-full items-center justify-between rounded-lg bg-brand-900 px-3 font-heading text-base font-semibold text-brand-50">
                    <button
                      type="button"
                      onClick={onDecrement}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
                      aria-label="Уменьшить количество"
                    >
                      −
                    </button>
                    <span className="min-w-[2rem] text-center">{quantity}</span>
                    <button
                      type="button"
                      onClick={onIncrement}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 font-semibold text-brand-900 transition-colors hover:bg-brand-100"
                      aria-label="Увеличить количество"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    onClick={onAddToCart}
                    disabled={!item.isAvailable}
                    className="h-12 w-full"
                  >
                    {item.isAvailable ? 'В корзину' : 'Нет в наличии'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}
