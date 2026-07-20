import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import type { CartContextValue } from '../types';

/**
 * Кастомный хук для доступа к контексту корзины
 * Используется во всех компонентах, которым нужны методы корзины
 * 
 * @throws Error если хук используется вне CartProvider
 * @returns CartContextValue с методами управления корзиной
 */
export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
