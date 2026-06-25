'use client';

import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer id="about">
      <div className="foot-top">
        <h2>STAY<br /><span className="stroke">OVRSZD.</span></h2>
        <div className="foot-links">
          <div className="foot-col">
            <h4>Shop</h4>
            <Link href="/shop">Hoodies</Link>
            <Link href="/shop">Oversized Tees</Link>
            <Link href="/shop">Cargos</Link>
            <Link href="/shop">Shell Jackets</Link>
          </div>
          <div className="foot-col">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/about">Sustainability</Link>
            <Link href="/about">Careers</Link>
            <Link href="/about">Contact</Link>
          </div>
          <div className="foot-col">
            <h4>Support</h4>
            <Link href="/faq">Shipping Info</Link>
            <Link href="/faq">Returns & Exchanges</Link>
            <Link href="/size-guide">Size Guide</Link>
            <Link href="/faq">FAQs</Link>
          </div>
        </div>
      </div>
      <div className="foot-bot">
        <div className="brand">
          <svg className="ast" style={{ width: '26px', height: '26px' }}>
            <use href="#ast" />
          </svg>
          <b>OVRSZD</b>
        </div>
        <small>hello@ovrszd.store · © 2026 OVRSZD. All rights reserved.</small>
      </div>
    </footer>
  );
}
