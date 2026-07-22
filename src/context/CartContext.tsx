import React, { createContext, useState, useCallback, useEffect } from 'react';
import type { CartContextValue, MenuItem } from '../types';

/**
 * React Context для управления корзиной
 * Включает функции добавления/удаления товаров, управление состоянием открытия модального окна,
 * сохранение корзины в localStorage
 */
export const CartContext = createContext<CartContextValue | undefined>(undefined);

interface CartProviderProps {
  children: React.ReactNode;
}

const CART_STORAGE_KEY = 'kinkali-restaurant-cart';

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState(() => {
    // Загрузить корзину из localStorage при инициализации
    if (typeof window === 'undefined') return [];
    
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isCheckout, setIsCheckout] = useState(false);

  // Сохранять корзину в localStorage при любых изменениях
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ошибки сохранения игнорируем
    }
  }, [items]);

  // Добавить товар в корзину (или увеличить количество, если уже есть)
  const addItem = useCallback((item: MenuItem) => {
    setItems((prev: typeof items) => {
      const existingItem = prev.find((cartItem: any) => cartItem.menuItem.id === item.id);

      if (existingItem) {
        return prev.map((cartItem: any) =>
          cartItem.menuItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }

      return [...prev, { menuItem: item, quantity: 1 }];
    });
  }, []);

  // Удалить товар из корзины полностью
  const removeItem = useCallback((id: string) => {
    setItems((prev: typeof items) => prev.filter((cartItem: any) => cartItem.menuItem.id !== id));
  }, []);

  // Изменить количество товара (если quantity <= 0, удалить из корзины)
  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev: typeof items) =>
      prev.map((cartItem: any) =>
        cartItem.menuItem.id === id ? { ...cartItem, quantity } : cartItem
      )
    );
  }, [removeItem]);

  // Очистить корзину полностью
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  // Открыть модальное окно корзины
  const openCart = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Закрыть модальное окно корзины
  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Открыть страницу оформления заказа
  const openCheckout = useCallback(() => {
    setIsCheckout(true);
    setIsOpen(false);
  }, []);

  // Закрыть страницу оформления заказа
  const closeCheckout = useCallback(() => {
    setIsCheckout(false);
  }, []);

  // Подсчитать общую сумму
  const totalPrice = items.reduce((sum: number, cartItem: any) => {
    return sum + cartItem.menuItem.price * cartItem.quantity;
  }, 0);

  // Подсчитать общее количество позиций
  const totalItems = items.reduce((count: number, cartItem: any) => {
    return count + cartItem.quantity;
  }, 0);

  const value: CartContextValue = {
    items,
    isOpen,
    isCheckout,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    openCheckout,
    closeCheckout,
    totalPrice,
    totalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
