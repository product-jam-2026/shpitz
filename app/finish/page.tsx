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
    const today = new Date();
    const todayDayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
    const savedScore = localStorage.getItem('gameScore');
    const s = savedScore ? parseInt(savedScore) : 0;
    
    // Get all activity dates from localStorage
    const activityDates = JSON.parse(localStorage.getItem('userActivityDates') || '[]');
    
    // Save today's activity first
    const todayString = today.toISOString().split('T')[0];
    if (!activityDates.includes(todayString)) {
      activityDates.push(todayString);
      localStorage.setItem('userActivityDates', JSON.stringify(activityDates));
    }

    // Calculate consecutive streak (now including today)
    let consecutiveStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (activityDates.includes(dateString)) {
        consecutiveStreak++;
        checkDate.setDate(checkDate.getDate() - 1); // Go back one day
      } else {
        break; // Streak broken
      }
    }
    
    // Get active days for current week (only days that have passed)
    const currentWeekActiveDays: number[] = [];
    for (let i = 0; i <= todayDayOfWeek; i++) {
      const checkDay = new Date(today);
      checkDay.setDate(today.getDate() - (todayDayOfWeek - i));
      const dateString = checkDay.toISOString().split('T')[0];
      if (activityDates.includes(dateString)) {
        currentWeekActiveDays.push(i);
      }
    }
    
    setActiveDays(currentWeekActiveDays);
    setStreak(consecutiveStreak);
    localStorage.setItem('userStreak', consecutiveStreak.toString());
  }, []);
  type StickerShare = {
  stickerPath: string;  
  message: string;
  };

  function getStickerByStats(streak: number, correctCount: number): StickerShare {
    if (correctCount === 0) {
    return {
      stickerPath:"/Stickers/sticker0_no_answers.png",
      message: `אני צריך להתאמץ יותר בזיהוי הונאות רשת! הצטרפו אליי ללמוד איך להתחדד!`
    };}
    else if (streak >= 1 && streak <= 3) {
    return {
      stickerPath: "/Stickers/stickerday1_3.png",
      message: `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`
    };
    }
    if (streak >= 4 && streak <= 5) {
      return {
      stickerPath: "/Stickers/stickerday3_5.png",
      message: `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`
    };
  }
  if (streak >= 6 && streak <= 7) {
    return {
      stickerPath: "/Stickers/stickerday5_7.png",
      message: `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`
    };
  }
  if (streak >= 14 && streak <= 20) {
    return {
      stickerPath: "/Stickers/stickerday14_23.png",
      message: `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`
    };
  }
  if (streak >= 21) {
    return {
      stickerPath: "/Stickers/stickerday21_31.png",
      message: `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`
    };

  }
  return {
  stickerPath:  "/Stickers/stickerday21_31.png",
  message: `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`
  };
  }
  const handleShare = async () => {
    // const message = `אני מתחדד כבר ${streak} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`;
    // const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    // window.open(whatsappUrl, '_blank');
    // const stickerPath="/Stickers/sticker day 1-3.png";
    // const message = `אני מתחדד כבר ${3} ימים ברצף! בואו גם אתם להתחדד בזיהוי הונאות רשת!`;
    // try{
    //   const response = await fetch(stickerPath);
    //   const blob = await response.blob();

    //   // const file = new File([blob], "sticker.webp", { type: blob.type });
    //   const file = new File([blob], "result.png", { type: "image/png" });
    //   if (navigator.canShare && navigator.canShare({ files: [file] })) {
    //     await navigator.share({
          
    //       files: [file],
    //       text: message,
    //     });
    //     } else {
    //       const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    //       window.open(whatsappUrl, '_blank');
    //     } 
    //     } catch (error) {
    //       console.error('Error sharing:', error);const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    //       window.open(whatsappUrl, '_blank');
    //     }
    const savedScore = localStorage.getItem("gameScore");
    const correctCount = savedScore ? parseInt(savedScore, 10) : 0;
    const { stickerPath, message } = getStickerByStats(streak, correctCount);

    //Todo added now 
      const stickerUrl = `${window.location.origin}${stickerPath}`;
      const whatsappText = `${message}\n\nהסטיקר שלי 👇\n${stickerUrl}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
     try {
      const response = await fetch(stickerPath);
      const blob = await response.blob();
      const file = new File([blob], "sticker.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })){
         await navigator.share({
            files: [file],
            text: message,
          });
          window.open(whatsappUrl, "_blank");
           return;
      }
      // const stickerUrl = `${window.location.origin}${stickerPath}`;
      // const whatsappText = `${message}\n\nהסטיקר שלי 👇\n${stickerUrl}`;
      // const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
      // window.open(whatsappUrl, "_blank");
      } catch (err) {
      console.error("Error sharing:", err);
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");
      }


  };

  const handleContinue = () => {
    router.push('/');
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

  const getBadgeStatus = (days: number) => {
    return streak >= days;
  };

  const today = new Date().getDay();
  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container} dir="rtl">
        <div className={styles.statsBox}>
          <div className={styles.headerText}>
            <p className={styles.mainTitle}>אתה מתחדד {streak} ימים ברצף!</p>
          </div>

          <div className={styles.daysContainer}>
            {daysOfWeek.map((day) => {
              const isActive = activeDays.includes(day.value);
              const isPast = day.value <= today; // Only show days up to today
              
              return (
                <div key={day.value} className={styles.dayCircle}>
                  <div className={`${styles.circle} ${isActive && isPast ? styles.circleFilled : styles.circleEmpty}`}>
                    {isActive && isPast && (
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
                <Image 
                  src="/icons/9days.svg" 
                  alt="9 days badge"
                  width={100}
                  height={100}
                />
              </div>
              <span className={styles.badgeLabel}>9 ימים</span>
            </div>
            <div className={`${styles.badge} ${getBadgeStatus(13) ? styles.badgeActive : styles.badgeInactive}`}>
              <div className={styles.badgeImage}>
                <Image 
                  src="/icons/13days.svg" 
                  alt="13 days badge"
                  width={120}
                  height={120}
                />
              </div>
              <span className={styles.badgeLabel}>13 ימים</span>
            </div>
          </div>
        </div>

        <div className={styles.characterContainer}>
          <div className={styles.characterImage}>
            <Image 
              src="/icons/final.svg" 
              alt="Character"
              width={250}
              height={250}
            />
          </div>
        </div>

        <button className={styles.shareButton} onClick={handleShare}>
          <span className={styles.shareText}>שתף</span>
          <span className={styles.shareArrow}>↩</span>
        </button>

        <div className={styles.streakText}>
          נתראה מחר!
        </div>
      </div>
    </div>
  );
}