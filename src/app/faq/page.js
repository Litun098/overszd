'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import gsap from 'gsap';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    gsap.from('.faq-header h1', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out' });
    gsap.from('.faq-list', { y: 20, opacity: 0, duration: 0.9, ease: 'power2.out', delay: 0.15 });
  }, []);

  const faqs = [
    {
      q: "How do your campaign drops work?",
      a: "All items are released in structured limited drops. We manufacture in limited runs to minimize environmental waste and maintain product exclusivity. Once a size or color sells out, it is locked. We do not restock drops."
    },
    {
      q: "How do I choose the correct size?",
      a: "Our fits are tailormade to have dropped shoulders and structured chest drops. Order your standard true size for the intended streetwear baggy profile. If you prefer a regular fit, size down by one. Check out our sizing guidelines on the Size Guide tab."
    },
    {
      q: "What is your shipping policy?",
      a: "Worldwide shipping is available. Standard orders process in 2-3 business days. Free shipping is automatically applied on all orders exceeding $200. Standard shipping rates apply for other orders ($15 Flat Rate)."
    },
    {
      q: "Can I exchange or return my items?",
      a: "Yes. We offer returns and size exchanges on unworn, unwashed items within 14 days of delivery. Original packaging tag inserts must be attached. Return shipping labels are calculated at checkout."
    },
    {
      q: "Where is the apparel made?",
      a: "Our heavyweight custom loop cotton French Terry and combed cotton jerseys are sourced from select mills in Seoul, South Korea. Our production facilities maintain ethical working conditions and high craftsmanship guidelines."
    }
  ];

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh', paddingBottom: '6rem' }}>
      <section className="pad faq-header">
        <div className="sec-head" style={{ marginBottom: '4rem' }}>
          <h1>Common<br /><span className="stroke">Questions</span></h1>
          <span className="num">03 — FAQ DIRECTORY</span>
        </div>

        <div className="faq-list detail" style={{ gap: '4rem', alignItems: 'flex-start' }}>
          {/* FAQ copy */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              fontSize: '1.5rem',
              textTransform: 'uppercase',
              borderBottom: '1px solid var(--cream-2)',
              paddingBottom: '0.5rem'
            }}>
              Support Center
            </h3>
            <p style={{ color: 'var(--char)', lineHeight: '1.7', fontSize: '0.98rem' }}>
              Have questions about drops, fabric, sizing, or shipments? Read our quick directory panel.
            </p>
            <p style={{ color: 'var(--muted)', lineHeight: '1.7', fontSize: '0.92rem' }}>
              If your question isn't answered here, feel free to email our customer care team at <strong>hello@ovrszd.store</strong>.
            </p>

            <div style={{ marginTop: '1rem' }}>
              <Link href="/shop" className="cta" style={{ border: 'none', textDecoration: 'none' }}>
                <span>Start Shopping</span>
              </Link>
            </div>
          </div>

          {/* Accordion list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  style={{
                    border: '1.5px solid var(--char)',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    background: isOpen ? 'var(--cream-2)' : 'transparent',
                    transition: 'background 0.3s var(--ease)'
                  }}
                  onClick={() => handleToggle(idx)}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--font-space-grotesk), sans-serif',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    fontSize: '0.92rem',
                    letterSpacing: '0.02em',
                    lineHeight: '1.2'
                  }}>
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.1rem', transition: 'transform 0.3s', transform: isOpen ? 'rotate(45deg)' : 'none' }}>
                      +
                    </span>
                  </div>

                  <div style={{
                    maxHeight: isOpen ? '200px' : '0',
                    overflow: 'hidden',
                    transition: 'all 0.3s var(--ease)',
                    marginTop: isOpen ? '1rem' : '0',
                    color: 'var(--muted)',
                    fontSize: '0.92rem',
                    lineHeight: '1.6'
                  }}>
                    {faq.a}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
