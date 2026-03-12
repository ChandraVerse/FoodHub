import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('foodhub_cart');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setRestaurantId(parsed.restaurantId || null);
          setRestaurantName(parsed.restaurantName || '');
          setItems(parsed.items || []);
        } catch {
          setRestaurantId(null);
          setRestaurantName('');
          setItems([]);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(
        'foodhub_cart',
        JSON.stringify({ restaurantId, restaurantName, items })
      );
    }
  }, [restaurantId, restaurantName, items]);

  const clearCart = () => {
    setRestaurantId(null);
    setRestaurantName('');
    setItems([]);
  };

  const addItem = (restaurant, menuItem, quantity = 1) => {
    if (!restaurant || !menuItem) return;
    if (restaurantId && restaurantId !== restaurant.id) {
      clearCart();
    }
    setRestaurantId(restaurant.id);
    setRestaurantName(restaurant.name || '');
    setItems((prev) => {
      const existing = prev.find((i) => i.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.id === menuItem.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [
        ...prev,
        {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity
        }
      ];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const removeItem = (itemId) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <CartContext.Provider
      value={{
        restaurantId,
        restaurantName,
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};

