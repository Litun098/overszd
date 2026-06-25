'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';

export default function ClientLayoutWrapper({ children }) {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeItem, toasts } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <Navbar cartCount={cartCount} onBagClick={() => setIsCartOpen(true)} />
      
      <main style={{ minHeight: '100vh', paddingTop: '4rem' }}>
        {children}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQty={updateQty}
        onRemoveItem={removeItem}
      />

      {/* Toast Alert Popups */}
      <div id="toastContainer" className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type} show`}>
            {t.type === 'success' ? '✳' : '✕'} {t.message}
          </div>
        ))}
      </div>
    </>
  );
}
