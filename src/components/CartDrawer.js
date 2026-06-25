'use client';

import React from 'react';
import Link from 'next/link';

export default function CartDrawer({ isOpen, cart, onClose, onUpdateQty, onRemoveItem }) {
  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`cart-drawer-backdrop ${isOpen ? 'active' : ''}`} 
        onClick={onClose}
        id="cartBackdrop"
      />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'active' : ''}`} id="cartDrawer">
        <div className="cart-header">
          <h3>YOUR BAG ({totalCount})</h3>
          <button className="cart-close" onClick={onClose} id="cartCloseBtn">✕</button>
        </div>

        <div className="cart-items" id="cartItemsContainer">
          {cart.length === 0 ? (
            <div className="cart-empty-message">Your bag is empty.</div>
          ) : (
            cart.map((item, index) => (
              <div className="cart-item" key={`${item.id}-${item.size}-${index}`}>
                <div className="cart-item-img">
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    color: 'rgba(242, 238, 227, 0.4)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    padding: '0.5rem',
                    lineHeight: 1.1
                  }}>
                    {item.label}
                  </div>
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-title-row">
                    <div>
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-meta">SIZE: {item.size}</div>
                    </div>
                    <div className="cart-item-price">${item.price}</div>
                  </div>
                  
                  <div className="cart-item-qty-row">
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => onUpdateQty(index, -1)}>-</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => onUpdateQty(index, 1)}>+</button>
                    </div>
                    <button className="cart-item-remove" onClick={() => onRemoveItem(index)}>Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-summary">
            <span>Subtotal</span>
            <span className="subtotal-price" id="cartSubtotal">${subtotal.toFixed(2)}</span>
          </div>
          {cart.length > 0 ? (
            <Link href="/checkout" onClick={onClose} style={{ textDecoration: 'none', display: 'block' }}>
              <button className="checkout-btn" style={{ border: 'none' }}>
                <span>Proceed to Checkout</span>
              </button>
            </Link>
          ) : (
            <button 
              className="checkout-btn" 
              style={{ border: 'none', opacity: 0.5, cursor: 'not-allowed' }}
              onClick={() => showToast && showToast('Your bag is empty.', 'error')}
            >
              <span>Proceed to Checkout</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
