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
    <div className={styles.screen}>
      <div className={styles.container}>
        
        <div className={styles.illustrationBox}>
            <Image 
              src={imageUrl} 
              alt="הסבר האתגר" 
              fill 
              className={styles.mainImage}
              priority
            />
          
        </div>

        {/* טקסט ההסבר */}
        <div className={styles.contentWrapper}>
          <h2 className={styles.subTitle}>?איך משחקים</h2>
          <p className={styles.description}>
           ,תוצג לפניכם הודעת טקסט 
            <br />
           ?האם היא אמיתית או הונאה
          </p>
        </div>

        <button className={styles.understandButton} onClick={handleFinish}>
          הבנתי
        </button>
      </div>
    </div>
  );
}