"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ייבוא הראוטר
import styles from "./homePage.module.css";
import Image from 'next/image';
export default function Index() {
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const router = useRouter(); // אתחול הראוטר

  useEffect(() => {
    // בדיקת ביקור ראשון
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    setIsFirstVisit(!hasVisited);

    // לוגיקה של הסטריק
    const today = new Date().getDay();
    const savedDays = JSON.parse(localStorage.getItem('userActivityDays') || '[]');
    const savedStreak = parseInt(localStorage.getItem('userStreak') || '0');

    if (!savedDays.includes(today)) {
      const updatedDays = [...savedDays, today];
      localStorage.setItem('userActivityDays', JSON.stringify(updatedDays));
      setActiveDays(updatedDays);
      const newStreak = savedStreak + 1;
      localStorage.setItem('userStreak', newStreak.toString());
      setStreak(newStreak);
    } else {
      setActiveDays(savedDays);
      setStreak(savedStreak);
    }
  }, []);

  const handleStart = () => {
    if (isFirstVisit) {
      // ניווט לדף ההסבר (הנתיב הוא /explantion)
      router.push('/explantion');
    } else {
      // כאן תוסיפי את הניווט למשחק עצמו בעתיד
      console.log("מעבר ישיר לאתגר...");
      router.push('/startPage'); 
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3F3] flex flex-col items-center py-8 px-4" dir="rtl">
      <div className="w-full max-w-md"> 
        <MobileContent 
          activeDays={activeDays} 
          streak={streak} 
          onStart={handleStart} 
        />
      </div>
    </div>
  );
}

// --- MobileContent Component ---
function MobileContent({ activeDays, streak, onStart }: { 
  activeDays: number[], 
  streak: number, 
  onStart: () => void }) {
    
  const daysOfWeek = [
    { label: 'א', value: 0 },
    { label: 'ב', value: 1 },
    { label: 'ג', value: 2 },
    { label: 'ד', value: 3 },
    { label: 'ה', value: 4 },
    { label: 'ו', value: 5 },
    { label: 'ש', value: 6 },
  ];

  return (
    <div className={styles.screen} dir="rtl">
      <div className="w-full max-w-md">
      {/* /*<div className="relative w-full aspect-[4/3] bg-[#EEE] border border-gray-300 flex items-center justify-center overflow-hidden"> */}
        <div className={styles.logoContainer}>
          <div className={styles.mainIcon}>
              <Image 
                src="icons/homePageIcon.svg"
                alt="homePageLogo"
                width={400}
                height={400}
                priority
              
              />
        </div>
      </div>

     

      <h1 className={styles.mainTitle}>
        האתגר היומי שמחדד אותך לזיהוי הונאות רשת
      </h1>

      <div className="flex flex-col items-center gap-4">
        <p className={styles.streakText}>
          אתה מתחדד {streak} ימים ברצף!
        </p>
        
        <div className="flex flex-row-reverse gap-3" dir="ltr"> 
          {daysOfWeek.map((day) => (
            <DayIndicator 
              key={day.value} 
              letter={day.label} 
              filled={activeDays.includes(day.value)} 
            />
          ))}
        </div>
      </div>

      {/* חיבור הפונקציה לכפתור */}
      <button className={styles.startButton} onClick={onStart}>
        <span className={styles.buttonText}>התחל</span>
      </button>
    </div>
  </div>
  
  );
}

function DayIndicator({ letter, filled }: { letter: string; filled: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[35px]">
      <div className="w-10 h-10 relative flex items-center justify-center">
        {filled ? (
         <Image 
            src="/icons/starDaySvg.svg" 
            alt="active day" 
            width={40} 
            height={40} 
          />
        ) : (
          <Image 
            src="/icons/NotActiveDay.svg" 
            alt="inactive day" 
            width={40} 
            height={40} 
          />
        )}
      </div>
      <span className={styles.dayLetter}>{letter}</span>
    </div>
  );
}