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
 * Генерировано: 2026-07-22T01:06:17.759Z
 */
export const menuItems: MenuItem[] = [
  {
    id: '1',
    name: "АССОРТИ СОЛЕНИЙ",
    description: "СОЛЕНЬЯ ПО-ГРУЗИНСКИ: ЗЕЛЕНЫЙ ПОМИДОР, СТРУЧКОВЫЙ ПЕРЕЦ, МАРИНОВАННЫЙ ОГУРЕЦ, КРАСНАЯ КАПУСТА, ЧЕСНОК / 300ГР",
    weight: '',
    price: 850,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '10',
    name: "НАДУГИ",
    description: "РУЛЕТ ИЗ СЛИВОЧНО-ТВОРОЖНОГО ГРУЗ. СЫРА / 250ГР",
    weight: '',
    price: 700,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '2',
    name: "АССОРТИ МЯСНЫХ ДЕЛИКАТЕСОВ",
    description: "СУДЖУК, БАСТУРМА И ГОВЯЖИЙ ЯЗЫК / 240ГР",
    weight: '',
    price: 1490,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '3',
    name: "АССОРТИ СЫРНОЕ",
    description: "КЛАССИЧЕСКИЕ СЫРЫ С МЕДОМ И ГРЕЦКИМ ОРЕХОМ / 250ГР / 50ГР",
    weight: '',
    price: 1490,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '4',
    name: "ПАШТЕТ ИЗ КРАСНОГО ЛОБИО",
    description: "ОТВАРНАЯ КРАСНАЯ ФАСОЛЬ С КРАСНЫМ ЛУКОМ, КИНЗОЙ И ЗАПРАВКОЙ ИЗ ГРЕЦКОГО ОРЕХА / 180ГР",
    weight: '',
    price: 450,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '5',
    name: "САЦИВИ С ШАМПИНЬОНАМИ",
    description: "ЖАРЕНЫЕ ШАМПИНЬОНЫ ПОД ОРЕХОВЫМ СОУСОМ С АРОМАТНЫМИ ГРУЗИНСКИМИ СПЕЦИЯМИ / 200ГР",
    weight: '',
    price: 495,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '6',
    name: "САЦИВИ С КУРИЦЕЙ",
    description: "КУРИЦА ПОД ОРЕХОВЫМ СОУСОМ С АРОМАТНЫМИ ГРУЗИНСКИМИ СПЕЦИЯМИ / 200ГР",
    weight: '',
    price: 480,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '7',
    name: "СЫР-ЗЕЛЕНЬ",
    description: "ДОМАШНИЙ СЫР И АРОМАТНАЯ ЗЕЛЕНЬ / 150ГР/100ГР",
    weight: '',
    price: 590,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '8',
    name: "РУЛЕТИКИ ИЗ БАКЛАЖАНОВ (с сырной пастой)",
    description: "С СЫРНОЙ ПАСТОЙ / 200ГР",
    weight: '',
    price: 480,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '9',
    name: "РУЛЕТИКИ ИЗ БАКЛАЖАНОВ (с ореховой пастой)",
    description: "С ОРЕХОВОЙ ПАСТОЙ / 200ГР",
    weight: '',
    price: 530,
    category: "Холодные закуски",
    image: "",
    isAvailable: true,
  },
  {
    id: '67',
    name: "хлеб йоу",
    description: "ароматный неупавший хлебушек",
    weight: '',
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
