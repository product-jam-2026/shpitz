"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./homePage.module.css";
import Image from "next/image";

export default function Index() {
  const router = useRouter();

  const [activeDays, setActiveDays] = useState<number[]>([]);
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
    const currentWeekActiveDays: number[] = [];
    for (let i = 0; i <= todayDayOfWeek; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - (todayDayOfWeek - i));
      const dStr = d.toISOString().split("T")[0];
      if (activityDates.includes(dStr)) {
        currentWeekActiveDays.push(i);
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
  activeDays: number[];
  streak: number;
  onStart: () => void;
}) {
  const daysOfWeek = [
    { label: "א", value: 0 },
    { label: "ב", value: 1 },
    { label: "ג", value: 2 },
    { label: "ד", value: 3 },
    { label: "ה", value: 4 },
    { label: "ו", value: 5 },
    { label: "ש", value: 6 },
  ];

  const today = new Date().getDay();

  return (
    <div className={styles.screen} dir="rtl">
      {/* Logo at top */}
      <div className={styles.logoContainer}>
        <div className={styles.mainIcon}>
          <Image 
            src="/icons/homePageIcon.svg" 
            alt="homePageLogo" 
            width={150} 
            height={150} 
            priority 
          />
        </div>
      </div>

      {/* Center content */}
      <div className={styles.centerContainer}>
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
            {daysOfWeek.map((day) => {
              const isActive = activeDays.includes(day.value);
              const isPast = day.value <= today;
              
              return (
                <div key={day.value} className={styles.dayCircle}>
                  <div className={`${styles.circle} ${isActive && isPast ? styles.circleFilled : styles.circleEmpty}`}>
                    {isActive && isPast && <span className={styles.checkmark}>+</span>}
                  </div>
                  <span className={styles.dayLabel}>{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Button at bottom */}
      <div className={styles.buttonWrapper}>
        <button 
          className={styles.startButton} 
          onClick={onStart}
          style={{
            transform: 'none',
            transition: 'opacity 0.1s',
          }}
        >
          <span className={styles.buttonText}>התחל</span>
        </button>
      </div>
    </div>
  );
}