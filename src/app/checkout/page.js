'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import gsap from 'gsap';

export default function Checkout() {
  const { cart, showToast } = useCart();
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    // Basic entry fade inside context
    const ctx = gsap.context(() => {
      gsap.from('.checkout-container', { opacity: 0, y: 30, duration: 0.9, ease: 'power3.out' });
    });

    return () => ctx.revert();
  }, []);

  // Subtotal calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = subtotal * (discountPercent / 100);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const taxableAmount = subtotal - discountAmount + shipping;
  const tax = taxableAmount * 0.08;
  const total = taxableAmount + tax;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'OVRSZD26') {
      setDiscountPercent(15);
      showToast('Promo Code Applied: 15% OFF.', 'success');
    } else {
      showToast('Invalid promo code.', 'error');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (!email || !firstName || !lastName || !address || !city || !postalCode || !cardNumber || !expiry || !cvv) {
      showToast('Please fill in all checkout fields.', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping bag is empty.', 'error');
      return;
    }

    // Save order mock context to localStorage
    const orderDetails = {
      orderNumber: 'OVR-' + Math.floor(100000 + Math.random() * 900000),
      email,
      name: `${firstName} ${lastName}`,
      address: `${address}, ${city}, ${postalCode}, ${country}`,
      total: total.toFixed(2),
      items: cart.map(item => `${item.name} (${item.size}) x${item.qty}`)
    };
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));

    // Reset Cart inside local state helper (via localStorage or by reloading cart contexts)
    // For mock details, we show success toast and route
    showToast('Payment Processing... Order Completed.', 'success');
    
    // Defer navigation slightly for transition
    setTimeout(() => {
      // Clear Cart (will clear context state upon navigation redirect)
      router.push('/order-success');
    }, 1200);
  };

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="pad checkout-container" style={{ paddingTop: '6rem' }}>
        <div className="sec-head" style={{ marginBottom: '2.5rem' }}>
          <h1>Checkout</h1>
          <span className="num">02 — BILLING & PAYMENT</span>
        </div>

        <div className="detail" style={{ alignItems: 'flex-start', gap: '3.5rem' }}>
          {/* Shipping Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid var(--cream-2)', paddingBottom: '0.5rem' }}>
              Shipping Information
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Contact</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>First Name</label>
                <input
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Street Address</label>
              <input
                type="text"
                placeholder="123 Street Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>City</label>
                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Postal Code</label>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
                />
              </div>
            </div>

            <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid var(--cream-2)', paddingTop: '1rem', paddingBottom: '0.5rem' }}>
              Payment Method
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card Number</label>
              <input
                type="text"
                placeholder="4000 1234 5678 9010"
                maxLength="16"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
                />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Security Code (CVV)</label>
                <input
                  type="password"
                  placeholder="123"
                  maxLength="3"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  style={{ padding: '0.8rem 1.2rem', border: '1.5px solid var(--char)', borderRadius: '40px', background: 'transparent', outline: 'none' }}
                />
              </div>
            </div>

            <button type="submit" className="cta" style={{ width: '100%', marginTop: '1.5rem', border: 'none' }}>
              <span>Complete Payment — ${total.toFixed(2)}</span>
            </button>
          </form>

          {/* Order Summary & Coupon code */}
          <div style={{
            background: 'var(--cream-2)',
            padding: '2rem',
            borderRadius: '24px',
            border: '1px solid var(--char)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            width: '100%'
          }}>
            <h3 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', borderBottom: '1px solid var(--char)', paddingBottom: '0.5rem' }}>
              Order Summary
            </h3>

            {/* Cart listing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '300px', overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <div style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>No items in your bag.</div>
              ) : (
                cart.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.92rem' }}>
                    <div>
                      <span style={{ fontWeight: 700 }}>{item.name}</span>
                      <span style={{ color: 'var(--muted)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>({item.size}) x{item.qty}</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>${item.price * item.qty}</span>
                  </div>
                ))
              )}
            </div>

            {/* Promo Code box */}
            <form onSubmit={handleApplyPromo} className="signup" style={{ margin: '0.5rem 0' }}>
              <input
                type="text"
                placeholder="PROMO CODE (OVRSZD26)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                style={{ border: '1px solid var(--char)', background: 'transparent', padding: '0.6rem 1rem', fontSize: '0.8rem' }}
              />
              <button type="submit" style={{ padding: '0.6rem 1rem', fontSize: '0.75rem' }}>Apply</button>
            </form>

            {/* Invoice list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderTop: '1px solid var(--char)', paddingTop: '1.5rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyBetween: 'space-between', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Subtotal</span>
                <span style={{ fontWeight: 700 }}>${subtotal.toFixed(2)}</span>
              </div>
              
              {discountPercent > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--coral)' }}>
                  <span>Discount ({discountPercent}%)</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Shipping</span>
                <span style={{ fontWeight: 700 }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--muted)' }}>Estimated Tax (8%)</span>
                <span style={{ fontWeight: 700 }}>${tax.toFixed(2)}</span>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px dashed var(--char)',
                paddingTop: '1rem',
                marginTop: '0.5rem',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '1.2rem'
              }}>
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
