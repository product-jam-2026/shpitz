"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewButton from "@/lib/components/ReviewButton";
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

export default function PreReview() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(5);
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAnim, setShowAnim] = useState(true);

  useEffect(() => {
    // Get score from localStorage
    const savedScore = localStorage.getItem('gameScore');
    const savedTotal = localStorage.getItem('totalQuestions');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedTotal) setTotal(parseInt(savedTotal));

    // Use the SAME method as finish page to get answer results
    const daily = loadDailyAnswers();
    console.log('📦 Daily answers:', daily);
    
    const answers = daily.map(a => a.isCorrect);
    console.log('✅ Mapped answers:', answers);
    
    setAnswerResults(answers);
    setLoading(false);
  }, []);

  const handleNext = () => {
    router.push('./review');
  };

  // Determine if score is good (more than 3 correct answers)
  const isGoodScore = score >= 3;
  
  useEffect(() => {
    setShowAnim(isGoodScore); // show only when score is good
  }, [isGoodScore]);

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <p style={{ textAlign: "center", color: "#fff" }}>טוען...</p>
      </div>
    );
  }

  console.log('🎨 Rendering with answerResults:', answerResults);
  
  return (
    <div className={styles.screen} dir="rtl">
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* SVG Image - Different based on score */}
          <div className={styles.imageContainer}>
            {isGoodScore ? (
              <Image 
                src="/icons/very_sharp.svg" 
                alt="Success"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            ) : (
              <Image 
                src="/icons/not_the_sharpest.svg"
                alt="Try again"
                className={styles.smallIcon}
                width={24}
                height={24}
              />
            )}
          
            {/* Uncomment when ready to use animation */}
            {/* {isGoodScore && showAnim && (
              <video
                className={styles.animOverlay}
                autoPlay
                muted
                playsInline
                preload="auto"
                onEnded={() => setShowAnim(false)}
                onError={(e) => console.log("VIDEO ERROR:", e)}
              >
                <source src="/animation/preReview/characterAnimation.webm" type="video/webm" />
                <source src="/animation/preReview/characterAnimation.mp4" type="video/mp4" />
              </video>
            )} */}
          </div>

          {/* Text Content - Different based on score */}
          <div className={styles.textContent}>
            {isGoodScore ? (
              <>
                {/* <p className={styles.mainText}>
                  חד בהגזמה!
                </p> */}
                <p className={styles.scoreText}>
                  ענית נכון על {score}/{total} שאלות
                </p>
              </>
            ) : (
              <>
                <p className={styles.mainText}>
                  לא נורא, פעם הבאה תבוא מחודד יותר!
                </p>
                <p className={styles.scoreText}>
                  ענית נכון על {score}/{total} שאלות
                </p>
              </>
            )}

            {/* Colored squares showing correct/wrong answers */}
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
          </div>
        </div>

        {/* Button - Fixed at bottom */}
        <div className={styles.buttonWrapper}>
          <ReviewButton onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}