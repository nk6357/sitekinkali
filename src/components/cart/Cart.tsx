import { useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { CartItemComponent } from './CartItem';
import { Button } from '../ui/Button';
import { formatPrice } from '../../utils/formatters';
import { Icon } from '../icons/Icon';

/**
 * Модальное окно корзины с списком товаров, управлением количеством и переходом к оформлению
 */
export function Cart() {
  const { items, isOpen, closeCart, totalPrice, totalItems } = useCart();

  // Блокировать скролл на весь экран, когда модальное окно открыто
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = () => {
    // Прокрутить к секции заказа и закрыть модальное окно
    closeCart();
    const orderSection = document.getElementById('order-section');
    setTimeout(() => {
      orderSection?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-brand-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Модальное окно */}
      <div
        className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-full max-w-md max-h-[90vh] 
          bg-brand-50 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Заголовок */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-200">
          <h2 className="font-heading text-2xl font-semibold text-brand-900">
            Корзина
          </h2>
          <button
            onClick={closeCart}
            className="text-brand-700 hover:text-brand-900 text-2xl leading-none w-8 h-8 flex items-center justify-center"
            aria-label="Закрыть"
          >
            ×
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <Icon name="инфо" size="lg" alt="Пусто" className="text-brand-400 mb-4 opacity-50" />
              <p className="text-brand-700 font-semibold mb-2">Корзина пуста</p>
              <p className="text-sm text-brand-500 mb-6">
                Добавьте блюда из меню, чтобы начать заказ
              </p>
              <Button variant="primary" onClick={closeCart} className="w-full">
                Назад к меню
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {items.map((cartItem) => (
                <CartItemComponent key={cartItem.menuItem.id} cartItem={cartItem} />
              ))}
            </div>
          )}
        </div>

        {/* Футер с итоговой информацией */}
        {items.length > 0 && (
          <div className="border-t border-brand-200 p-6 space-y-4">
            {/* Итоговая сумма */}
            <div className="flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-brand-900">
                Итого:
              </span>
              <span className="font-heading text-2xl font-semibold text-brand-900">
                {formatPrice(totalPrice)}
              </span>
            </div>

            {/* Кнопки */}
            <div className="flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={handleCheckout}
                className="w-full py-4"
              >
                Оформить предзаказ
              </Button>
              <Button
                variant="secondary"
                onClick={closeCart}
                className="w-full py-4"
              >
                Продолжить покупки
              </Button>
            </div>

            {/* Справка */}
            <p className="text-xs text-brand-500 text-center mt-2">
              {totalItems} {totalItems === 1 ? 'блюдо' : 'блюд'} на сумму {formatPrice(totalPrice)}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
