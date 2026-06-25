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

  const categories = [
    { id: 'All', label: '00 / ALL' },
    { id: 'Hoodies', label: '01 / HOODIES' },
    { id: 'Tees', label: '02 / TEES' },
    { id: 'Cargos', label: '03 / CARGOS' },
    { id: 'New', label: '04 / NEW' }
  ];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
      // Header entry animation
      gsap.from('.shop-header h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
      gsap.from('.shop-filters-container', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.1 });
      
      // Product grid reveal
      gsap.from('.grid-container', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
    });

    return () => ctx.revert();
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
        <div className="shop-filters-container">
          {/* Category selection */}
          <div className="category-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search and Sort controls */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end', minWidth: '280px' }}>
            <div className="shop-search-wrap">
              <input
                type="text"
                className="shop-search-input"
                placeholder="SEARCH CATALOG..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              value={sortBy}
              className="shop-sort-select"
              onChange={(e) => setSortBy(e.target.value)}
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
                  image={prod.image}
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
