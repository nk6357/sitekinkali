import { useMemo } from 'react';
import { MenuCard } from './MenuCard';
import type { MenuItem } from '../../types';

interface MenuGridProps {
  items: MenuItem[];
  activeCategory: string;
}

/**
 * Сетка карточек блюд для текущей категории
 * 2 колонки на мобильном, 3 на планшете, 4 на широком экране
 */
export function MenuGrid({ items, activeCategory }: MenuGridProps) {
  // Фильтровать блюда по активной категории
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  if (filteredItems.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-brand-700 text-lg">
          В этой категории пока нет блюд. Загляните позже!
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8 xl:gap-10 animate-fadeIn"
    >
      {filteredItems.map((item) => (
        <MenuCard key={item.id} item={item} />
      ))}
    </div>
  );
}
