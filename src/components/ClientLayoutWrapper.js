'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import Navbar from './Navbar';
import CartDrawer from './CartDrawer';

export default function ClientLayoutWrapper({ children }) {
  const { cart, isCartOpen, setIsCartOpen, updateQty, removeItem, toasts } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Refresh ScrollTrigger calculations on page change
    ScrollTrigger.refresh();

    // Set up scroll reveals in a clean GSAP context
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal').forEach((el) => {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        });
      });
    });

    return () => {
      ctx.revert(); // Kills all ScrollTriggers created in this context on unmount or route change
    };
  }, [pathname]);

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
