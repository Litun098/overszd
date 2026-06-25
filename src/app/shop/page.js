'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { PRODUCTS } from '@/data/products';
import ProductCard from '@/components/ProductCard';

export default function Shop() {
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('new'); // 'new', 'price-asc', 'price-desc'

  const categories = ['All', 'Hoodies', 'Tees', 'Cargos', 'New'];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    // Header entry animation
    gsap.from('.shop-header h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.shop-filters', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
    
    // Product grid reveal
    gsap.from('.grid-container', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
  }, []);

  // Filter and Sort logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) || 
                          product.tag.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || product.tag === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0; // Default new/no sort
  });

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>
      <section className="pad" style={{ paddingTop: '6rem' }}>
        <div className="shop-header sec-head" style={{ marginBottom: '2.5rem' }}>
          <h1>Collection</h1>
          <span className="num">01 — CATALOG DIRECTORY</span>
        </div>

        {/* Filters and Controls */}
        <div className="shop-filters" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          marginBottom: '3.5rem',
          borderBottom: '1px solid var(--cream-2)',
          paddingBottom: '1.5rem'
        }}>
          {/* Category selection */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`sz ${activeCategory === cat ? 'active' : ''}`}
                style={{
                  width: 'auto',
                  height: 'auto',
                  padding: '0.6rem 1.2rem',
                  fontSize: '0.85rem',
                  borderWidth: '1.5px',
                  borderRadius: '30px',
                  fontFamily: 'var(--font-space-grotesk), sans-serif',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end', minWidth: '280px' }}>
            <div className="signup" style={{ maxWidth: '300px', flex: '1' }}>
              <input
                type="text"
                placeholder="SEARCH CATALOG..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '0.75rem 1.2rem',
                  fontSize: '0.85rem',
                  border: '1.5px solid var(--char)'
                }}
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                background: 'transparent',
                border: '1.5px solid var(--char)',
                borderRadius: '40px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                textTransform: 'uppercase',
                outline: 'none',
                cursor: 'pointer',
                letterSpacing: '0.05em'
              }}
            >
              <option value="new">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid-container">
          {filteredProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: 'var(--muted)',
              fontSize: '1.1rem',
              padding: '6rem 0',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700
            }}>
              No items match your selection.
            </div>
          ) : (
            <div className="grid">
              {filteredProducts.map((prod) => (
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
          )}
        </div>
      </section>
    </div>
  );
}
