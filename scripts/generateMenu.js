#!/usr/bin/env node

/**
 * Скрипт для сканирования папки Menu12 и генерирования menu.ts
 * Запускается перед сборкой Vite
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MENU_CATEGORIES = [
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

const MENU12_PATH = path.join(__dirname, '../Menu12');
const OUTPUT_PATH = path.join(__dirname, '../src/data/menu.ts');

function findImageFile(itemPath) {
  const files = fs.readdirSync(itemPath);
  for (const file of files) {
    if (/\.(jpg|jpeg|png|webp)$/i.test(file)) {
      return file;
    }
  }
  return null;
}

function loadMenuItem(categoryPath, itemName, category) {
  const itemPath = path.join(categoryPath, itemName);
  const textFile = path.join(itemPath, '1.txt');

  if (!fs.existsSync(textFile)) {
    console.warn(`Warning: ${textFile} not found`);
    return null;
  }

  const content = fs.readFileSync(textFile, 'utf-8');
  const lines = content.trim().split('\n');

  if (lines.length < 2) {
    console.warn(`Warning: Invalid format in ${textFile}`);
    return null;
  }

  const price = parseInt(lines[0].trim(), 10);
  const name = lines[1].trim();
  const description = lines.length > 2 ? lines[2].trim() : '';

  if (isNaN(price)) {
    console.warn(`Warning: Invalid price in ${itemName}`);
    return null;
  }

  const imageFile = findImageFile(itemPath);

  const id = /^[0-9]+$/.test(itemName)
    ? itemName
    : `${itemName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`.slice(0, 50);

  return {
    id,
    name: `"${name.replace(/"/g, '\\"')}"`,
    description: `"${description.replace(/"/g, '\\"')}"`,
    weight: '',
    price,
    category: `"${category}"`,
    image: imageFile ? `"Menu12/${category}/${itemName}/${imageFile}"` : `""`,
    isAvailable: true,
  };
}

function generateMenuTS() {
  const menuItems = [];
  let count = 0;

  for (const category of MENU_CATEGORIES) {
    const categoryPath = path.join(MENU12_PATH, category);

    if (!fs.existsSync(categoryPath)) {
      console.log(`Category folder not found: ${category}`);
      continue;
    }

    const items = fs.readdirSync(categoryPath);

    for (const itemName of items) {
      const itemPath = path.join(categoryPath, itemName);
      const stat = fs.statSync(itemPath);

      if (!stat.isDirectory()) continue;

      const menuItem = loadMenuItem(categoryPath, itemName, category);
      if (menuItem) {
        menuItems.push(menuItem);
        count++;
      }
    }
  }

  // Генерировать TypeScript код
  let tsCode = `import type { MenuCategory, MenuItem } from '../types';

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
 * Генерировано: ${new Date().toISOString()}
 */
export const menuItems: MenuItem[] = [
`;

  for (const item of menuItems) {
    tsCode += `  {
    id: '${item.id}',
    name: ${item.name},
    description: ${item.description},
    weight: '${item.weight || ''}',
    price: ${item.price},
    category: ${item.category},
    image: ${item.image},
    isAvailable: ${item.isAvailable},
  },
`;
  }

  tsCode += `];

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
`;

  fs.writeFileSync(OUTPUT_PATH, tsCode, 'utf-8');
  console.log(`✓ Generated menu.ts with ${count} items`);
}

try {
  generateMenuTS();
} catch (error) {
  console.error('Error generating menu.ts:', error);
  process.exit(1);
}
