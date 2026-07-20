import { useCart } from '../../hooks/useCart';
import type { CartItem } from '../../types';
import { formatPrice } from '../../utils/formatters';

interface CartItemProps {
  cartItem: CartItem;
}

/**
 * Строка товара в корзине с управлением количеством и удалением
 */
export function CartItemComponent({ cartItem }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    updateQuantity(cartItem.menuItem.id, cartItem.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(cartItem.menuItem.id, cartItem.quantity - 1);
  };

  const handleRemove = () => {
    removeItem(cartItem.menuItem.id);
  };

  const itemTotal = cartItem.menuItem.price * cartItem.quantity;

  return (
    <div className="flex gap-4 py-4 border-b border-brand-200">
      {/* Фото (если есть) */}
      <div className="flex-shrink-0 w-20 h-20 bg-brand-100 rounded-lg overflow-hidden">
        {cartItem.menuItem.image ? (
          <img
            src={`/menu/${cartItem.menuItem.image}`}
            alt={cartItem.menuItem.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-brand-700 text-center p-1">
            Фото
          </div>
        )}
      </div>

      {/* Информация */}
      <div className="flex-1 min-w-0">
        <h4 className="font-heading font-semibold text-brand-900 truncate">
          {cartItem.menuItem.name}
        </h4>
        <p className="text-xs text-brand-500 mt-1">
          {cartItem.menuItem.weight}
        </p>
        <p className="text-sm text-brand-700 font-semibold mt-1">
          {formatPrice(cartItem.menuItem.price)} за шт.
        </p>
      </div>

      {/* Управление количеством */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 border-2 border-brand-200 rounded-lg px-2 py-1">
          <button
            onClick={handleDecrement}
            className="text-brand-900 hover:text-brand-700 font-semibold w-6 h-6 flex items-center justify-center"
            aria-label="Уменьшить количество"
          >
            −
          </button>
          <span className="w-6 text-center font-semibold text-brand-900">
            {cartItem.quantity}
          </span>
          <button
            onClick={handleIncrement}
            className="text-brand-900 hover:text-brand-700 font-semibold w-6 h-6 flex items-center justify-center"
            aria-label="Увеличить количество"
          >
            +
          </button>
        </div>

        {/* Стоимость позиции */}
        <div className="text-right">
          <p className="text-sm text-brand-700">Итого:</p>
          <p className="font-heading font-semibold text-lg text-brand-900">
            {formatPrice(itemTotal)}
          </p>
        </div>

        {/* Кнопка удаления */}
        <button
          onClick={handleRemove}
          className="text-xs text-brand-700 hover:text-red-500 font-semibold mt-1 transition-colors"
        >
          Удалить
        </button>
      </div>
    </div>
  );
}
