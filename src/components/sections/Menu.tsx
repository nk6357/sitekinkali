import { useState, useMemo } from 'react';
import { CategoryFilter } from '../menu/CategoryFilter';
import { MenuGrid } from '../menu/MenuGrid';
import { MENU_CATEGORIES, menuItems } from '../../data/menu';
import type { MenuCategory } from '../../types';

/**
 * Основная секция каталога меню с фильтром по категориям
 */
export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(MENU_CATEGORIES[0]);

  // Получить уникальные категории, присутствующие в меню
  const availableCategories = useMemo(() => {
    const categoriesInMenu = new Set(menuItems.map((item) => item.category));
    return MENU_CATEGORIES.filter((cat) => categoriesInMenu.has(cat));
  }, []);

  return (
    <section id="menu-section" className="bg-brand-50 py-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Заголовок */}
      <div className="mb-12 text-center">
        <img
          src="/brandbook/кинкали%20надпись%20+%20лого.jpg"
          alt="Кинкали"
          className="mx-auto h-auto max-w-[220px] sm:max-w-[280px]"
        />
      </div>
        {/* Фильтр категорий */}
        <CategoryFilter
          categories={availableCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Сетка блюд */}
        <div className="mt-8">
          <MenuGrid items={menuItems} activeCategory={activeCategory} />
        </div>
      </div>
    </section>
  );
}
