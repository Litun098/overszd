'use client';

import React, { createContext, useContext, useState } from 'react';
import gsap from 'gsap';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Trigger toast message
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    // auto dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  // Add item to cart
  const addToCart = (id, name, price, size, label) => {
    setCart((prevCart) => {
      const idx = prevCart.findIndex((item) => item.id === id && item.size === size);
      if (idx > -1) {
        const newCart = [...prevCart];
        newCart[idx].qty += 1;
        return newCart;
      } else {
        return [...prevCart, { id, name, price, size, qty: 1, label }];
      }
    });

    // Bounce animation on navbar Bag counter button
    const bagBtn = document.querySelector('.bag');
    if (bagBtn) {
      gsap.fromTo(bagBtn, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' });
    }

    setIsCartOpen(true);
    showToast(`Added ${name} (${size}) to Bag.`, 'success');
  };

  // Update item quantity in cart
  const updateQty = (index, delta) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const newQty = newCart[index].qty + delta;
      if (newQty <= 0) {
        newCart.splice(index, 1);
      } else {
        newCart[index].qty = newQty;
      }
      return newCart;
    });
  };

  // Remove item from cart
  const removeItem = (index) => {
    const item = cart[index];
    setCart((prevCart) => prevCart.filter((_, idx) => idx !== index));
    showToast(`Removed ${item.name} from Bag.`, 'error');
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      isCartOpen,
      setIsCartOpen,
      toasts,
      showToast,
      addToCart,
      updateQty,
      removeItem,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
export { CartContext };
