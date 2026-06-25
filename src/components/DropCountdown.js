'use client';

import React, { useState, useEffect } from 'react';

export default function DropCountdown({ onSubscribe }) {
  const [timeLeft, setTimeLeft] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Set target date: 2 days, 8 hours, 44 mins, 19 secs from initialization
    const target = new Date().getTime() + (2 * 864e5 + 8 * 36e5 + 44 * 6e4 + 19e3);

    const tick = () => {
      let diff = target - Date.now();
      if (diff < 0) diff = 0;

      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1000);

      const pad = (n) => String(n).padStart(2, '0');

      setTimeLeft({
        d: pad(d),
        h: pad(h),
        m: pad(m),
        s: pad(s)
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      onSubscribe('Please enter an email address.', 'error');
      return;
    }
    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      onSubscribe('Invalid email format.', 'error');
      return;
    }
    onSubscribe('Access Code Sent. Welcome to the Drop.', 'success');
    setEmail('');
  };

  return (
    <section className="pad" id="drops">
      <div className="drop">
        <div>
          <span className="badge">Next Drop</span>
          <h2>04 / Hyper-Box</h2>
          <p>Once it's gone, it's gone. Heavyweight oversized tee and tactical cargo drop. Sign up to receive your exclusive access code before the counter runs out.</p>

          <div className="countdown">
            <div className="cd">
              <div className="v">{timeLeft.d}</div>
              <div className="l">Days</div>
            </div>
            <div className="cd">
              <div className="v">{timeLeft.h}</div>
              <div className="l">Hrs</div>
            </div>
            <div className="cd">
              <div className="v">{timeLeft.m}</div>
              <div className="l">Min</div>
            </div>
            <div className="cd">
              <div className="v">{timeLeft.s}</div>
              <div className="l">Sec</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="signup">
            <input
              type="email"
              placeholder="ENTER EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">Notify Me</button>
          </form>
        </div>

        <div className="drop-visual">
          <div className="dv dv1">
            {/* Visual background image fallback */}
            <div style={{
              width: '100%',
              height: '100%',
              background: 'var(--char-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-space-grotesk), sans-serif',
              fontWeight: 700,
              color: 'rgba(242, 238, 227, 0.1)',
              fontSize: '3rem',
              letterSpacing: '0.1em'
            }}>
              OVRSZD
            </div>
          </div>
          <div className="dv dv2">
            <div className="timer">
              {timeLeft.h}:{timeLeft.m}:{timeLeft.s}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
