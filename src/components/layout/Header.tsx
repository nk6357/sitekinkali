import { useState, useEffect } from 'react';
import { useCart } from '../../hooks/useCart';
import { Icon } from '../icons/Icon';
import { getCartBadgeText } from '../../utils/formatters';

/**
 * Sticky-шапка сайта с логотипом, навигацией и кнопкой корзины
 * На мобильных: компактный вид с бургер-меню
 */
export function Header() {
  const { totalItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Отслеживать скролл для эффекта backdrop-blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Главная', href: '#' },
    { label: 'Меню', href: '#menu' },
    { label: 'О ресторане', href: '#about' },
    { label: 'Доставка', href: '#delivery' },
    { label: 'Контакты', href: '#contacts' },
  ];

  const badgeText = getCartBadgeText(totalItems);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-50/80 backdrop-blur-md shadow-sm'
          : 'bg-brand-50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Логотип */}
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            <Icon name="аватар" size="md" alt="Логотип" />
          </a>

          {/* Навигация (видна только на десктопе) */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-body text-brand-900 hover:text-brand-700 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Кнопка корзины + бургер-меню */}
          <div className="flex items-center gap-4">
            {/* Кнопка корзины */}
            <button
              onClick={openCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-lg 
                bg-brand-900 text-brand-50 hover:bg-brand-800 transition-colors"
              aria-label="Открыть корзину"
            >
              <Icon name="инфо" size="md" alt="Корзина" className="text-brand-50" />
              
              {/* Бейдж с количеством */}
              {badgeText && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center 
                  w-5 h-5 rounded-full bg-red-500 text-white text-xs font-semibold">
                  {badgeText}
                </span>
              )}
            </button>

            {/* Бургер-меню (видно только на мобильных) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg 
                bg-brand-900 text-brand-50 hover:bg-brand-800 transition-colors"
              aria-label="Открыть меню"
            >
              <Icon name="меню" size="md" alt="Меню" className="text-brand-50" />
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 flex flex-col gap-2 pb-4">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-brand-900 hover:bg-brand-100 transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
