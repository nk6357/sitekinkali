import { useEffect, useState, useMemo } from 'react';
import { CategoryFilter } from '../menu/CategoryFilter';
import { MenuGrid } from '../menu/MenuGrid';
import { MENU_CATEGORIES, menuItems } from '../../data/menu';
import type { MenuCategory } from '../../types';

/**
 * Основная секция каталога меню с фильтром по категориям
 */
export function Menu() {
  const [activeCategory, setActiveCategory] = useState<MenuCategory | null>(() =>
    window.matchMedia('(max-width: 639px)').matches ? null : MENU_CATEGORIES[0],
  );

  // Получить уникальные категории, присутствующие в меню
  const availableCategories = useMemo(() => {
    const categoriesInMenu = new Set(menuItems.map((item) => item.category));
    return MENU_CATEGORIES.filter((cat) => categoriesInMenu.has(cat));
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia('(min-width: 640px)');
    const ensureDesktopCategory = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) {
        setActiveCategory((current) => current ?? availableCategories[0] ?? null);
      }
    };

    ensureDesktopCategory(desktopQuery);
    desktopQuery.addEventListener('change', ensureDesktopCategory);
    return () => desktopQuery.removeEventListener('change', ensureDesktopCategory);
  }, [availableCategories]);

  return (
    <section id="menu-section" className="bg-brand-50 py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        {/* Заголовок */}
      <div className="mb-8 text-center sm:mb-12">
        <img
          src="/brandbook/кинкали%20надпись%20%2B%20лого.jpg"
          alt="Кинкали"
          className="mx-auto h-auto w-[190px] max-w-full sm:w-[260px] lg:w-[280px]"
        />
      </div>
        {/* Фильтр категорий */}
        <CategoryFilter
          categories={availableCategories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {activeCategory && (
          <div className="mt-5 sm:mt-8">
            <button
              type="button"
              onClick={() => setActiveCategory(null)}
              className="mb-4 inline-flex h-10 items-center whitespace-nowrap rounded-lg bg-brand-100 px-4 font-heading text-sm font-semibold text-brand-900 sm:hidden"
            >
              ← Все разделы
            </button>
            <MenuGrid items={menuItems} activeCategory={activeCategory} />
          </div>
        )}
      </div>
    </section>
  );
}
