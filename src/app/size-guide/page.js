'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function SizeGuide() {
  useEffect(() => {
    gsap.from('.size-header h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.size-content', { y: 20, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.15 });
  }, []);

  const hoodieMeasurements = [
    { size: 'S', chest: '50"', length: '26"', sleeve: '22"', shoulder: '24.5"' },
    { size: 'M', chest: '52"', length: '27"', sleeve: '22.5"', shoulder: '25.5"' },
    { size: 'L', chest: '54"', length: '28"', sleeve: '23"', shoulder: '26.5"' },
    { size: 'XL', chest: '56"', length: '29"', sleeve: '23.5"', shoulder: '27.5"' },
    { size: 'XXL', chest: '58"', length: '30"', sleeve: '24"', shoulder: '28.5"' }
  ];

  const teeMeasurements = [
    { size: 'S', chest: '46"', length: '25.5"', sleeve: '8"', shoulder: '22"' },
    { size: 'M', chest: '48"', length: '26.5"', sleeve: '8.5"', shoulder: '23"' },
    { size: 'L', chest: '50"', length: '27.5"', sleeve: '9"', shoulder: '24"' },
    { size: 'XL', chest: '52"', length: '28.5"', sleeve: '9.5"', shoulder: '25"' }
  ];

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="pad size-header">
        <div className="sec-head" style={{ marginBottom: '4rem' }}>
          <h1>Sizing<br /><span className="stroke">Guide</span></h1>
          <span className="num">02 — MEASUREMENT CHART</span>
        </div>

        <div className="size-content detail" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          {/* Sizing description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--cream-2)',
              paddingBottom: '0.5rem'
            }}>
              Fits True to Silhouette
            </h3>
            <p style={{ color: 'var(--char)', lineHeight: '1.7', fontSize: '0.98rem' }}>
              All OVRSZD products are cut with an intentional oversized profile. Drop-shoulder styling and wide chest measurements provide the boxy look.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.92rem' }}>
              <strong>HOW TO CHOOSE:</strong> Order your normal size for the lookbook oversized fit. Sizing down is recommended only if you prefer a standard, closer crop.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.92rem' }}>
              <strong>MODEL REFERENCE:</strong> Our models are East Asian. Male model is 185cm (6'1") wearing size L. Female model is 172cm (5'8") wearing size S.
            </p>
            
            <div style={{ marginTop: '1rem' }}>
              <Link href="/shop" className="cta" style={{ border: 'none', textDecoration: 'none' }}>
                <span>Go to Shop</span>
              </Link>
            </div>
          </div>

          {/* Tables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%' }}>
            {/* Hoodies */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
                Hoodies & Outerwear
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-space-grotesk), sans-serif'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--char)', textAlign: 'left' }}>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>SIZE</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>CHEST</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>LENGTH</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>SLEEVE</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>SHOULDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hoodieMeasurements.map((m) => (
                      <tr key={m.size} style={{ borderBottom: '1px solid var(--cream-2)' }}>
                        <td style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>{m.size}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.chest}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.length}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.sleeve}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Tees */}
            <div>
              <h4 style={{ fontFamily: 'var(--font-space-grotesk), sans-serif', fontWeight: 700, textTransform: 'uppercase', marginBottom: '1rem' }}>
                Oversized Tees
              </h4>
              <div style={{ overflowX: 'auto' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '0.9rem',
                  fontFamily: 'var(--font-space-grotesk), sans-serif'
                }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--char)', textAlign: 'left' }}>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>SIZE</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>CHEST</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>LENGTH</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>SLEEVE</th>
                      <th style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>SHOULDER</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teeMeasurements.map((m) => (
                      <tr key={m.size} style={{ borderBottom: '1px solid var(--cream-2)' }}>
                        <td style={{ padding: '0.8rem 0.5rem', fontWeight: 700 }}>{m.size}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.chest}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.length}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.sleeve}</td>
                        <td style={{ padding: '0.8rem 0.5rem', color: 'var(--muted)' }}>{m.shoulder}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
