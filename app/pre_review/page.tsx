"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ReviewButton from "@/lib/components/ReviewButton";
import styles from './page.module.css';
import Image from 'next/image';

export default function PreReview() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get score from localStorage
    const savedScore = localStorage.getItem('gameScore');
    const savedTotal = localStorage.getItem('totalQuestions');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedTotal) setTotal(parseInt(savedTotal));

    setLoading(false);
  }, []);

  const handleNext = () => {
    router.push('./review');
  };

  // Determine if score is good (more than 3 correct answers)
  const isGoodScore = score >= 3;

  if (loading) {
    return (
      <div className={styles.container} dir="rtl">
        <p style={{ textAlign: "center", color: "#fff" }}>טוען...</p>
      </div>
    );
  }

  
  return (
     <div className={styles.screen} dir="rtl">
    <div className={styles.container}>
      {/* SVG Image - Different based on score */}
      <div className={styles.imageContainer}>
        {isGoodScore ? (
          <Image 
            src="/icons/chief.svg" 
            alt="Success"
            fill
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <Image 
            src="/icons/not_the_sharpest.svg"
            alt="Try again"
            fill
            style={{ objectFit: 'contain' }}
          />
        )}
      </div>

      {/* Text Content - Different based on score */}
      <div className={styles.textContent}>
        {isGoodScore ? (
          <>
            <p className={styles.mainText}>
              כל הכבוד, יצאת שפיץ!
            </p>
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
      </div>

      {/* Button */}
      <ReviewButton onClick={handleNext} />
    </div>
  </div>
  );
}