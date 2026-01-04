"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./game.module.css";
import Lottie from "lottie-react"
import { useDailyQuestions } from "@/app/hooks/useDailyQuestions";
import ConfettiEffect from "../ConfettiEffect"; 

import confettiAnimation from "@/public/animation/confettiAnimation.json";
type ResultState = "none" | "success" | "fail";

export default function Challenge() {
  const router = useRouter();
  const { questions, loading, error } = useDailyQuestions();

  const [step, setStep] = useState(1); 
  const [result, setResult] = useState<ResultState>("none");
  const [correctAnswers, setCorrectAnswers] = useState(0); 
  const [answersHistory, setAnswersHistory] = useState<Record<number, ResultState>>({});
  const [showHint, setShowHint] = useState(false);

  const current = questions ? questions[step - 1] : undefined;
  const tipText = useMemo(() => current?.tips ?? "טיפ לא זמין כרגע.", [current]);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // מפעיל את אנימציית הירידה
    setTimeout(() => {
      setShowHint(false); // מסיר את הרכיב מהמסך אחרי שהאנימציה מסתיימת
      setIsClosing(false); // מאפס את המצב לפעם הבאה
    }, 500); // הזמן כאן חייב להיות תואם לזמן האנימציה ב-CSS
  };
  const handleAnswer = (clickedOpen: boolean) => {
    if (!current) return;
    const isCorrect = clickedOpen === current.isTrue;
    const currentResult: ResultState = isCorrect ? "success" : "fail";
    setResult(currentResult);
    setAnswersHistory(prev => ({ ...prev, [step]: currentResult }));
    if (isCorrect) setCorrectAnswers(prev => prev + 1);
  };

  const handleContinue = () => {
    setResult("none");
    if (step < 5) setStep((s) => s + 1);
    else {
      const todayKey = new Date().toISOString().slice(0, 10);
      localStorage.setItem("dailyCompletedDate", todayKey);
       localStorage.setItem("dailyResults", JSON.stringify({
         score: correctAnswers,
         total: 5,
          answersHistory,
      }));
      localStorage.setItem('gameScore', correctAnswers.toString());
      localStorage.setItem('totalQuestions', '5');
      router.push('/pre_review');
    }
  };

  if (loading || error || !current) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone} dir="rtl">
          <p style={{ textAlign: "center", marginTop: 24 }}>{error ?? "טוען..."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      {result === "success" && (
      <div className={styles.lottieOverlay}>
          <Lottie 
            animationData={confettiAnimation} 
            loop={false} 
            style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none' }}
          />
        </div>
      )
      }

      <div className={styles.phone} dir="rtl">
        <div className={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((n) => {
            const isCurrent = n === step;
            const isCorrect = answersHistory[n] === "success";
            const isWrong = answersHistory[n] === "fail";
            const isAnswered = isCorrect || isWrong;
            let cl = styles.progressItem;
            if (isCurrent ) cl += ` ${styles.progressActive}`;
            else if (isWrong) cl += ` ${styles.progressFail}`;
            else if (isCorrect) cl += ` ${styles.progressSuccess}`;
            return <div key={n} className={cl}>
            {(isCurrent || isAnswered) ? n : ""}
            </div>;
          })}
        </div>

        <h2 className={styles.questionTitle}>מה דעתכם על ההודעה?</h2>

        <div className={styles.messageCard}>
          <div className={styles.messageHeader}>
            <img 
                src="icons/messageIcon.svg" 
                alt="Message Icon" 
                className={styles.headerIcon} 
              />
            <p dir="ltr" className={styles.ownerText}>{current.Owner}</p>
          </div>
          <div className={styles.messageTimestamp}>היום 9:07</div>
          <div className={styles.messageBubble}>
            <p className={styles.messageText}>{current.content}</p>
          </div>
        </div>

        <div className={styles.actions}>
          <div className={styles.toolsRow}>
            <button className={styles.toolButton} onClick={() => setShowHint(true)}>
              
              <img 
                  src="/icons/sharp.svg" 
                  alt="Hint Icon" 
                  style={{ width: '35px', height: '35px' }} 
                />
              <span>רמז</span>
              </button>
            <button className={styles.toolButton} onClick={() => router.push('/explantion?from=game')}>? הוראות</button>
          </div>
          <div className={styles.mainRow}>
            <button className={styles.reportBtn} onClick={() => handleAnswer(true)}>תקינה</button>
            <button className={styles.openBtn} onClick={() => handleAnswer(false)}>חשודה</button>
          </div>
        </div>

        {/* פופ-אפ רמז צף */}
        {showHint && (
         <div className={styles.hintOverlay} onClick={handleClose}>
            <div 
              className={`${styles.hintCard} ${isClosing ? styles.slideDown : ''}`} 
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.hintContent}>
                <div className={styles.hintIconContainer}>
                   <img src="/icons/hint.svg" alt="רמז" className={styles.hintIcon} />
                </div>
                <p className={styles.hintText}>
                  {current.hint || "אין רמז זמין לשאלה זו."}
                </p>
              </div>
              <button className={styles.backToGameBtn} onClick={handleClose}>
              חזרה למשחק
            </button>
            </div>
          </div>
        )}

        {/* פופ-אפ תוצאה (Bottom Sheet) */}
        {result !== "none" && (
          <div className={styles.overlay}>
            <div className={`${styles.resultCard} ${result === "success" ? styles.successCard : styles.failCard}`}>
              {result === "success" ? (
                <div className={styles.successHeader}>תשובה נכונה. <br />כל הכבוד, עוד כמה סיבובים<br />ותהיה שפיץ!</div>
              ) : (
                <div className={styles.failContainer}>
                  <div className={styles.failTitle}>תשובה לא נכונה</div>
                  <div className={styles.tipWrapper}>
                    <img src="icons/sharpWringAnswerSvg.svg" alt="tip" className={styles.tipIcon} />
                  <div className={styles.tipTextStyle}>{tipText}</div>
                </div>
                </div>
              )}
              <button className={styles.continueBtn} onClick={handleContinue}>המשך</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}