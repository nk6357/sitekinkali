import type { MenuCategory, MenuItem } from '../types';

/** Категории меню — строгий порядок отображения на сайте */
export const MENU_CATEGORIES: MenuCategory[] = [
  'Холодные закуски',
  'Горячие закуски',
  'Салаты',
  'Супы',
  'Фирменные "Кинкали"',
  'Хинкали',
  'Выпечка',
  'Блюда на гриле',
  'Горячие блюда',
  'Гарниры',
  'Соусы',
  'Десерты',
  'Горячие напитки',
  'Безалкогольные напитки',
  'Алкоголь',
  'Фуршетное меню',
];

/**
 * База блюд ресторана.
 * Автоматически генерируется из структуры Menu12/
 * Генерировано: 2026-07-20T18:07:27.104Z
 */
export const menuItems: MenuItem[] = [
  {
    id: '67-1784570847104',
    name: "хлеб йоу",
    description: "ароматный неупавший хлебушек",
    weight: '""',
    price: 499,
    category: "Алкоголь",
    image: "Menu12/Алкоголь/67/image.png",
    isAvailable: true,
  },
];

/** Файлы меню для скачивания (PDF и DOCX из брендбука) */
export const MENU_DOWNLOADS = [
  {
    id: 'restaurant-menu',
    title: 'Меню ресторана',
    description: 'Полное меню ресторана в формате PDF',
    fileName: 'Меню ресторана Кинкали.pdf',
    href: '/brandbook/Меню ресторана Кинкали.pdf',
  },
  {
    id: 'buffet-menu',
    title: 'Фуршетное меню',
    description: 'Горячие позиции для мероприятий в формате DOCX',
    fileName: 'Фуршетное меню горячее.docx',
    href: '/brandbook/Фуршетное меню горячее.docx',
  },
] as const;

/** Получить блюда по категории */
export function getMenuByCategory(category: MenuCategory): MenuItem[] {
  return menuItems.filter((item) => item.category === category);
}

/** Получить блюдо по id */
export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}
