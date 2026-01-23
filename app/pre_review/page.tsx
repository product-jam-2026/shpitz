"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReviewButton from "@/lib/components/ReviewButton";
import styles from "./page.module.css";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import lottie0 from "@/public/animation/preReview/score0.json";
import lottie1 from "@/public/animation/preReview/score1.json";
import lottie2 from "@/public/animation/preReview/score2.json";
import lottie3 from "@/public/animation/preReview/score3.json";
import lottie4 from "@/public/animation/preReview/score4.json";
import lottie5 from "@/public/animation/preReview/score5.json";
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

type ScoreAssets = {
  lottieData: object;
};


const SCORE_ASSETS: Record<number, ScoreAssets> = {
   0: { lottieData: lottie0 },
  1: { lottieData: lottie1 },
  2: { lottieData: lottie2 },
  3: { lottieData: lottie3 },
  4: { lottieData: lottie4 },
   5: { lottieData: lottie5 },
};


function getAssetsByScore(score: number): ScoreAssets {
  return SCORE_ASSETS[score] ?? SCORE_ASSETS[3];
}

function LottieFreeze({ score, alt }: { score: number; alt: string }) {
  const { lottieData } = useMemo(() => getAssetsByScore(score), [score]);
  const lottieRef = useRef<LottieRefCurrentProps | null>(null);

  useEffect(() => {
    lottieRef.current?.goToAndPlay(0, true);
  }, [score]);

  return (
    <div className={styles.imageContainer} aria-label={alt}>
      <Lottie
        lottieRef={lottieRef}
        className={styles.lottieAnimation}
        animationData={lottieData}
        loop={false}
        autoplay
        onComplete={() => {

          const frames = lottieRef.current?.getDuration(true); // frames count
          if (!frames) return;
          lottieRef.current?.goToAndStop(frames - 1, true);
        }}
      />
    </div>
  );
}

export default function PreReview() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(5);
  const [answerResults, setAnswerResults] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedScore = localStorage.getItem("gameScore");
    const savedTotal = localStorage.getItem("totalQuestions");

    if (savedScore) setScore(parseInt(savedScore, 10));
    if (savedTotal) setTotal(parseInt(savedTotal, 10));

    const daily = loadDailyAnswers();
    setAnswerResults(daily.map((a) => a.isCorrect));

    setLoading(false);
  }, []);

  const handleNext = () => {
    router.push("./review");
  };

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
        <div className={styles.contentWrapper}>
          {/* Lottie only, freezes on last frame */}
          <LottieFreeze score={score} alt={isGoodScore ? "Success" : "Try again"} />

          {/* Text Content */}
          <div className={styles.textContent}>
            {isGoodScore ? (
              <>
                <p className={styles.mainText}>חד בהגזמה!</p>
                <p className={styles.scoreText}>
                  ענית נכון על {score}/{total} שאלות
                </p>
              </>
            ) : (
              <>
                <p className={styles.mainText2}>פעם הבאה תבוא מחודד יותר!</p>
                <p className={styles.scoreText}>
                  ענית נכון על {score}/{total} שאלות
                </p>
              </>
            )}

            {/* Colored squares */}
            {answerResults.length > 0 && (
              <div className={styles.answersIndicator}>
                {answerResults.map((isCorrect, index) => (
                  <div
                    key={index}
                    className={`${styles.answerSquare} ${
                      isCorrect ? styles.correct : styles.wrong
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Button */}
        <div className={styles.buttonWrapper}>
          <ReviewButton onClick={handleNext} />
        </div>
      </div>
    </div>
  );
}
