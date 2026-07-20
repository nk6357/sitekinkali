import { useEffect, useRef } from 'react';
import type { MenuCategory } from '../../types';

interface CategoryFilterProps {
  categories: MenuCategory[];
  activeCategory: MenuCategory;
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
      activeTabRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [activeCategory]);

  return (
    <div
      ref={containerRef}
      className="sticky top-16 z-30 w-full bg-brand-50 py-3 overflow-x-auto scrollbar-hide"
    >
      <div className="mx-auto max-w-7xl px-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const isActive = activeCategory === category;

          return (
            <button
              key={category}
              ref={isActive ? activeTabRef : null}
              onClick={() => onSelectCategory(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg font-heading font-semibold 
                text-sm transition-all duration-200 whitespace-nowrap ${
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

      {/* Скрытый CSS для скролбара */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
