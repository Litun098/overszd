'use client';

import React from 'react';
import Link from 'next/link';

export default function ProductCard({ id, name, price, tag, label, onAddToCart }) {
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="card reveal">
      <Link href={`/product/${id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="ph">
          <span className="tag">{tag}</span>
          <div className="label">
            {label.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < label.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <div className="card-size-selector">
            {sizes.map((size) => (
              <span
                key={size}
                className="size-chip"
                onClick={(e) => {
                  e.preventDefault(); // Stop wrapping link trigger
                  e.stopPropagation();
                  onAddToCart(id, name, price, size, label.replace('\n', ' '));
                }}
                data-size={size}
              >
                {size}
              </span>
            ))}
          </div>
        </div>
        <div className="meta">
          <h3>{name}</h3>
          <span className="price">${price}</span>
        </div>
      </Link>
    </div>
  );
}
