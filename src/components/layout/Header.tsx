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
    { label: 'Главная', href: '#top' },
    { label: 'Меню', href: '#menu-section' },
    { label: 'О ресторане', href: '#about' },
    { label: 'Доставка', href: '#order-section' },
    { label: 'Бронь', href: '#reservation' },
    { label: 'Контакты', href: '#contacts' },
  ];

  const badgeText = getCartBadgeText(totalItems);

  return (
    <header
      id="top"
      className={`sticky top-0 z-40 w-full border-b border-brand-200 transition-all duration-300 ${
        isScrolled
          ? 'bg-brand-50/90 backdrop-blur-md shadow-sm'
          : 'bg-brand-50'
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex min-h-12 items-center justify-between gap-3">
          {/* Логотип */}
          <a
            href="#top"
            className="flex flex-shrink-0 items-center rounded-lg transition-opacity hover:opacity-75"
            aria-label="На главную"
          >
            <img
              src="/brandbook/аватар.png"
              alt="Кинкали"
              width={52}
              height={52}
              className="h-11 w-11 object-contain sm:h-14 sm:w-14"
              loading="eager"
              decoding="sync"
            />
          </a>

          {/* Навигация (видна только на десктопе) */}
          <nav className="hidden items-center gap-1 rounded-xl bg-brand-100/70 p-1 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="whitespace-nowrap rounded-lg px-4 py-2 font-body text-sm text-brand-900 transition-colors hover:bg-brand-50"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Корзина и мобильное меню */}
          <div className="flex items-center gap-2">
            {/* Кнопка корзины */}
            <button
              onClick={openCart}
              className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full transition-opacity hover:opacity-70"
              aria-label="Открыть корзину"
            >
              <Icon name="cart" size="xl" alt="Корзина" className="h-11 w-11 rounded-full" />
              
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
              className="flex h-11 w-11 flex-shrink-0 flex-col items-center justify-center gap-1.5 rounded-lg lg:hidden"
              aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="h-0.5 w-7 rounded-full bg-brand-900" aria-hidden="true" />
              <span className="h-0.5 w-7 rounded-full bg-brand-900" aria-hidden="true" />
              <span className="h-0.5 w-7 rounded-full bg-brand-900" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        {isMobileMenuOpen && (
          <nav className="mt-3 grid grid-cols-2 gap-2 pb-2 lg:hidden">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="whitespace-nowrap rounded-lg bg-brand-100 px-3 py-3 text-center text-brand-900 transition-colors hover:bg-brand-200"
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
