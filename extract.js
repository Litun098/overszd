const fs = require('fs');
const path = require('path');

// 1. Read the original HTML mockup file
const htmlPath = path.join(__dirname, 'theme', 'OVRSZD-website.html');
if (!fs.existsSync(htmlPath)) {
  console.error("HTML file not found at " + htmlPath);
  process.exit(1);
}
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// 2. Helper to extract base64 src from selector pattern
function extractBase64(html, parentClass) {
  // Find container class index
  const classIndex = html.indexOf(`class="${parentClass}"`);
  if (classIndex === -1) {
    // try single quotes
    const classIndexAlt = html.indexOf(`class='${parentClass}'`);
    if (classIndexAlt === -1) return null;
  }
  
  // Find the next img tag
  const searchStart = classIndex !== -1 ? classIndex : html.indexOf(`class='${parentClass}'`);
  const imgStart = html.indexOf('<img', searchStart);
  if (imgStart === -1) return null;
  
  // Find the src attribute
  const srcStart = html.indexOf('src="', imgStart);
  if (srcStart === -1) {
    const srcStartAlt = html.indexOf("src='", imgStart);
    if (srcStartAlt === -1) return null;
    const srcEndAlt = html.indexOf("'", srcStartAlt + 5);
    return html.substring(srcStartAlt + 5, srcEndAlt);
  }
  
  const srcEnd = html.indexOf('"', srcStart + 5);
  return html.substring(srcStart + 5, srcEnd);
}

// Extract the base64 strings
const heroImage = extractBase64(htmlContent, 'hero-photo') || '';
const detailImage = extractBase64(htmlContent, 'dphoto') || '';
const lookImage = extractBase64(htmlContent, 'lk lk2 reveal') || '';

console.log("Extracted Hero Image length:", heroImage.length);
console.log("Extracted Detail Image length:", detailImage.length);
console.log("Extracted Lookbook Image length:", lookImage.length);

// Ensure the directory data/ exists
const dataDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 3. Create products.js data file
const productsTemplate = `// Static Product Database with base64 images
export const HERO_IMAGE = ${JSON.stringify(heroImage)};
export const DETAIL_IMAGE = ${JSON.stringify(detailImage)};
export const LOOK_IMAGE = ${JSON.stringify(lookImage)};

export const PRODUCTS = [
  {
    id: 'shadow-hoodie',
    name: 'Shadow Hoodie',
    price: 149,
    tag: 'Hoodies',
    label: 'Heavyweight\\nHoodie',
    image: DETAIL_IMAGE,
    description: 'Heavyweight 480gsm cotton fleece. Dropped shoulders, boxed hem, street-style flair. Built for the urban look — comfort that doesn\\'t compromise on edge.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    specs: [
      '480gsm ultra-heavyweight cotton fleece',
      '100% French Terry cotton',
      'Dropped shoulders, boxed hem silhouette',
      'Pre-shrunk and double-dyed for color depth',
      'Handcrafted details and triple-needle stitching'
    ],
    details: 'The Shadow Hoodie represents our signature fit. Engineered with a vintage wash and built to last. Made in South Korea.'
  },
  {
    id: 'box-tee-01',
    name: 'Box Tee 01',
    price: 59,
    tag: 'Tees',
    label: 'Oversized\\nTee',
    image: HERO_IMAGE,
    description: 'Ultra-heavy 320gsm combed cotton jersey. Perfectly cropped length with drop-shoulder silhouette, providing a massive boxy structure.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      '320gsm heavyweight combed cotton',
      'Thick rib knit collar (1.2 inches)',
      'Oversized drop-shoulder boxed hem',
      'Reactive dyed for minimal fading',
      'Reinforced shoulder-to-shoulder taping'
    ],
    details: 'Our core tee. Heavy, rigid, and structured to hold its boxy shape after dozens of washes.'
  },
  {
    id: 'field-cargo',
    name: 'Field Cargo',
    price: 129,
    tag: 'Cargos',
    label: 'Tactical\\nCargo',
    image: LOOK_IMAGE,
    description: 'Double-knee cargo trousers crafted from premium military-grade cotton ripstop. Features 3D utility pockets and adjustable ankle straps.',
    sizes: ['28', '30', '32', '34', '36'],
    specs: [
      '100% premium military cotton ripstop',
      'Relaxed straight-leg utility fit',
      '3D side bellows cargo pockets',
      'Double-knee reinforcement paneling',
      'Adjustable drawstring cords at hem'
    ],
    details: 'Heavy ripstop cargos designed for a baggy profile. Styled with heavy metal hardware.'
  },
  {
    id: 'shell-jacket',
    name: 'Shell Jacket',
    price: 219,
    tag: 'New',
    label: 'Tech\\nJacket',
    image: DETAIL_IMAGE, // reuse detail image as technical placeholder
    description: 'Waterproof 3-layer technical shell with full seam sealing. Features heavy waterproof zippers, adjustable hood, and reflective print styling.',
    sizes: ['S', 'M', 'L', 'XL'],
    specs: [
      '3-layer waterproof, windproof breathable shell',
      'Fully taped interior seams',
      'Aquaguard waterproof zipper pulls',
      'Laser-cut ventilation holes at collar',
      'Oversized silhouette with back gusset'
    ],
    details: 'Designed to overlay layers. Ideal for layering over our heavyweight hoodies.'
  }
];

export function getProductById(id) {
  return PRODUCTS.find(p => p.id === id) || null;
}
`;

