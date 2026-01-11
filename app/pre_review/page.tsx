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
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get score from localStorage
    const savedScore = localStorage.getItem('gameScore');
    const savedTotal = localStorage.getItem('totalQuestions');
    
    if (savedScore) setScore(parseInt(savedScore));
    if (savedTotal) setTotal(parseInt(savedTotal));

    // Get individual answer results
    const dailyResultsStr = localStorage.getItem('dailyResults');
    console.log('📦 dailyResults:', dailyResultsStr);
    
    if (dailyResultsStr) {
      try {
        const results = JSON.parse(dailyResultsStr);
        console.log('📊 Parsed results:', results);
        
        // Try multiple possible data structures
        let answers: boolean[] = [];
        
        // Check if we have a questions array with isCorrect property
        if (results.questions && Array.isArray(results.questions)) {
          answers = results.questions.map((q: any) => q.isCorrect === true);
          console.log('✅ Found answers from questions array:', answers);
        }
        // Check if we have correctAnswers array
        else if (results.correctAnswers && Array.isArray(results.correctAnswers)) {
          answers = results.correctAnswers;
          console.log('✅ Found answers from correctAnswers array:', answers);
        }
        // Check if we have answers array
        else if (results.answers && Array.isArray(results.answers)) {
          answers = results.answers;
          console.log('✅ Found answers from answers array:', answers);
        }
        // Fallback: derive from score
        else {
          const correctCount = parseInt(savedScore || '0');
          const totalCount = parseInt(savedTotal || '5');
          // Create array: first 'correctCount' are true, rest are false
          answers = Array.from({ length: totalCount }, (_, i) => i < correctCount);
          console.log('⚠️ Using fallback based on score:', answers);
        }
        
        setAnswerResults(answers);
      } catch (error) {
        console.error('❌ Error parsing dailyResults:', error);
        // Fallback to score-based array
        const correctCount = parseInt(savedScore || '0');
        const totalCount = parseInt(savedTotal || '5');
        const fallbackAnswers = Array.from({ length: totalCount }, (_, i) => i < correctCount);
        setAnswerResults(fallbackAnswers);
      }
    } else {
      // No dailyResults, use score-based fallback
      const correctCount = parseInt(savedScore || '0');
      const totalCount = parseInt(savedTotal || '5');
      const fallbackAnswers = Array.from({ length: totalCount }, (_, i) => i < correctCount);
      console.log('⚠️ No dailyResults, using score-based fallback:', fallbackAnswers);
      setAnswerResults(fallbackAnswers);
    }

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
                  חד בהגזמה!
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