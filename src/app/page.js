'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, HERO_IMAGE, DETAIL_IMAGE, LOOK_IMAGE } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import DropCountdown from '@/components/DropCountdown';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Lookbook from '@/components/Lookbook';
import Footer from '@/components/Footer';

export default function Home() {
  const { addToCart, showToast } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Hero loading animations
      gsap.from('[data-hero]', { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 });
      gsap.from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.05 });
      gsap.from('.hero .sub, .hero .cta', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 0.5 });
      gsap.from('.hero-img-wrap', { scale: 0.85, opacity: 0, duration: 1.3, ease: 'power3.out', delay: 0.2 });
    });

    // Magnetic CTA button interactions
    const btns = document.querySelectorAll('.cta');
    const cleanups = [];

    btns.forEach((btn) => {
      const mouseMoveHandler = (e) => {
        const r = btn.getBoundingClientRect();
        const text = btn.querySelector('span');
        
        // Button shifts slightly
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.12,
          y: (e.clientY - r.top - r.height / 2) * 0.12,
          duration: 0.4,
          ease: 'power2.out',
        });
        
        // Span shifts faster for 3D parallax
        if (text) {
          gsap.to(text, {
            x: (e.clientX - r.left - r.width / 2) * 0.18,
            y: (e.clientY - r.top - r.height / 2) * 0.18,
            duration: 0.35,
            ease: 'power2.out',
          });
        }
      };

      const mouseLeaveHandler = () => {
        const text = btn.querySelector('span');
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (text) {
          gsap.to(text, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' });
        }
      };

      btn.addEventListener('mousemove', mouseMoveHandler);
      btn.addEventListener('mouseleave', mouseLeaveHandler);

      cleanups.push(() => {
        btn.removeEventListener('mousemove', mouseMoveHandler);
        btn.removeEventListener('mouseleave', mouseLeaveHandler);
      });
    });

    return () => {
      ctx.revert();
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Hero heroImage={HERO_IMAGE} />

      {/* Marquee Banner */}
      <Marquee />

      {/* Product Grid Section */}
      <section className="pad" id="shop">
        <div className="sec-head">
          <h2 className="reveal">Product<br />Grid</h2>
          <span className="num reveal">01 — SHOP ALL</span>
        </div>
        <div className="grid">
          {PRODUCTS.map((prod) => (
            <ProductCard
              key={prod.id}
              id={prod.id}
              name={prod.name}
              price={prod.price}
              tag={prod.tag}
              label={prod.label}
              image={prod.image}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      {/* Product Detail Section */}
      <section className="pad">
        <div className="detail">
          <div className="detail-img reveal">
            <div className="dblob"></div>
            <div className="dphoto">
              {DETAIL_IMAGE && <img src={DETAIL_IMAGE} alt="Oversized Hoodie Detail" />}
            </div>
          </div>
          <div className="detail-copy">
            <span className="num reveal" style={{ display: 'block', marginBottom: '1rem' }}>02 — PRODUCT DETAIL</span>
            <h2 className="reveal">Premium<br />Oversized<br />Hoodie</h2>
            <div className="pr reveal">$149.00</div>
            <p className="desc reveal">Heavyweight 480gsm cotton fleece. Dropped shoulders, boxed hem, street-style flair. Built for the urban look — comfort that doesn't compromise on edge.</p>
            <div className="sizes reveal">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <div
                  key={sz}
                  className={"sz " + (selectedSize === sz ? 'active' : '')}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </div>
              ))}
            </div>
            <button
              className="cta reveal"
              onClick={() => addToCart('shadow-hoodie', 'Shadow Hoodie', 149, selectedSize, 'Heavyweight Hoodie')}
            >
              <span>Add to Bag — $149</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lookbook Grid Section */}
      <Lookbook lookImage={LOOK_IMAGE} />

      {/* Countdown Section */}
      <DropCountdown onSubscribe={(msg, type) => showToast(msg, type)} />

      {/* Footer */}
      <Footer />
    </>
  );
}