fs.writeFileSync(path.join(dataDir, 'products.js'), productsTemplate, 'utf8');
console.log("Successfully wrote products.js data file.");

// 4. Update the template for page.js
const pageTemplate = `'use client';

import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCart } from '@/context/CartContext';
import { PRODUCTS, HERO_IMAGE, DETAIL_IMAGE, LOOK_IMAGE } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import DropCountdown from '@/components/DropCountdown';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import Lookbook from '@/components/Lookbook';
import Footer from '@/components/Footer';

export default function Home() {
  const { addToCart, showToast } = useCart();
  const [selectedSize, setSelectedSize] = useState('M');

  // Register GSAP plugins
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Hero loading animations
    gsap.from('[data-hero]', { y: 60, opacity: 0, duration: 1.1, ease: 'power3.out', delay: 0.1 });
    gsap.from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.8, ease: 'power2.out', delay: 0.05 });
    gsap.from('.hero .sub, .hero .cta', { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power2.out', delay: 0.5 });
    gsap.from('.hero-img-wrap', { scale: 0.85, opacity: 0, duration: 1.3, ease: 'power3.out', delay: 0.2 });

    // Scroll reveals
    gsap.utils.toArray('.reveal').forEach((el) => {
      gsap.to(el, {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      });
    });

    // Magnetic CTA button interactions
    const btns = document.querySelectorAll('.cta');
    btns.forEach((btn) => {
      const mouseMoveHandler = (e) => {
        const r = btn.getBoundingClientRect();
        const text = btn.querySelector('span');
        
        // Button shifts slightly
        gsap.to(btn, {
          x: (e.clientX - r.left - r.width / 2) * 0.12,
          y: (e.clientY - r.top - r.height / 2) * 0.12,
          duration: 0.4,
          ease: 'power2.out',
        });
        
        // Span shifts faster for 3D parallax
        if (text) {
          gsap.to(text, {
            x: (e.clientX - r.left - r.width / 2) * 0.18,
            y: (e.clientY - r.top - r.height / 2) * 0.18,
            duration: 0.35,
            ease: 'power2.out',
          });
        }
      };

      const mouseLeaveHandler = () => {
        const text = btn.querySelector('span');
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
        if (text) {
          gsap.to(text, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.4)' });
        }
      };

      btn.addEventListener('mousemove', mouseMoveHandler);
      btn.addEventListener('mouseleave', mouseLeaveHandler);

      return () => {
        btn.removeEventListener('mousemove', mouseMoveHandler);
        btn.removeEventListener('mouseleave', mouseLeaveHandler);
      };
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <Hero heroImage={HERO_IMAGE} />

      {/* Marquee Banner */}
      <Marquee />

      {/* Product Grid Section */}
      <section className="pad" id="shop">
        <div className="sec-head">
          <h2 className="reveal">Product<br />Grid</h2>
          <span className="num reveal">01 — SHOP ALL</span>
        </div>
        <div className="grid">
          {PRODUCTS.map((prod) => (
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
      </section>

      {/* Product Detail Section */}
      <section className="pad">
        <div className="detail">
          <div className="detail-img reveal">
            <div className="dblob"></div>
            <div className="dphoto">
              {DETAIL_IMAGE && <img src={DETAIL_IMAGE} alt="Oversized Hoodie Detail" />}
            </div>
          </div>
          <div className="detail-copy">
            <span className="num reveal" style={{ display: 'block', marginBottom: '1rem' }}>02 — PRODUCT DETAIL</span>
            <h2 className="reveal">Premium<br />Oversized<br />Hoodie</h2>
            <div className="pr reveal">$149.00</div>
            <p className="desc reveal">Heavyweight 480gsm cotton fleece. Dropped shoulders, boxed hem, street-style flair. Built for the urban look — comfort that doesn't compromise on edge.</p>
            <div className="sizes reveal">
              {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                <div
                  key={sz}
                  className={"sz " + (selectedSize === sz ? 'active' : '')}
                  onClick={() => setSelectedSize(sz)}
                >
                  {sz}
                </div>
              ))}
            </div>
            <button
              className="cta reveal"
              onClick={() => addToCart('shadow-hoodie', 'Shadow Hoodie', 149, selectedSize, 'Heavyweight Hoodie')}
            >
              <span>Add to Bag — $149</span>
            </button>
          </div>
        </div>
      </section>

      {/* Lookbook Grid Section */}
      <Lookbook lookImage={LOOK_IMAGE} />

      {/* Countdown Section */}
      <DropCountdown onSubscribe={(msg, type) => showToast(msg, type)} />

      {/* Footer */}
      <Footer />
    </>
  );
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'app', 'page.js'), pageTemplate, 'utf8');
console.log("Successfully wrote page.js template.");
