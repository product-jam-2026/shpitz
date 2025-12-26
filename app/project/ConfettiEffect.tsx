"use client";
import React, { useEffect, useState } from 'react';
import styles from './Confetti.module.css';

const ConfettiSVG = ({ size }: { size: number }) => (
  <svg width={size} height={(size * 31) / 24} viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.2884 2.50251L0.00145669 30.0771L18.3445 26.9448C19.3372 25.8267 23.7955 21.6962 23.7955 21.6962C23.7955 21.6962 19.6133 20.195 18.3608 19.3835C19.0031 17.9841 22.9802 13.294 22.9802 13.294C22.9802 13.294 17.6855 12.8894 16.8608 12.8383C17.2261 11.6804 20.3702 6.1489 20.3702 6.1489C20.3702 6.1489 15.4302 7.18543 14.6045 7.37743C14.8127 5.87499 16.4923 2.16461e-06 16.4923 2.16461e-06C16.4923 2.16461e-06 12.54 1.98038 11.2884 2.50251Z" fill="#CACACA"/>
  </svg>
);

export default function ConfettiEffect() {
  const [pieces, setPieces] = useState<any[]>([]);

  useEffect(() => {
    // יצירת 30 חתיכות קונפטי עם ערכים אקראיים
    const newPieces = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // מיקום אופקי אקראי
      size: Math.random() * 20 + 10, // גודל בין 10 ל-30 פיקסלים
      duration: Math.random() * 3 + 2, // משך נפילה בין 2 ל-5 שניות
      delay: Math.random() * 5, // השהייה אקראית כדי שלא כולם יפלו יחד
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className={styles.confettiContainer}>
      {pieces.map((p) => (
        <div
          key={p.id}
          className={styles.confettiPiece}
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          <ConfettiSVG size={p.size} />
        </div>
      ))}
    </div>
  );
}