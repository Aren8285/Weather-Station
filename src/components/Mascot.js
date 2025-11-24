import React from 'react';

export default function Mascot({ src = "/mascot.png", alt = "Mascot", glowClass = "" }) {
  // glowClass is optional, controlled by theme from App.js
  return (
    <img
      src={src}
      alt={alt}
      className={`fixed bottom-4 right-4 w-24 h-24 mascot-float drop-shadow-xl opacity-90 ${glowClass}`}
    />
  );
}
