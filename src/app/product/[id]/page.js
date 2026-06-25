'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { getProductById, PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = getProductById(id);
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeTab, setActiveTab] = useState('specs'); // 'specs', 'shipping'

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Fade-in animations
    gsap.from('.prod-detail-img', { opacity: 0, x: -40, duration: 1.1, ease: 'power3.out' });
    gsap.from('.prod-detail-copy', { opacity: 0, x: 40, duration: 1.1, ease: 'power3.out' });
    gsap.from('.related-section', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
  }, [id]);

  if (!product) {
    return (
      <div style={{
        background: 'var(--cream)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <h2 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontSize: '2.5rem', marginBottom: '1.5rem' }}>
          PRODUCT NOT FOUND
        </h2>
        <p style={{ color: 'var(--muted)', marginBottom: '2.5rem' }}>The product you are looking for does not exist in our drop catalog.</p>
        <a href="/shop" className="cta">
          <span>Back to Shop</span>
        </a>
      </div>
    );
  }

  // Get related products (exclude current)
  const relatedProducts = PRODUCTS.filter(p => p.id !== product.id).slice(0, 3);

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <section className="pad" style={{ paddingTop: '6rem' }}>
        <div className="detail" style={{ marginBottom: '6rem' }}>
          {/* Visual container */}
          <div className="prod-detail-img detail-img">
            <div className="dblob"></div>
            <div className="dphoto">
              {product.image && <img src={product.image} alt={product.name} />}
            </div>
          </div>

          {/* Copy details */}
          <div className="prod-detail-copy detail-copy">
            <span className="num" style={{ display: 'block', marginBottom: '1rem' }}>
              02 — {product.tag.toUpperCase()} DETAIL
            </span>
            <h2>{product.name}</h2>
            <div className="pr">${product.price}.00</div>
            <p className="desc">{product.description}</p>
            
            <div className="sizes">
              {product.sizes.map((sz) => (
                <div
                  key={sz}
                  className={`sz ${selectedSize === sz ? 'active' : ''}`}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </div>
              ))}
            </div>

            <button
              className="cta"
              onClick={() => addToCart(product.id, product.name, product.price, selectedSize, product.label.replace('\n', ' '))}
              style={{ marginBottom: '3.5rem' }}
            >
              <span>Add to Bag — ${product.price}</span>
            </button>

            {/* Spec / shipping accordion tab */}
            <div style={{ borderTop: '1px solid var(--cream-2)', paddingTop: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem' }}>
                <span
                  onClick={() => setActiveTab('specs')}
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: activeTab === 'specs' ? 'var(--char)' : 'var(--muted)',
                    borderBottom: activeTab === 'specs' ? '2px solid var(--char)' : 'none',
                    paddingBottom: '0.25rem',
                    transition: 'color 0.25s'
                  }}
                >
                  Specifications
                </span>
                <span
                  onClick={() => setActiveTab('shipping')}
                  style={{
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    color: activeTab === 'shipping' ? 'var(--char)' : 'var(--muted)',
                    borderBottom: activeTab === 'shipping' ? '2px solid var(--char)' : 'none',
                    paddingBottom: '0.25rem',
                    transition: 'color 0.25s'
                  }}
                >
                  Shipping & Returns
                </span>
              </div>

              {activeTab === 'specs' ? (
                <ul style={{ paddingLeft: '1.25rem', color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.92rem' }}>
                  {product.specs.map((spec, i) => (
                    <li key={i} style={{ marginBottom: '0.5rem' }}>{spec}</li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.92rem' }}>
                  <p style={{ marginBottom: '0.75rem' }}><strong>WORLDWIDE SHIPPING:</strong> Dispatched in 2-3 business days. Delivery rates computed during checkout details.</p>
                  <p><strong>RETURNS POLICY:</strong> 14-day hassle-free returns on all unworn items from the drop campaign. Shipping exclusions apply.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Grid */}
        <div className="related-section" style={{ borderTop: '1px solid var(--cream-2)', paddingTop: '5rem' }}>
          <div className="sec-head" style={{ marginBottom: '3rem' }}>
            <h2>Related<br />Drops</h2>
            <span className="num">03 — COMPLETE THE PROFILE</span>
          </div>
          <div className="grid">
            {relatedProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                price={prod.price}
                tag={prod.tag}
                label={prod.label}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
