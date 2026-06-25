'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';

export default function OrderSuccess() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Clear cart upon arriving on success page
    clearCart();

    // Read order data from localStorage
    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }

    // Animation entry inside context
    const ctx = gsap.context(() => {
      gsap.from('.success-card', { opacity: 0, scale: 0.9, y: 20, duration: 0.8, ease: 'power3.out' });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div style={{
      background: 'var(--cream)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 1.5rem'
    }}>
      <div className="success-card" style={{
        background: 'var(--cream-2)',
        border: '1px solid var(--char)',
        borderRadius: '32px',
        padding: '3rem 2rem',
        maxWidth: '540px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 12px 40px rgba(0,0,0,0.06)'
      }}>
        {/* Neon drop stamp indicator */}
        <div style={{
          width: '72px',
          height: '72px',
          background: 'var(--acid)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          color: 'var(--char)',
          margin: '0 auto 2rem'
        }}>
          ✳
        </div>

        <h1 style={{
          fontFamily: 'var(--font-space-grotesk), sans-serif',
          fontSize: '2.25rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '-0.02em',
          lineHeight: '1.05',
          marginBottom: '1rem'
        }}>
          ORDER CONFIRMED
        </h1>
        
        <p style={{ color: 'var(--muted)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
          Thank you for choosing OVRSZD. Your order has been registered in the current campaign drop.
        </p>

        {order ? (
          <div style={{
            textAlign: 'left',
            background: 'var(--cream)',
            borderRadius: '18px',
            padding: '1.5rem',
            marginBottom: '2.5rem',
            border: '1px solid rgba(26,26,26,0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: '0.9rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--cream-2)', paddingBottom: '0.5rem' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 700 }}>Order Number</span>
              <span style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700 }}>{order.orderNumber}</span>
            </div>
            
            <div>
              <span style={{ color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: '0.25rem' }}>Delivery To</span>
              <span style={{ fontWeight: 500 }}>{order.name}</span>
              <span style={{ color: 'var(--muted)', display: 'block', fontSize: '0.85rem', marginTop: '0.1rem' }}>{order.address}</span>
            </div>

            <div style={{ borderTop: '1px dashed var(--cream-2)', paddingTop: '0.75rem' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 700, display: 'block', marginBottom: '0.5rem' }}>Items</span>
              <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.85rem' }}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--char)', fontWeight: 500 }}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--cream-2)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
              <span style={{ color: 'var(--muted)', fontWeight: 700 }}>Total Charged</span>
              <span style={{ fontWeight: 700 }}>${order.total}</span>
            </div>
          </div>
        ) : (
          <div style={{ color: 'var(--muted)', margin: '2rem 0' }}>Loading details...</div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <Link href="/shop" className="cta" style={{ width: '100%', textDecoration: 'none', textAlign: 'center', border: 'none' }}>
            <span>Continue Shopping</span>
          </Link>
          <Link href="/" style={{
            fontSize: '0.85rem',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--char)',
            textDecoration: 'none',
            marginTop: '0.5rem'
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
