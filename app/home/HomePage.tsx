"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./homePage.module.css";
import Image from "next/image";

export default function HomePage(){
  const router = useRouter();

  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0..6

    // ✅ first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    setIsFirstVisit(!hasVisited);

    // ✅ completed today
    const todayKey = today.toISOString().split("T")[0]; // YYYY-MM-DD
    const completedDate = localStorage.getItem("dailyCompletedDate");
    setHasCompletedToday(completedDate === todayKey);

    // ✅ streak based on real dates (like your StreakPage)
    const activityDates: string[] = JSON.parse(
      localStorage.getItem("userActivityDates") || "[]"
    );

    // save today's visit
    if (!activityDates.includes(todayKey)) {
      activityDates.push(todayKey);
      localStorage.setItem("userActivityDates", JSON.stringify(activityDates));
    }

    // calculate consecutive streak including today
    let consecutiveStreak = 0;
    const checkDate = new Date(today);

    while (true) {
      const dateString = checkDate.toISOString().split("T")[0];
      if (activityDates.includes(dateString)) {
        consecutiveStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
      
    }

    setStreak(consecutiveStreak);
    localStorage.setItem("userStreak", consecutiveStreak.toString());

    // ✅ active days for current week (only up to today)
    const currentWeekActiveDays: string[] = [];
    for (let i = 0; i <= todayDayOfWeek; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (todayDayOfWeek - i));
      const dStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
      if (activityDates.includes(dStr)) {
        currentWeekActiveDays.push(dStr);
      }
    }
    setActiveDays(currentWeekActiveDays);

  }, []);

  const handleStart = () => {
    if (hasCompletedToday) {
      router.push("/pre_review");
      return;
    }

    if (isFirstVisit) {
      router.push("/explantion");
    } else {
      router.push("/startPage");
    }
  };


  return (
    <MobileContent activeDays={activeDays} streak={streak} onStart={handleStart} />
  );
  }

function MobileContent({
  activeDays,
  streak,
  onStart,
}: {
  activeDays: string[];
  streak: number;
  onStart: () => void;
}) {
function formatDDMM(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}`;
}

function toISODate(date: Date) {
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}

const today = new Date();
const todayDayOfWeek = today.getDay();

const weekDays = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - (todayDayOfWeek - i)); // מתחילת השבוע עד היום/שבת
  return {
    iso: toISODate(d),
    label: formatDDMM(d), // DD-MM
  };
});


  return (
    <div className={styles.screen} dir="rtl">
      <div className={styles.mainContent}>
        <div className={styles.logoContainer}>
          <div className={styles.mainIcon}>
            <Image src="icons/homePageIcon.svg" alt="homePageLogo" width={150} height={150} priority />
          </div>
        </div>

        <h1 className={styles.mainTitle}>
            חמש שאלות כל יום, 
            <br />
            אפס נפילות בהונאות רשת   
               
          </h1>

        <div className={styles.streakSection}>
        <p className={styles.streakText}>
            יום {streak} ברצף של חידודים
          </p>

          <div className={styles.daysContainer}>
          {weekDays.map((day) => (
            <DayIndicator
              key={day.iso}
              label={day.label}
              filled={activeDays.includes(day.iso)}
            />
          ))}


          </div>
        </div>

        <button 
          className={styles.startButton} 
          onClick={onStart}
        >
          <span className={styles.buttonText}>התחל</span>
        </button>
      </div>
    </div>
  );
}

function DayIndicator({ label, filled }: { label: string; filled: boolean }) {
  return (
    <div className={styles.dayItem} >
      <div className={styles.iconWrapper}>
        <Image 
          src={filled ? "/icons/starDaySvg.svg" : "/icons/NotActiveDay.svg"} 
          alt="day status" 
          width={28} 
          height={28} 
        />
      </div>
      <span className={styles.dayLetter}>{label}</span>
    </div>
  );
}