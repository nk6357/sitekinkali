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
        <h2 className="font-heading text-4xl md:text-5xl font-semibold text-brand-900 mb-12 text-center">
          Наше меню
        </h2>

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
