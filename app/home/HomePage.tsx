"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./homePage.module.css";
import Image from "next/image";
function localDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD (LOCAL)
}

function addDays(base: Date, delta: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + delta);
  return d;
}

function formatDDMM(date: Date) {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}`;
}

export default function HomePage(){
  const router = useRouter();

  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [streak, setStreak] = useState(0);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [dateCells, setDateCells] = useState<{ iso: string; label: string; offset: number }[]>([]);

  useEffect(() => {
    const today = new Date();

    // ✅ first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    setIsFirstVisit(!hasVisited);

    // ✅ completed today (LOCAL date key)
    const todayKey = localDateKey(today);
    const completedDate = localStorage.getItem("dailyCompletedDate");
    setHasCompletedToday(completedDate === todayKey);

    // ✅ activity dates
    const activityDates: string[] = JSON.parse(
      localStorage.getItem("userActivityDates") || "[]"
    );

    // save today's visit
    if (!activityDates.includes(todayKey)) {
      activityDates.push(todayKey);
      localStorage.setItem("userActivityDates", JSON.stringify(activityDates));
    }

    // ✅ streak WITHOUT counting today
    let consecutiveStreak = 0;
    const checkDate = addDays(today, -1); // start from yesterday

    while (true) {
      const dateString = localDateKey(checkDate);
      if (activityDates.includes(dateString)) {
        consecutiveStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    setStreak(consecutiveStreak);
    localStorage.setItem("userStreak", consecutiveStreak.toString());

    // ✅ activeDays = all visited days (for visited.svg)
    setActiveDays(activityDates);

    // ✅ 7-date window (today in the middle)
    const cells = [];
    for (let offset = -3; offset <= 3; offset++) {
      const d = addDays(today, offset);
      cells.push({
        iso: localDateKey(d),
        label: formatDDMM(d),
        offset,
      });
    }
    setDateCells(cells);

    setLoaded(true);
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
    <MobileContent activeDays={activeDays} streak={streak} onStart={handleStart}  dateCells={dateCells}/>
  );
  }

function MobileContent({
  activeDays,
  streak,
  onStart,
  dateCells,
}: {
  activeDays: string[];
  streak: number;
  onStart: () => void;
  dateCells: { iso: string; label: string; offset: number }[];
}) {

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
          {dateCells.map((day) => (
          <DayIndicator
            key={day.iso}
            label={day.label}
            isToday={day.offset === 0}
            isVisited={activeDays.includes(day.iso)}
          />
        ))}


          </div>
        </div>
        <div className={styles.startArea}>
<div className={styles.partnerRow}>
  <Image
    src="/icons/InternetLogo.svg"
    alt="איגוד האינטרנט הישראלי"
    width={24}
    height={24}
    className={styles.partnerLogo}
  />

  <span className={styles.partnerText}>
    בשיתוף איגוד האינטרנט הישראלי
  </span>
</div>

<button className={styles.startButton} onClick={onStart}>
  <span className={styles.buttonText}>התחל</span>
</button>
        </div>
      </div>
    </div>
  );
}

function DayIndicator({
  label,
  isVisited,
  isToday,
}: {
  label: string;
  isVisited: boolean;
  isToday: boolean;
}) {
  const iconSrc = isToday
    ? "/icons/today.svg"
    : isVisited
      ? "/icons/visited.svg"
      : "/icons/NotActiveDay.svg";

  return (
    <div className={styles.dayItem}>
      <div className={styles.iconWrapper}>
        <Image src={iconSrc} alt="day status" width={28} height={28} />
      </div>
              <span
          className={`${styles.dayLetter} ${
            isToday ? styles.todayDate : ""
          }`}
        >
          {label}
        </span>
    </div>
  );
}
