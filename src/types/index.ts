import type { ReactNode } from 'react';

/** Имена PNG-иконок из брендбука (/public/icons/) */
export type IconName =
  | 'меню'
  | 'тг'
  | 'инфо'
  | 'интерьер'
  | 'ивенты'
  | 'сердце'
  | 'лупа с человеком внутри'
  | 'бар'
  | 'аватар';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
  name: IconName;
  size?: IconSize;
  className?: string;
  alt?: string;
}

/** Категории меню — строгий порядок отображения */
export type MenuCategory =
  | 'Холодные закуски'
  | 'Горячие закуски'
  | 'Салаты'
  | 'Супы'
  | 'Фирменные "Кинкали"'
  | 'Хинкали'
  | 'Выпечка'
  | 'Блюда на гриле'
  | 'Горячие блюда'
  | 'Гарниры'
  | 'Соусы'
  | 'Десерты'
  | 'Горячие напитки'
  | 'Безалкогольные напитки'
  | 'Алкоголь'
  | 'Фуршетное меню';

/** Позиция меню — «база данных» из src/data/menu.ts */
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  weight: string;
  price: number;
  category: MenuCategory;
  image: string;
  isAvailable: boolean;
}

/** Элемент корзины */
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

/** Данные формы предзаказа */
export interface OrderFormData {
  name: string;
  phone: string;
  pickupDateTime: string;
  comment: string;
  consent: boolean;
}

/** Состояние и методы корзины (React Context) */
export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  isCheckout: boolean;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  totalPrice: number;
  totalItems: number;
}

/** Пропсы UI-компонентов */
export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'yandex';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
}

export interface InputProps {
  id: string;
  label: string;
  type?: 'text' | 'tel' | 'datetime-local' | 'textarea' | 'checkbox';
  value?: string | boolean;
  onChange?: (value: string | boolean) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  rows?: number;
  className?: string;
  maxLength?: number;
  pattern?: string;
  disabled?: boolean;
  checked?: boolean;
}
