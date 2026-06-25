'use client';

import React from 'react';

export default function SpinningBadge() {
  return (
    <div className="spinning-badge">
      <svg viewBox="0 0 100 100">
        <path
          id="circlePath"
          d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
          fill="none"
        />
        <text>
          <textPath href="#circlePath" fill="var(--char)">
            NEW DROP '26 ✳ OVERSIZED FIT ✳ PREMIUM QUALITY ✳
          </textPath>
        </text>
      </svg>
      <div className="badge-center">✳</div>
    </div>
  );
}
