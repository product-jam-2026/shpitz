"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';

type DailyAnswer = {
  index: number;
  isCorrect: boolean;
  tip: string;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadDailyAnswers(): DailyAnswer[] {
  const key = `dailyAnswers_${getTodayKey()}`;
  const arr: DailyAnswer[] = JSON.parse(localStorage.getItem(key) || "[]");
  return arr.sort((a, b) => a.index - b.index);
}

function buildSquares(answers: DailyAnswer[], total: number) {
  const byIndex = new Map<number, DailyAnswer>();
  answers.forEach(a => byIndex.set(a.index, a));

  const out: string[] = [];
  for (let i = 0; i < total; i++) {
    const a = byIndex.get(i);
    out.push(a?.isCorrect ? "🟩" : "🟥");
  }
  return out.join("");
}

function countCorrect(answers: DailyAnswer[]) {
  return answers.filter(a => a.isCorrect).length;
}

function getDailyTip(answers: DailyAnswer[]) {
  return answers.length > 0 ? (answers[0].tip || "") : "";
}

function buildShareSummary(params: {
  correctCount: number;
  total: number;
  squares: string;
  dailyTip: string;
}) {
  const { correctCount, total, squares, dailyTip } = params;

  return (
`*הצלחתי היום ${correctCount}/${total} חידודים!*
${squares}

*הטיפ היומי*
${dailyTip}

בוא להתחדד גם עם האתגר היומי לזיהוי הונאות רשת!
https://shpitz.vercel.app/`
  );
}

export default function StreakPage() {
  const router = useRouter();
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);

  useEffect(() => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    
    // Get activity dates
    const activityDates = JSON.parse(localStorage.getItem('userActivityDates') || '[]');
    
    // Save today's activity
    const todayString = today.toISOString().split('T')[0];
    if (!activityDates.includes(todayString)) {
      activityDates.push(todayString);
      localStorage.setItem('userActivityDates', JSON.stringify(activityDates));
    }

    // Calculate consecutive streak
    let consecutiveStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateString = checkDate.toISOString().split('T')[0];
      if (activityDates.includes(dateString)) {
        consecutiveStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Get active days for current week
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

    // Get answer results for squares
    const daily = loadDailyAnswers();
    const answers = daily.map(a => a.isCorrect);
    setAnswerResults(answers);
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
      };
    }
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
    const total = 5;
    const daily = loadDailyAnswers();
    const correctCount = countCorrect(daily);
    const squares = buildSquares(daily, total);
    const dailyTip = getDailyTip(daily) || "בדקו האם יש אזורים מרוחים על הפנים של הדמויות.";

    const { stickerPath, message: streakMessage } = getStickerByStats(streak, correctCount);
    const shareText = `${streakMessage}\n\n${buildShareSummary({
      correctCount,
      total,
      squares,
      dailyTip,
    })}`;

    const stickerUrl = `${window.location.origin}${stickerPath}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n(סטיקר): ${stickerUrl}`)}`;

    try {
      const response = await fetch(stickerPath);
      const blob = await response.blob();
      const file = new File([blob], "sticker.png", { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          text: shareText,
        });
        return;
      }

      window.open(whatsappUrl, "_blank");
    } catch (err) {
      console.error("Error sharing:", err);
      window.open(whatsappUrl, "_blank");
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    router.push('/');
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

  const getBadgeStatus = (days: number) => {
    return streak >= days;
  };

  const today = new Date().getDay();

  return (
    <div className={styles.pageWrapper}>
      {/* Back arrow button */}
      <button className={styles.backButton} onClick={handleBack}>
        <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
          <path d="M27.4258 18.6515L17.9309 9.1566L20.347 6.78288L33.9111 20.347L20.347 33.9111L17.9309 31.5374L27.4258 22.0425L6.78288 22.0425L6.78288 18.6515L27.4258 18.6515Z" fill="#1C1D1E"/>
        </svg>
      </button>

      <div className={styles.container} dir="rtl">
        {/* Title */}
        <h1 className={styles.mainTitle}>נתראה מחר!</h1>

        {/* Main card with character and squares */}
        <div className={styles.mainCard}>
          {/* Character image */}
          <div className={styles.characterContainer}>
            <Image 
              src="/icons/saturday.svg"
              alt="Character"
              width={200}
              height={200}
              className={styles.characterImage}
            />
          </div>
          {/* Colored squares */}
          {answerResults.length > 0 && (
            <div className={styles.answersIndicator}>
              {answerResults.map((isCorrect, index) => (
                <div 
                  key={index} 
                  className={`${styles.answerSquare} ${isCorrect ? styles.correct : styles.wrong}`}
                />
              ))}
            </div>
          )}

          {/* Share button */}
          <button className={styles.shareButton} onClick={handleShare}>
            <svg className={styles.shareArrow} xmlns="http://www.w3.org/2000/svg" width="37" height="31" viewBox="0 0 37 31" fill="none">
              <g clipPath="url(#clip0_1722_3001)">
                <path d="M37.0003 12.4124V13.6515C35.1448 15.7094 24.7185 28.9856 23.4594 24.7593V19.8029C14.4248 19.2939 7.48866 24.4053 1.9 30.9106C-0.264774 31.1762 0.0223907 30.977 0.0223907 29.052C0.0223907 21.2854 5.54478 12.8992 12.3263 9.27038C15.3746 7.63298 22.9293 6.52663 23.3269 6.10621C23.9896 5.42027 23.2827 -0.819556 25.3149 0.10978L37.0224 12.4124H37.0003Z" fill="#111012"/>
              </g>
              <defs>
                <clipPath id="clip0_1722_3001">
                  <rect width="37" height="31" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span className={styles.shareText}>שתף חברים</span>
          </button>
        </div>

        {/* Weekly streak section with SVG squares */}
        <div className={styles.streakCard}>
          <p className={styles.streakTitle}>מתחדד כבר {streak} ימים ברצף!</p>
          
          <div className={styles.daysContainer}>
            {daysOfWeek.map((day) => {
              const isActive = activeDays.includes(day.value);
              const isPast = day.value <= today;
              
              return (
                <div key={day.value} className={styles.dayItem}>
                  {/* SVG Square */}
                  {isActive && isPast ? (
                    // Filled square - no outline, just green plus on black background
                    <svg className={styles.daySquare} xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                      <rect width="27" height="27" fill="#111012"/>
                      <path d="M27.1143 27.3506H-0.249023V-0.0126953H27.1143V27.3506ZM13.4121 3.60547C12.5535 3.60547 11.8574 4.30153 11.8574 5.16016V12.1211H4.89746C4.04975 12.1211 3.3623 12.8085 3.3623 13.6562C3.36244 14.5038 4.04983 15.1914 4.89746 15.1914H11.8574V22.1777C11.8577 23.036 12.5529 23.7322 13.4111 23.7324C14.2696 23.7324 14.9656 23.0361 14.9658 22.1777V15.1914H21.9688C22.8162 15.1912 23.5028 14.5037 23.5029 13.6562C23.5029 12.8087 22.8163 12.1213 21.9688 12.1211H14.9668V5.16016C14.9668 4.30169 14.2705 3.60573 13.4121 3.60547Z" fill="#C7EE26"/>
                    </svg>
                  ) : (
                    // Empty square - very bold outline
                    <svg className={styles.daySquare} xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                      <rect x="2.5" y="2.5" width="22" height="22" fill="transparent" stroke="#111012" strokeWidth="3"/>
                    </svg>
                  )}
                  <span className={styles.dayLabel}>{day.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Badges section - all icons in one container */}
        <div className={styles.badgesCard}>
          <div className={styles.badgesContainer}>
            <div className={`${styles.badge} ${getBadgeStatus(5) ? styles.badgeActive : styles.badgeInactive}`}>
              <div className={styles.badgeImage}>
                <Image 
                  src="/icons/5days.svg" 
                  alt="5 days"
                  width={60}
                  height={60}
                />
              </div>
            </div>
            <div className={`${styles.badge} ${getBadgeStatus(9) ? styles.badgeActive : styles.badgeInactive}`}>
              <div className={styles.badgeImage}>
                <Image 
                  src="/icons/9days.svg" 
                  alt="9 days"
                  width={90}
                  height={90}
                />
              </div>
            </div>
            <div className={`${styles.badge} ${getBadgeStatus(13) ? styles.badgeActive : styles.badgeInactive}`}>
              <div className={styles.badgeImage}>
                <Image 
                  src="/icons/13days.svg" 
                  alt="13 days"
                  width={110}
                  height={110}
                />
              </div>
            </div>
          </div>
          
          {/* Labels outside container */}
          <div className={styles.badgeLabelsContainer}>
            <span className={styles.badgeLabel}>5 ימים</span>
            <span className={styles.badgeLabel}>9 ימים</span>
            <span className={styles.badgeLabel}>13 ימים</span>
          </div>
        </div>
        {/* Button Section*/}
          <div className={styles.bottomCharacter}>
            <Image 
              src="/icons/YOUR_BOTTOM_CHARACTER.svg" 
              alt="Character"
              width={120}
              height={120}
            />
          <p className={styles.bottomText}>בשתוקנו איכולו<br />האינטרנט הישראלי!</p>
        </div>
      </div>
    </div>
  );
}
