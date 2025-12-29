"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image'; // ייבוא קומפוננטת תמונה
import styles from "./startPage.module.css";

export default function StartPage() {
  const router = useRouter();

  // ברגע שתהיה לך תמונה, פשוט תשני את זה לכתובת הקובץ (למשל: "/images/hero.png")
  // כרגע זה null ולכן יוצג ה-Placeholder
  const imageUrl = "icons/gotItIcon.svg"; 

  const handleFinish = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    router.push('/game'); 
  };

  return (
    <div className="min-h-screen bg-[#6AABFF] flex flex-col items-center justify-center p-6" dir="rtl">
      <div className={styles.container}>
        
        {/* אזור התמונה / איור */}
        <div className={styles.illustrationBox}>
          {imageUrl ? (
            /* הצגת התמונה במידה והיא קיימת */
            <Image 
              src={imageUrl} 
              alt="הסבר האתגר" 
              fill 
              className={styles.mainImage}
              priority
            />
          ) : (
            /* הצגת האיור הנוכחי (Placeholder) במידה ואין תמונה */
            <div className={styles.crossContainer}>
              <svg className={styles.crossLines} viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" />
                <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" />
              </svg>
              <span className={styles.illustrationText}>איור</span>
            </div>
          )}
        </div>

        {/* טקסט ההסבר */}
        <div className={styles.contentWrapper}>
          <p className={styles.description}>
           תוצג לפניכם הודעת טקסט, חשבו האם היא אמיתית או הונאה ולאחר מכן בחרו האם הייתם פותחים את הלינק או מדווחים.
          </p>
        </div>

        <button className={styles.understandButton} onClick={handleFinish}>
          הבנתי
        </button>
      </div>
    </div>
  );
}