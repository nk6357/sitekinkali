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
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(item);
  };

  return (
    <div
      className="group bg-white rounded-xl border-2 border-brand-200 overflow-hidden 
        hover:shadow-lg hover:scale-102 transition-all duration-300"
    >
      {/* Фото блюда */}
      <div className="relative h-48 bg-brand-100 overflow-hidden">
        {item.image ? (
          <img
            src={`/menu/${item.image}`}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center p-4 text-center 
              text-brand-700 text-sm"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-xs mt-2">(Фото не загружено)</p>
            </div>
          </div>
        )}
      </div>

      {/* Контент карточки */}
      <div className="p-4 flex flex-col h-full">
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
        <p className="font-body text-xs text-brand-500 mb-3">
          {item.weight}
        </p>

        {/* Цена и кнопка (липкие внизу) */}
        <div className="mt-auto pt-4 flex items-end justify-between gap-3">
          <span className="font-heading text-2xl font-semibold text-brand-900">
            {formatPrice(item.price)}
          </span>

          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={!item.isAvailable}
            className="px-4 py-2 text-sm"
          >
            {item.isAvailable ? 'В корзину' : 'Нет в наличии'}
          </Button>
        </div>
      </div>
    </div>
  );
}
