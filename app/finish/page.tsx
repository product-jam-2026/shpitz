"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Image from 'next/image';
import Lottie from "lottie-react";
import introAnim from "@/public/animation/finish/intro.json";
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
function localDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`; // YYYY-MM-DD (LOCAL)
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
  const [showIntro, setShowIntro] = useState(true);

  const [fadeIntro, setFadeIntro] = useState(false);  // האם להתחיל fade-out
   type DateCell = {
    key: string;       // YYYY-MM-DD
    label: string;     // 21.1
    offset: number;    // -3..+3
  };
   const [dateCells, setDateCells] = useState<DateCell[]>([]);
  const [activitySet, setActivitySet] = useState<Set<string>>(new Set());

  // Handle intro animation - Lottie onComplete
  useEffect(() => {
    // This effect is just a dependency holder, actual logic is in Lottie onComplete
  }, []);

  useEffect(() => {
    const today = new Date();
    const todayDayOfWeek = today.getDay();
    
    // Get activity dates
    const activityDates = JSON.parse(localStorage.getItem('userActivityDates') || '[]');
    
    // Save today's activity
    const todayString = localDateKey(today);
    if (!activityDates.includes(todayString)) {
      activityDates.push(todayString);
      localStorage.setItem('userActivityDates', JSON.stringify(activityDates));
    }
 

    // Calculate consecutive streak
    let consecutiveStreak = 0;
    let checkDate = new Date(today);

    while (true) {
      const dateString = localDateKey(checkDate);
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
      const dateString = localDateKey(checkDay);
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

     setActivitySet(new Set(activityDates));
const cells: DateCell[] = [];
    for (let offset = -3; offset <= 3; offset++) {
      const d = addDays(today, offset);
      cells.push({
        key: dateKey(d),
        label: formatDateIL(d),
        offset,
      });
    }
    setDateCells(cells);
  }, []);

  type StickerShare = {
    stickerPath: string;  
    message: string;
  };
  function dateKey(d: Date) {
  return localDateKey(d);
}

function addDays(base: Date, delta: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + delta);
  return d;
}

function formatDateIL(d: Date) {
  // 21.1
  return `${d.getDate()}.${d.getMonth() + 1}`;
}

  function getStickerByStats(streak: number): StickerShare {
    if (streak >= 0 && streak <= 3) {
      return {
        stickerPath: "/Stickers/stickerday1_3.png",
        message: `אני מתחדד כבר ${streak} ימים ברצף!`
      };
    }
    if (streak >= 4 && streak <= 7) {
      return {
        stickerPath: "/Stickers/stickerday3_7.png",
        message: `אני מתחדד כבר ${streak} ימים ברצף!`
      };
    }
    if (streak >= 7 && streak <=14 ) {
      return {
        stickerPath: "/Stickers/stickerday7_14.png",
        message: `אני מתחדד כבר ${streak} ימים ברצף!`
      };
    }

    return {
      stickerPath:  "/Stickers/stickerday7_14.png",
      message: `אני מתחדד כבר ${streak} ימים ברצף!`
    };
  }

  const handleShare = async () => {
    const total = 5;
    const daily = loadDailyAnswers();
    const correctCount = countCorrect(daily);
    const squares = buildSquares(daily, total);
    const dailyTip = getDailyTip(daily) || "בדקו האם יש אזורים מרוחים על הפנים של הדמויות.";

    const { stickerPath, message: streakMessage } = getStickerByStats(streak);
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





  const getBadgeStatus = (days: number) => {
    return streak >= days;
  };

  const today = new Date().getDay();

          return (
            <div className={styles.pageWrapper}>
              {/* Back arrow button */}
              {showIntro && (
          <div className={`${styles.introOverlay} ${fadeIntro ? styles.introFadeOut : ""}`}>
            <Lottie
              animationData={introAnim}
              loop={false}
              autoplay
              onComplete={() => {
                setFadeIntro(true);
                setTimeout(() => setShowIntro(false), 500);
              }}
              className={styles.introLottie}
            />
          </div>
        )}

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
                    {/* Character image */}
          <div className={styles.characterContainer}>
            <Image 
              src="/icons/saturday.svg"
              alt="Character"
              width={300}
              height={300}
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
             <Image
                    src="/icons/arrowInTheFinal.svg"
                    alt="Share"
                    width={37}
                    height={31}
                    className={styles.shareArrow}
                  />
            <span className={styles.shareText}>שתף חברים</span>
          </button>
        </div>

        {/* Weekly streak section with SVG squares */}
        <div className={styles.streakCard}>
          <p className={styles.streakTitle}>מתחדד כבר {streak} ימים ברצף!</p>
          <div className={styles.daysContainer}>
              {dateCells.map((cell) => {
                const isToday = cell.offset === 0;
                const didEnter = activitySet.has(cell.key);

                const iconSrc =
                  isToday
                    ? "/icons/activeDay.svg"
                    : didEnter
                      ? "/icons/visited.svg"
                      : "/icons/NotActiveDay.svg";

                const iconAlt =
                  isToday
                    ? "היום"
                    : didEnter
                      ? "ביקור בעבר"
                      : "לא פעיל";

                return (
                  <div key={cell.key} className={styles.dayItem}>
                    <Image
                      src={iconSrc}
                      alt={iconAlt}
                      width={36}
                      height={36}
                      className={styles.daySquare}
                    />
                    <span className={styles.dayLabel}>{cell.label}</span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Badges section - all icons in one container */}
        <div className={styles.badgesCard}>
          <p className={styles.badgesTitle}>משחקים באופן קבוע?<br/> מקבלים מדבקה חדשה!</p>
          <div className={styles.badgesContainer}>
            <div className={`${styles.badge} ${getBadgeStatus(3) ? styles.badgeActive : styles.badgeInactive}`}>
              <div className={styles.badgeImage}>
                <Image 
                  src="/icons/candelShabatSticker.svg" 
                  alt="5 days"
                  width={90}
                  height={90}
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
                  width={90}
                  height={90}
                />
              </div>
            </div>
          </div>
          
          {/* Labels outside container */}
          <div className={styles.badgeLabelsContainer}>
             <span
              className={`${styles.badgeLabel} ${
                getBadgeStatus(3) ? styles.badgeLabelActive : styles.badgeLabelInactive
              }`}
            >
              3 ימים
            </span>
             <span
              className={`${styles.badgeLabel} ${
                getBadgeStatus(9) ? styles.badgeLabelActive : styles.badgeLabelInactive
              }`}
            >
              9 ימים
            </span>
             <span
              className={`${styles.badgeLabel} ${
                getBadgeStatus(13) ? styles.badgeLabelActive : styles.badgeLabelInactive
              }`}
            >
              13 ימים
            </span>

          
          </div>
        </div>
        {/* Button Section*/}
          <div className={styles.bottomSection}>
            <Image 
              src="/icons/finalLogo.svg" 
              alt="Character"
              width={315}
              height={315}
               
            />
         
        </div>
      </div>
    </div>
  );
}
