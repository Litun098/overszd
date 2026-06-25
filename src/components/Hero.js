'use client';

import React from 'react';
import SpinningBadge from './SpinningBadge';

export default function Hero({ heroImage }) {
  return (
    <header className="hero">
      <div className="hero-copy">
        <div className="eyebrow">
          <span className="dot"></span> OVRSZD · Premium Oversized Streetwear
        </div>
        <h1 data-hero>
          Wear it<br />
          <span className="stroke">loud.</span><br />
          Fit it big.
        </h1>
        <p className="sub">Elevating streetwear for the next generation. Oversized fits, premium fabric, limited runs.</p>
        <a href="#shop" className="cta">
          <span>Shop the Drop</span>
          <svg className="arr" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" style={{ stroke: 'var(--cream)' }} />
          </svg>
        </a>
      </div>
      <div className="hero-img-wrap">
        <div className="blob"></div>
        <div className="hero-photo">
          {heroImage && <img src={heroImage} alt="OVRSZD Model" />}
        </div>
        <SpinningBadge />
      </div>
    </header>
  );
}
