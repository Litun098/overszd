'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar({ cartCount, onBagClick }) {
  return (
    <>
      {/* SVG symbols definition */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <symbol id="ast" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="currentColor" />
            <path
              d="M50 22v56M27.5 35.5l45 29M72.5 35.5l-45 29"
              stroke="var(--cream)"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </symbol>
        </defs>
      </svg>

      <nav>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div className="brand" style={{ cursor: 'pointer' }}>
            <svg className="ast">
              <use href="#ast" />
            </svg>
            <b>OVRSZD</b>
          </div>
        </Link>
        
        <ul>
          <li>
            <Link href="/shop">Shop</Link>
          </li>
          <li>
            <Link href="/#drops">New Drops</Link>
          </li>
          <li>
            <Link href="/#look">Lookbook</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
        </ul>
        <button 
          className="bag" 
          onClick={onBagClick} 
          style={{ background: 'none', cursor: 'pointer', outline: 'none' }}
        >
          BAG · <span id="bagCount">{cartCount}</span>
        </button>
      </nav>
    </>
  );
}
