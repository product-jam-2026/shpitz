"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // ייבוא הראוטר
import styles from "./homePage.module.css";

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
      // router.push('/game'); 
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
    <div className="w-full flex flex-col items-center gap-10">
      <div className="relative w-full aspect-[4/3] bg-[#EEE] border border-gray-300 flex items-center justify-center overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="1" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="1" />
        </svg>
        <span className="text-4xl relative z-10 font-bold">לוגו</span>
      </div>

      <h1 className={styles.mainTitle}>
        האתגר היומי שמחדד אותך לזיהוי הונאות רשת
      </h1>

      <div className="flex flex-col items-center gap-4">
        <p className={styles.streakText}>
          אתה מתחדד כבר {streak} ימים ברצף!
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
  );
}

function DayIndicator({ letter, filled }: { letter: string; filled: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[35px]">
      <div className="w-10 h-10 relative flex items-center justify-center">
        {filled ? (
          <svg width="40" height="40" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.83" y="1.83" width="26.34" height="26.34" rx="13.17" stroke="#776D6D" strokeWidth="3.66"/>
            <path d="M11.0185 24.4996C9.9352 24.2829 8.03934 22.9288 7.49767 21.9537L13.0227 16.3745L12.7519 15.6162L5.2768 14.3161C5.06013 13.2328 5.87264 11.0119 6.63099 10.1453L13.6186 13.6661L13.9436 13.3953L12.8061 5.86603C13.8352 5.37852 16.2186 5.37852 17.2478 5.86603L16.1103 13.5036L16.3811 13.6661L23.3687 10.1453C24.1271 11.0119 24.9396 13.2328 24.7229 14.3161L17.2478 15.6162L16.977 16.3745L22.3937 21.8454C21.9062 22.8746 20.0103 24.2288 18.8187 24.4454L15.2978 17.6745H14.6478L11.0185 24.4996Z" fill="#776D6D"/>
          </svg>
        ) : (
          <div className="w-8 h-8 rounded-full border-[3.66px] border-[#D9D9D9]" />
        )}
      </div>
      <span className={styles.dayLetter}>{letter}</span>
    </div>
  );
}