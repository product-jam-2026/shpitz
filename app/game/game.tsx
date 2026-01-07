"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./game.module.css";
import Lottie from "lottie-react"
import ConfettiEffect from "../ConfettiEffect"; 

import confettiAnimation from "@/public/animation/confettiAnimation.json";
type ResultState = "none" | "success" | "fail";
type DailyAnswer = {
  index: number;
  isCorrect: boolean;
  tip: string;
  questionData?: any;
};

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function dailyAnswersKey() {
  return `dailyAnswers_${getTodayKey()}`;
}

function loadDailyAnswers(): DailyAnswer[] {
  const arr: DailyAnswer[] = JSON.parse(localStorage.getItem(dailyAnswersKey()) || "[]");
  return arr.sort((a, b) => a.index - b.index);
}

function upsertDailyAnswer(answer: DailyAnswer) {
  const arr = loadDailyAnswers();
  const filtered = arr.filter(a => a.index !== answer.index);
  filtered.push(answer);
  filtered.sort((a, b) => a.index - b.index);
  localStorage.setItem(dailyAnswersKey(), JSON.stringify(filtered));
}

export default function Challenge() {
  const router = useRouter();
  
  // Load questions from localStorage instead of hook
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedQuestions = localStorage.getItem('dailyQuestions');
    if (savedQuestions) {
      try {
        setQuestions(JSON.parse(savedQuestions));
        setLoading(false);
      } catch (err) {
        setError('שגיאה בטעינת השאלות');
        setLoading(false);
      }
    } else {
      setError('לא נמצאו שאלות');
      setLoading(false);
    }
  }, []);

  const [step, setStep] = useState(1); 
  const [result, setResult] = useState<ResultState>("none");
  const [correctAnswers, setCorrectAnswers] = useState(0); 
  const [answersHistory, setAnswersHistory] = useState<Record<number, ResultState>>({});
  const [showHint, setShowHint] = useState(false);

  const current = questions ? questions[step - 1] : undefined;
  const tipText = useMemo(() => current?.tips ?? "טיפ לא זמין כרגע.", [current]);
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowHint(false);
      setIsClosing(false);
    }, 500);
  };
  
  const handleAnswer = (clickedOpen: boolean) => {
    if (!current) return;
    const isCorrect = clickedOpen === current.isTrue;

    // Audio feedback
    const audioPath = isCorrect 
      ? "/sounds/success.mp3" 
      : "/sounds/fail.mp3";
    
    const audio = new Audio(audioPath);
    audio.play().catch(err => console.error("Audio play failed:", err));

    const currentResult: ResultState = isCorrect ? "success" : "fail";
    setResult(currentResult);
    setAnswersHistory(prev => ({ ...prev, [step]: currentResult }));
    if (isCorrect) setCorrectAnswers(prev => prev + 1);

    upsertDailyAnswer({
      index: step - 1,
      isCorrect,
      tip: current.tips ?? "",
      questionData: current,
    });
  };

  const handleContinue = () => {
    setResult("none");
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      const todayKey = getTodayKey();
      localStorage.setItem("dailyCompletedDate", todayKey);

      const daily = loadDailyAnswers();
      const score = daily.filter(a => a.isCorrect).length;

      const wrongAnswers = daily
        .filter(a => !a.isCorrect)
        .map(a => a.questionData)
        .filter(q => q !== undefined && q !== null);

      const dailyTip = daily.length > 0 ? (daily[0].tip || "") : "";

      localStorage.setItem("dailyResults", JSON.stringify({
        score,
        total: 5,
        answersHistory,
        squares: daily.map(a => (a.isCorrect ? "🟩" : "🟥")).join(""),
        dailyTip,
        wrongAnswers,
      }));

      localStorage.setItem("gameScore", score.toString());
      localStorage.setItem("totalQuestions", "5");

      router.push("/pre_review");
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
      <div className={styles.phone} dir="rtl">
        {result === "success" && (
          <div className={styles.lottieOverlay}>
            <Lottie 
              animationData={confettiAnimation} 
              loop={false} 
              style={{ width: '100%', height: '100%', position: 'absolute', pointerEvents: 'none' }}
            />
          </div>
        )}
        <div className={styles.scrollableArea}>
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

        {result !== "none" && (
          <div className={styles.overlay}>
            <div className={`${styles.resultCard} ${result === "success" ? styles.successCard : styles.failCard}`}>
              {result === "success" ? (
                <div className={styles.successHeader}>תשובה נכונה <br />חד ומדויק! עוד קצת ואתם שפיץ<br /> </div>
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