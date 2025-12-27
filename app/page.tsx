"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function StreakPage() {
  const router = useRouter();
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Get streak and active days from localStorage
    const savedDays = JSON.parse(localStorage.getItem('userActivityDays') || '[]');
    const savedStreak = parseInt(localStorage.getItem('userStreak') || '0');
    
    setActiveDays(savedDays);
    setStreak(savedStreak);
  }, []);

  const handleShare = () => {
    // Add share functionality here
    console.log("Share clicked");
  };

  const handleContinue = () => {
    // Navigate to next page
    router.push('/home'); // or wherever you want to go
  };

  const daysOfWeek = [
    { label: 'א', value: 0 },
    { label: 'ב', value: 1 },
    { label: 'ג', value: 2 },
    { label: 'ד', value: 3 },
    { label: 'ה', value: 4 },
    { label: 'ו', value: 5 },
    { label: 'ש', value: 6 },
  ];

  // Determine which badge to highlight based on streak
  const getBadgeStatus = (days: number) => {
    return streak >= days;
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Top text */}
      <div className={styles.headerText}>
        <p className={styles.headerLine1}>אתה מתחזק {streak} ימים ברצף!</p>
        <p className={styles.headerLine2}>קיבלת מדבקה חדשה!</p>
      </div>

      {/* Days of the week circles */}
      <div className={styles.daysContainer}>
        {daysOfWeek.map((day) => (
          <div key={day.value} className={styles.dayCircle}>
            <div className={`${styles.circle} ${activeDays.includes(day.value) ? styles.circleFilled : styles.circleEmpty}`}>
              {activeDays.includes(day.value) && (
                <span className={styles.checkmark}>✓</span>
              )}
            </div>
            <span className={styles.dayLabel}>{day.label}</span>
          </div>
        ))}
      </div>

      {/* Achievement badges */}
      <div className={styles.badgesContainer}>
        <div className={`${styles.badge} ${getBadgeStatus(13) ? styles.badgeActive : styles.badgeInactive}`}>
          <div className={styles.badgeImage}>
            {/* Insert 13 days badge SVG here */}
          </div>
          <span className={styles.badgeLabel}>13 ימים</span>
        </div>
        <div className={`${styles.badge} ${getBadgeStatus(9) ? styles.badgeActive : styles.badgeInactive}`}>
          <div className={styles.badgeImage}>
            {/* Insert 9 days badge SVG here */}
          </div>
          <span className={styles.badgeLabel}>9 ימים</span>
        </div>
        <div className={`${styles.badge} ${getBadgeStatus(5) ? styles.badgeActive : styles.badgeInactive}`}>
          <div className={styles.badgeImage}>
            {/* Insert 5 days badge SVG here */}
          </div>
          <span className={styles.badgeLabel}>5 ימים</span>
        </div>
      </div>

      {/* Main character image */}
      <div className={styles.characterContainer}>
        <div className={styles.characterImage}>
          {/* Insert main character SVG here */}
        </div>
        <div className={styles.characterText}>
          <p className={styles.congratsText}>!התחלה</p>
          <p className={styles.congratsText}>!חדה</p>
        </div>
      </div>

      {/* Share button */}
      <button className={styles.shareButton} onClick={handleShare}>
        <span className={styles.shareText}>שתף</span>
        <span className={styles.shareArrow}>↩</span>
      </button>

      {/* Bottom link */}
      <a href="#" className={styles.bottomLink} onClick={handleContinue}>
        נתראה מחר!
      </a>
    </div>
  );
}