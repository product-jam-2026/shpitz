"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image'; // ייבוא קומפוננטת תמונה
import styles from "./startPage.module.css";

interface StartPageProps {
  isMessageMode: boolean;
}

export default function StartPage({ isMessageMode }: StartPageProps) {
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
         <h2 className={styles.subTitle}>
           איך משחקים<span className={styles.qMark}>?</span>
    </h2>
          <p className={styles.description}>
           {isMessageMode ? (
             <>
               יוצגו לפניכם הודעות טקסט
               <br />
               לחצו האם הן אמיתיות או הונאה
             </>
           ) : (
             <>
               יוצגו לפניכם תמונות
               <br />
               לחצו האם הן אמיתיות או מזויפות
             </>
           )}
          </p>
        </div>

        <button className={styles.understandButton} onClick={handleFinish}>
          הבנתי
        </button>
      </div>
    </div>
  );
}