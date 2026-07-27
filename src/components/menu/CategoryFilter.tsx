import { useEffect, useRef } from 'react';
import type { MenuCategory } from '../../types';

interface CategoryFilterProps {
  categories: MenuCategory[];
  activeCategory: MenuCategory | null;
  onSelectCategory: (category: MenuCategory) => void;
}

/**
 * Горизонтальные табы с категориями меню
 * Sticky при скролле, автоматическая прокрутка к активной категории
 */
export function CategoryFilter({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  // Автоматически прокручивать к активной категории
  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const activeTab = activeTabRef.current;
      const container = containerRef.current;

      container.scrollTo({
        left: activeTab.offsetLeft - (container.clientWidth - activeTab.offsetWidth) / 2,
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`flex min-h-16 items-center justify-center rounded-xl px-3 py-3 text-center font-heading text-sm font-semibold leading-tight transition-colors ${
                isActive
                  ? 'bg-brand-900 text-brand-50'
                  : 'bg-brand-100 text-brand-900 active:bg-brand-300'
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        ref={containerRef}
        className="scrollbar-hide sticky top-[77px] z-30 hidden w-full overflow-x-auto bg-brand-50 py-3 sm:block"
      >
        <div className="scrollbar-hide mx-auto flex max-w-7xl gap-2 overflow-x-auto px-1">
          {categories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                ref={isActive ? activeTabRef : null}
                onClick={() => onSelectCategory(category)}
                className={`flex-shrink-0 whitespace-nowrap rounded-lg px-4 py-2 font-heading text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-900 text-brand-50'
                    : 'bg-brand-100 text-brand-900 hover:bg-brand-300'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
