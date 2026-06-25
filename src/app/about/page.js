'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function About() {
  useEffect(() => {
    gsap.from('.about-header h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.about-content', { y: 20, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.15 });
  }, []);

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="pad" style={{ paddingTop: '6rem' }}>
        <div className="about-header sec-head" style={{ marginBottom: '4rem' }}>
          <h1>About<br /><span className="stroke">OVRSZD.</span></h1>
          <span className="num">01 — BRAND MANIFESTO</span>
        </div>

        <div className="about-content detail" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          {/* Main manifesto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: '1.75rem',
              lineHeight: '1.15',
              textTransform: 'uppercase',
              letterSpacing: '-0.02em',
              borderBottom: '1px solid var(--cream-2)',
              paddingBottom: '0.8rem'
            }}>
              Fit it big. Wear it loud.
            </h3>
            
            <p style={{ fontSize: '1.05rem', lineHeight: '1.7', color: 'var(--char)' }}>
              OVRSZD was established in 2026 as a direct response to generic, fast-fashion streetwear. We reject compromised materials, flimsy fits, and overproduced templates. 
            </p>
            
            <p style={{ fontSize: '0.98rem', lineHeight: '1.7', color: 'var(--muted)' }}>
              Our design philosophy is anchored in structural shape. We build silhouettes that drop from the shoulder, box at the waist, and maintain their rigid form. Every single item we drop is designed to make a statement without uttering a word.
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
              <Link href="/shop" className="cta" style={{ border: 'none', textDecoration: 'none' }}>
                <span>View Collection</span>
              </Link>
            </div>
          </div>

          {/* Pillars grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {/* Pillar 1 */}
            <div>
              <span style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--acid)',
                background: 'var(--char)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '1rem',
                letterSpacing: '0.1em'
              }}>
                Heavyweight Cotton
              </span>
              <h4 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Premium 480GSM Fabric
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                Our hoodies are crafted from South Korean 480gsm custom-loop French Terry. Heavy, dense, and soft. It holds a structured drape and stands up to any climate.
              </p>
            </div>

            {/* Pillar 2 */}
            <div>
              <span style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--coral)',
                background: 'var(--char)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '1rem',
                letterSpacing: '0.1em'
              }}>
                Limited Drops
              </span>
              <h4 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                No Reprints. Ever.
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                We produce in limited batches to minimize ecological waste and maintain exclusivity. Once a drop sells out, it is permanently locked.
              </p>
            </div>

            {/* Pillar 3 */}
            <div>
              <span style={{
                fontFamily: 'var(--font-space-grotesk), sans-serif',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--char)',
                background: 'var(--cream-2)',
                border: '1px solid var(--char)',
                padding: '0.3rem 0.8rem',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '1rem',
                letterSpacing: '0.1em'
              }}>
                True Oversized Fit
              </span>
              <h4 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Boxed & Structured
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                We scale shoulders and chests massively, while keeping waist lengths cropped. There is no need to size up; the silhouette is tailored to hang beautifully out of the box.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
