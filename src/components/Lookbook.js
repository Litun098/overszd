'use client';

import React from 'react';

export default function Lookbook({ lookImage }) {
  return (
    <section className="pad look" id="look">
      <div className="sec-head">
        <h2 className="reveal">Lookbook<br />Editorial</h2>
        <span className="num reveal">03 — SS26 CAMPAIGN</span>
      </div>
      <div className="lookgrid">
        <div className="lk lk1 reveal">
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--char-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.05)',
            fontSize: '2rem'
          }}>
            CAMPAIGN 01
          </div>
          <span className="cap">The Crew · 05</span>
        </div>
        <div className="lk lk2 reveal">
          {lookImage && <img src={lookImage} alt="Streetwear Look 02" />}
          <span className="cap">Oversized Hood · 06</span>
        </div>
        <div className="lk lk3 reveal">
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--char-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.05)',
            fontSize: '2rem'
          }}>
            FIT PROFILE
          </div>
          <span className="cap">Box Tee · 07</span>
        </div>
        <div className="lk lk4 reveal">
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--char-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.05)',
            fontSize: '2rem'
          }}>
            URBAN ESCAPE
          </div>
          <span className="cap">Tech Jacket · 08</span>
        </div>
        <div className="lk lk5 reveal">
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--char-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-space-grotesk), sans-serif',
            fontWeight: 700,
            color: 'rgba(255, 255, 255, 0.05)',
            fontSize: '4rem'
          }}>
            OVRSZD EDITORIAL
          </div>
          <span className="cap">Street Silhouette · 09</span>
        </div>
      </div>
    </section>
  );
}
