"use client";

import { useEffect, useRef, useState } from "react";
import HomePage from "./home/HomePage";
import styles from "./rootWithSplash.module.css";

export default function RootWithSplash() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const startFade = () => {
      setIsFading(true);

      // אחרי ה-fade — מסירים את הספלאש לגמרי
      window.setTimeout(() => {
        setShowSplash(false);
      }, 700);
    };

    v.addEventListener("ended", startFade);

    // גיבוי: אם הוידאו לא מסתיים מסיבה כלשהי
    const t = window.setTimeout(startFade, 4500);

    return () => {
      v.removeEventListener("ended", startFade);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <div className={styles.root} dir="rtl">
      {/* הבית תמיד נטען מאחורה */}
      <HomePage />

      {/* הספלאש מעל הבית */}
      {showSplash && (
        // <div className={`${styles.splash} ${isFading ? styles.fadeOut : ""}`}>
        //   <video
        //     ref={videoRef}
        //     className={styles.video}
        //     src="/animation/Splash/splash.webm"
        //     autoPlay
        //     muted
        //     playsInline
        //     preload="auto"
        //   />
        //    <source src="/animation/Splash/splash.mp4" type="video/mp4" />
        //    <source src="/animation/Splash/splash.webm" type="video/webm" />
        // </div>
                <div className={`${styles.splash} ${isFading ? styles.fadeOut : ""}`}>
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
