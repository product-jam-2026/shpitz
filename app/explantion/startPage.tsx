"use client";

import { useRouter } from 'next/navigation';
import styles from "./explantion.module.css";

export default function ExplanationPage() {
  const router = useRouter();

  const handleFinish = () => {
    // סימון שהמשתמש ראה את ההסבר
    localStorage.setItem('hasVisitedBefore', 'true');
    // ניווט חזרה לדף הבית או ישירות לאתגר
    router.push('/'); 
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center justify-center p-6" dir="rtl">
      <div className={styles.container}>
        
        {/* איור / Placeholder לתמונה */}
        <div className={styles.illustrationBox}>
          <div className={styles.crossContainer}>
            <svg className={styles.crossLines} viewBox="0 0 100 100" preserveAspectRatio="none">
              <line x1="0" y1="0" x2="100" y2="100" />
              <line x1="100" y1="0" x2="0" y2="100" />
            </svg>
            <span className={styles.illustrationText}>איור</span>
          </div>
        </div>

        {/* טקסט ההסבר */}
        <div className={styles.contentWrapper}>
          <p className={styles.description}>
            תוצג לפניכם הודעת טקסט, חשבו האם היא <span className={styles.highlight}>אמיתית</span> או <span className={styles.highlight}>הונאה</span> ולאחר מכן בחרו האם הייתם פותחים את הלינק או מדווחים.
          </p>
        </div>

        {/* כפתור אישור */}
        <button className={styles.understandButton} onClick={handleFinish}>
          הבנתי
        </button>
      </div>
    </div>
  );
}