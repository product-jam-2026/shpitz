// "use client";

// import { useEffect, useRef, useState } from "react";
// import HomePage from "./home/HomePage";
// import styles from "./rootWithSplash.module.css";

// export default function RootWithSplash() {
//   const videoRef = useRef<HTMLVideoElement | null>(null);

//   const [showSplash, setShowSplash] = useState(true);
//   const [isFading, setIsFading] = useState(false);

//   useEffect(() => {
//     const v = videoRef.current;
//     if (!v) return;

//     const startFade = () => {
//       setIsFading(true);

//       // אחרי ה-fade — מסירים את הספלאש לגמרי
//       window.setTimeout(() => {
//         setShowSplash(false);
//       }, 700);
//       const t = setTimeout(startFade, 4500);
//         return () => clearTimeout(t);

//     };

//     v.addEventListener("ended", startFade);

//     // גיבוי: אם הוידאו לא מסתיים מסיבה כלשהי
//     const t = window.setTimeout(startFade, 4500);

//     return () => {
//       v.removeEventListener("ended", startFade);
//       window.clearTimeout(t);
//     };
//   }, []);

//   return (
//     <div className={styles.root} dir="rtl">
//       {/* הבית תמיד נטען מאחורה */}
//       <HomePage />

//       {/* הספלאש מעל הבית */}
//       {showSplash && (
//         // <div className={`${styles.splash} ${isFading ? styles.fadeOut : ""}`}>
//         //   <video
//         //     ref={videoRef}
//         //     className={styles.video}
//         //     src="/animation/Splash/splash.webm"
//         //     autoPlay
//         //     muted
//         //     playsInline
//         //     preload="auto"
//         //   />
//         //    <source src="/animation/Splash/splash.mp4" type="video/mp4" />
//         //    <source src="/animation/Splash/splash.webm" type="video/webm" />
//         // </div>
//                 <div className={`${styles.splash} ${isFading ? styles.fadeOut : ""}`}>
//           <img
//             className={styles.gif}
//             src="/animation/Splash/splash.gif"
//             alt="Splash"
//             draggable={false}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import HomePage from "./home/HomePage";
import styles from "./rootWithSplash.module.css";
const GIF_DURATION_MS = 4500;   // כמה זמן הסיבוב בערך
const FADE_MS = 500;            // משך fade
const FADE_START_MS = GIF_DURATION_MS - 350; // מתחילים 250ms לפני הסוף
export default function RootWithSplash() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // אחרי 4.5 שניות מתחילים fade
    const fadeTimer = window.setTimeout(() => {
      setIsFading(true);

      // אחרי ה-fade (0.7 שניות) מסירים את הספלאש לגמרי
      const removeTimer = window.setTimeout(() => {
        setShowSplash(false);
      }, FADE_MS);

      // ניקוי טיימר פנימי אם הקומפוננט יורד באמצע
      return () => window.clearTimeout(removeTimer);
    }, FADE_START_MS);

    // ניקוי הטיימר הראשי
    return () => window.clearTimeout(fadeTimer);
  }, []);

  return (
    <div className={styles.root} dir="rtl">
      {/* הבית תמיד נטען מאחורה */}
      <HomePage />

      {/* הספלאש מעל הבית */}
      {showSplash && (
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
