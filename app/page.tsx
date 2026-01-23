"use client";

import { useEffect, useState } from "react";
import HomePage from "./home/HomePage";
import styles from "./rootWithSplash.module.css";

const ANIMATION_DURATION_MS = 7099; 

export default function RootWithSplash() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {

    const timer = window.setTimeout(() => {
      setShowSplash(false);
    }, ANIMATION_DURATION_MS);


    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={styles.root} dir="rtl">
    
      <HomePage />

      {/* splash on the screen*/}
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
