"use client";

import { useEffect, useState } from "react";
import HomePage from "./home/HomePage";
import styles from "./rootWithSplash.module.css";

const ANIMATION_DURATION_MS = 7099; // משך הספלאש כולו עם fade (6s animation + buffer)

export default function RootWithSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // אחרי שהאנימציה מסתיימת, מסירים את הספלאש
    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, ANIMATION_DURATION_MS);

    // ניקוי הטיימר אם הקומפוננט יורד
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.root} dir="rtl">
      {/* הבית תמיד נטען מאחורה */}
      <HomePage />

      {/* הספלאש מעל הבית */}
      {showSplash && (
        <div className={styles.splash}>
          <img
            className={styles.gif}
            src="/animation/Splash/splash.gif"
            alt="Splash"
            draggable={false}
          />
        </div>
      )}
    </div>
  );
}
