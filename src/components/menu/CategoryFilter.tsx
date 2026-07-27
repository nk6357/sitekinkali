import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollCues = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const edgeTolerance = 2;
    setCanScrollLeft(container.scrollLeft > edgeTolerance);
    setCanScrollRight(
      container.scrollLeft + container.clientWidth < container.scrollWidth - edgeTolerance,
    );
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    updateScrollCues();
    container.addEventListener('scroll', updateScrollCues, { passive: true });

    const resizeObserver = new ResizeObserver(updateScrollCues);
    resizeObserver.observe(container);

    return () => {
      container.removeEventListener('scroll', updateScrollCues);
      resizeObserver.disconnect();
    };
  }, [categories, updateScrollCues]);

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
  }, [activeCategory, updateScrollCues]);

  const scrollCategories = (direction: -1 | 1) => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollBy({
      left: direction * Math.max(container.clientWidth * 0.72, 240),
      behavior: 'smooth',
    });
  };

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

      <div className="sticky top-[77px] z-30 hidden w-full bg-brand-50 py-3 sm:block">
        <div className="relative mx-auto max-w-7xl">
          <div
            ref={containerRef}
            className="scrollbar-hide flex w-full gap-2 overflow-x-auto px-1"
          >
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

          {canScrollLeft && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-50 via-brand-50/90 to-transparent"
              />
              <button
                type="button"
                aria-label="Показать предыдущие разделы меню"
                onClick={() => scrollCategories(-1)}
                className="absolute left-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-900 font-heading text-2xl leading-none text-brand-50 shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                ‹
              </button>
            </>
          )}

          {canScrollRight && (
            <>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-50 via-brand-50/90 to-transparent"
              />
              <button
                type="button"
                aria-label="Показать следующие разделы меню"
                onClick={() => scrollCategories(1)}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-brand-900 font-heading text-2xl leading-none text-brand-50 shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                ›
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
