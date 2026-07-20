import type { MenuItem, MenuCategory } from '../types';
import { MENU_CATEGORIES } from './menu';

/**
 * Загружает товары из структуры папок Menu12/
 * Каждая подпапка - категория, каждая папка внутри - товар с файлом 1.txt и фото
 */
export async function loadMenuItems(): Promise<MenuItem[]> {
  const items: MenuItem[] = [];

  for (const category of MENU_CATEGORIES) {
    try {
      // Получить список товаров в категории
      // Примечание: это работает только если есть какой-то индекс или API
      // Для продакшена нужно использовать backend или генерировать список во время сборки
      const categoryPath = `/Menu12/${encodeURIComponent(category)}`;
      
      // Попытаемся получить список файлов (это не сработает в браузере напрямую)
      // Поэтому используем альтернативный подход - читаем известные товары из заранее подготовленного списка
      // или используем индексный файл
      
      console.log(`Loading items from: ${categoryPath}`);
    } catch (error) {
      console.warn(`Failed to load category ${category}:`, error);
    }
  }

  return items;
}

/**
 * Альтернативный подход: загружать товары через manifest файл
 * Требует заранее подготовленного JSON файла со списком товаров
 */
export async function loadMenuItemsFromManifest(): Promise<MenuItem[]> {
  try {
    const response = await fetch('/Menu12/manifest.json');
    if (response.ok) {
      const items = await response.json();
      return items;
    }
  } catch (error) {
    console.warn('Failed to load menu manifest:', error);
  }
  return [];
}

/**
 * Функция для загрузки конкретного товара по пути
 * itemPath: /Menu12/Категория/НазваниеТовара
 */
export async function loadMenuItem(
  category: MenuCategory,
  itemName: string
): Promise<MenuItem | null> {
  try {
    // Получить содержимое файла 1.txt
    const textPath = `/Menu12/${encodeURIComponent(category)}/${encodeURIComponent(itemName)}/1.txt`;
    const response = await fetch(textPath);
    
    if (!response.ok) {
      return null;
    }

    const text = await response.text();
    const lines = text.trim().split('\n');

    if (lines.length < 2) {
      console.warn(`Invalid menu item format: ${itemName}`);
      return null;
    }

    const price = parseInt(lines[0].trim(), 10);
    const name = lines[1].trim();
    const description = lines.length > 2 ? lines[2].trim() : '';

    if (isNaN(price)) {
      console.warn(`Invalid price for item: ${itemName}`);
      return null;
    }

    // Попытаемся найти изображение (PNG или JPEG)
    let imagePath: string | null = null;
    for (const ext of ['jpg', 'jpeg', 'png', 'webp']) {
      const testPath = `/Menu12/${encodeURIComponent(category)}/${encodeURIComponent(itemName)}/image.${ext}`;
      try {
        const imgResponse = await fetch(testPath, { method: 'HEAD' });
        if (imgResponse.ok) {
          imagePath = testPath;
          break;
        }
      } catch {
        // Continue to next extension
      }
    }

    return {
      id: `${category}-${itemName}`.toLowerCase().replace(/\s+/g, '-'),
      name,
      description,
      weight: '', // Может быть добавлено в 1.txt если нужно
      price,
      category,
      image: imagePath || '',
      isAvailable: true,
    };
  } catch (error) {
    console.warn(`Failed to load menu item ${itemName}:`, error);
    return null;
  }
}
