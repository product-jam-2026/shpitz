"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';

export default function StreakPage() {
  const router = useRouter();
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    // Get streak and active days from localStorage
    const savedDays = JSON.parse(localStorage.getItem('userActivityDays') || '[]');
    const savedStreak = parseInt(localStorage.getItem('userStreak') || '0');
    
    console.log('Saved days:', savedDays); // Debug log
    console.log('Saved streak:', savedStreak); // Debug log
    
    setActiveDays(savedDays);
    setStreak(savedStreak);
  }, []);

  const handleShare = () => {
    // Create WhatsApp share message
    const message = `אני מתחזק כבר ${streak} ימים ברצף! 🎯 בואו גם אתם להתחדד בזיהוי הונאות רשת!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp in new window/tab
    window.open(whatsappUrl, '_blank');
  };

  const handleContinue = () => {
    // Navigate to next page
    router.push('/'); // Navigate to home
  };

  // Days of week: Sunday (0) to Saturday (6)
  const daysOfWeek = [
    { label: 'א', value: 0 }, // Sunday
    { label: 'ב', value: 1 }, // Monday
    { label: 'ג', value: 2 }, // Tuesday
    { label: 'ד', value: 3 }, // Wednesday
    { label: 'ה', value: 4 }, // Thursday
    { label: 'ו', value: 5 }, // Friday
    { label: 'ש', value: 6 }, // Saturday
  ];

  // Determine which badge to highlight based on streak
  const getBadgeStatus = (days: number) => {
    return streak >= days;
  };

  return (
    <div className={styles.container} dir="rtl">
      {/* Top text */}
      <div className={styles.headerText}>
        <p className={styles.mainTitle}>אתה מתחדד {streak} ימים!</p>
      </div>

      {/* Days of the week circles */}
      <div className={styles.daysContainer}>
        {daysOfWeek.map((day) => {
          const isActive = activeDays.includes(day.value);
          return (
            <div key={day.value} className={styles.dayCircle}>
              <div className={`${styles.circle} ${isActive ? styles.circleFilled : styles.circleEmpty}`}>
                {isActive && (
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="1.83" y="1.83" width="26.34" height="26.34" rx="13.17" stroke="#FFFFFF" strokeWidth="3.66"/>
                    <path d="M11.0185 24.4996C9.9352 24.2829 8.03934 22.9288 7.49767 21.9537L13.0227 16.3745L12.7519 15.6162L5.2768 14.3161C5.06013 13.2328 5.87264 11.0119 6.63099 10.1453L13.6186 13.6661L13.9436 13.3953L12.8061 5.86603C13.8352 5.37852 16.2186 5.37852 17.2478 5.86603L16.1103 13.5036L16.3811 13.6661L23.3687 10.1453C24.1271 11.0119 24.9396 13.2328 24.7229 14.3161L17.2478 15.6162L16.977 16.3745L22.3937 21.8454C21.9062 22.8746 20.0103 24.2288 18.8187 24.4454L15.2978 17.6745H14.6478L11.0185 24.4996Z" fill="#CCFF00"/>
                  </svg>
                )}
              </div>
              <span className={styles.dayLabel}>{day.label}</span>
            </div>
          );
        })}
      </div>

      {/* Achievement badges */}
      <div className={styles.badgesContainer}>
        <div className={`${styles.badge} ${getBadgeStatus(5) ? styles.badgeActive : styles.badgeInactive}`}>
          <div className={styles.badgeImage}>
            <Image 
              src="/icons/5days.svg" 
              alt="5 days badge"
              width={60}
              height={60}
            />
          </div>
          <span className={styles.badgeLabel}>5 ימים</span>
        </div>
        <div className={`${styles.badge} ${getBadgeStatus(9) ? styles.badgeActive : styles.badgeInactive}`}>
          <div className={styles.badgeImage}>
            {/* Insert 9 days badge SVG here */}
          </div>
          <span className={styles.badgeLabel}>9 ימים</span>
        </div>
        <div className={`${styles.badge} ${getBadgeStatus(13) ? styles.badgeActive : styles.badgeInactive}`}>
          <div className={styles.badgeImage}>
            {/* Insert 13 days badge SVG here */}
          </div>
          <span className={styles.badgeLabel}>13 ימים</span>
        </div>
      </div>

      {/* Main character image */}
      <div className={styles.characterContainer}>
        <div className={styles.characterImage}>
          <Image 
            src="/icons/5days.svg" 
            alt="Character"
            width={250}
            height={250}
          />
        </div>
        <div className={styles.characterOverlay}>
          <p className={styles.congratsText}>התחלה</p>
          <p className={styles.congratsText}>חדה!</p>
        </div>
      </div>

      {/* Share button */}
      <button className={styles.shareButton} onClick={handleShare}>
        <span className={styles.shareText}>שתף</span>
        <span className={styles.shareArrow}>↩</span>
      </button>

      {/* Bottom link */}
      <button className={styles.bottomLink} onClick={handleContinue}>
        נתראה מחר!
      </button>
    </div>
  );
}