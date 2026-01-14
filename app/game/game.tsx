"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./game.module.css";
import Lottie from "lottie-react";
import ConfettiEffect from "../ConfettiEffect";

import confettiAnimation from "@/public/animation/confettiAnimation.json";
import successAnimation from "@/public/animation/success.json";

// ✅ NEW: transition helpers
import { SwitchTransition, CSSTransition } from "react-transition-group";
console.log("SwitchTransition:", SwitchTransition);
console.log("CSSTransition:", CSSTransition);
console.log("Lottie:", Lottie);

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

// מערך המשפטים החדש לפי הוראות הפיגמה
const successMessages = [
  "יפה, החושים מתחדדים!",
  "זיהוי כזה? עליתם על המסלול להיות חדים כמו שפיץ!",
  "חד ומדויק, עוד קצת ואתם שפיץ!",
  "וואו כמה שזה היה חד, הדרך לשפיץ מתקרבת!",
  "מצוין! ככה נראית שפיציות!"
];

export default function Challenge() {
  const router = useRouter();

  // Load questions from localStorage instead of hook
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMessageMode, setIsMessageMode] = useState(true);

  useEffect(() => {
    document.body.style.height = '100vh';
    document.body.style.overflow = 'hidden';
    const savedQuestions = localStorage.getItem("dailyQuestions");
    const savedMode = localStorage.getItem("dailyQuestionMode");
    if (savedQuestions) {
      try {
        setQuestions(JSON.parse(savedQuestions));
        setIsMessageMode(savedMode === "messages");
        setLoading(false);
      } catch (err) {
        setError("שגיאה בטעינת השאלות");
        setLoading(false);
      }
    } else {
      setError("לא נמצאו שאלות");
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

  // ✅ keep actions animation as-is
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [actionsDown, setActionsDown] = useState(false);

  // ✅ NEW: delay success animation
  const [showSuccessLottie, setShowSuccessLottie] = useState(false);

  // ✅ NEW: progress fill animation trigger
  const [progressAnimStep, setProgressAnimStep] = useState<number | null>(null);

  useEffect(() => {
    if (result === "success") {
      const t = setTimeout(() => setShowSuccessLottie(true), 500);
      return () => clearTimeout(t);
    } else {
      setShowSuccessLottie(false);
    }
  }, [result]);

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
    const audioPath = isCorrect ? "/sounds/success.mp3" : "/sounds/fail.mp3";

    const audio = new Audio(audioPath);
    audio.play().catch(err => console.error("Audio play failed:", err));
    if (!isCorrect) {
      if (typeof window !== "undefined" && window.navigator.vibrate) {
        window.navigator.vibrate(200); // 200ms של רטט
      }
    }

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
    if (isTransitioning) return;

    // Last step - keep original behavior
    if (step >= 5) {
      setResult("none");
      const todayKey = getTodayKey();
      localStorage.setItem("dailyCompletedDate", todayKey);

      const daily = loadDailyAnswers();
      const score = daily.filter(a => a.isCorrect).length;

      const wrongAnswers = daily
        .filter(a => !a.isCorrect)
        .map(a => a.questionData)
        .filter(q => q !== undefined && q !== null);

      const dailyTip = daily.length > 0 ? (daily[0].tip || "") : "";

      localStorage.setItem(
        "dailyResults",
        JSON.stringify({
          score,
          total: 5,
          answersHistory,
          squares: daily.map(a => (a.isCorrect ? "🟩" : "🟥")).join(""),
          dailyTip,
          wrongAnswers,
        })
      );

      localStorage.setItem("gameScore", score.toString());
      localStorage.setItem("totalQuestions", "5");

      router.push("/pre_review");
      return;
    }

    const target = step + 1;

// keep bar animation
setIsTransitioning(true);
setActionsDown(true);

// close the bottom sheet first, then change step (this triggers the slide animation)
setTimeout(() => {
  setResult("none");

  // ✅ start fill EXACTLY when message starts sliding (when step changes)
  setProgressAnimStep(step);
  setTimeout(() => setProgressAnimStep(null), 800);

  setStep(target);
  setActionsDown(false);
  setIsTransitioning(false);
}, 50);

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
        {result === "success" && showSuccessLottie && (
          <div className={styles.lottieOverlay}>
            <Lottie
              animationData={successAnimation}
              loop={false}
              style={{ width: "100%", height: "100%", position: "absolute", pointerEvents: "none" }}
            />
          </div>
        )}
        <div className={styles.scrollableArea}>
          <div className={styles.progressBar}>
            {[1, 2, 3, 4, 5].map(n => {
              const isCurrent = n === step;
              const isCorrect = answersHistory[n] === "success";
              const isWrong = answersHistory[n] === "fail";
              let cl = styles.progressItem;
              if (isCurrent) cl += ` ${styles.progressActive}`;
              else if (isWrong) cl += ` ${styles.progressFail}`;
              else if (isCorrect) cl += ` ${styles.progressSuccess}`;

              // ✅ NEW: add fill animation class
              if (progressAnimStep === n) cl += ` ${styles.progressFillAnim}`;

              return (
                <div key={n} className={cl}>
                  {n}
                </div>
              );
            })}
          </div>

          <h2 className={styles.questionTitle}>מה דעתכם על ההודעה?</h2>

          {/* ✅ REPLACED: message swap animation */}
          <SwitchTransition>
            <CSSTransition
              key={step}
              timeout={600}
              classNames={{
                enter: styles.msgEnter,
                enterActive: styles.msgEnterActive,
                exit: styles.msgExit,
                exitActive: styles.msgExitActive,
              }}
            >
              <div className={styles.messageCardWrap}>
                {isMessageMode ? (
                  <div className={styles.messageCard}>
                    <div className={styles.messageHeader}>
                      <img src="icons/messageIcon.svg" alt="Message Icon" className={styles.headerIcon} />
                      <p dir="ltr" className={styles.ownerText}>
                        {current.Owner}
                      </p>
                    </div>
                    <div className={styles.messageTimestamp}>היום 9:07</div>
                    <div className={styles.messageBubble}>
                      <p className={styles.messageText}>{current.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className={styles.photoCard}>
                    <img
                      src={current.picture}
                      alt="Question"
                      className={styles.photoImage}
                    />
                  </div>
                )}
              </div>
            </CSSTransition>
          </SwitchTransition>
        </div>

        {/* ✅ CHANGED earlier: actions gets animation classes */}
        <div className={`${styles.actions} ${styles.actionsAnimating} ${actionsDown ? styles.actionsDown : ""}`}>
          <div className={styles.toolsRow}>
            <button className={styles.toolButton} onClick={() => setShowHint(true)}>
              <img src="/icons/hintIcon.svg" alt="Hint Icon" style={{ width: "35px", height: "35px" }} />
              <span>רמז</span>
            </button>
            <button className={styles.toolButton} onClick={() => router.push("/explantion?from=game")}>
              ? הוראות
            </button>
          </div>
          <div className={styles.mainRow}>
            <button className={styles.reportBtn} onClick={() => handleAnswer(true)}>
              אמיתית
            </button>
            <button className={styles.openBtn} onClick={() => handleAnswer(false)}>
              הונאה
            </button>
          </div>
        </div>

        {showHint && (
          <div className={styles.hintOverlay} onClick={handleClose}>
            <div
              className={`${styles.hintCard} ${isClosing ? styles.slideDown : ""}`}
              onClick={e => e.stopPropagation()}
            >
              <div className={styles.hintContent}>
                <div className={styles.hintIconContainer}>
                  <img src="/icons/hintIcon.svg" alt="רמז" className={styles.hintIcon} />
                </div>
                <p className={styles.hintText}>{current.hint || "אין רמז זמין לשאלה זו."}</p>
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
                <div className={styles.successHeader}>
                  <span className={styles.resultStatusTitle}>תשובה נכונה</span>
                  <p className={styles.resultFeedbackText}>
                    {successMessages[correctAnswers - 1] || successMessages[0]}
                  </p>
                </div>
              ) : (
                <div className={styles.failContainer}>
                  <span className={styles.resultStatusTitle}>תשובה לא נכונה</span>
                  <div className={styles.tipWrapper}>
                    <img src="/icons/hintNew.svg" alt="tip" className={styles.tipIcon} />
                    <div className={styles.tipTextStyle}>{tipText}</div>
                  </div>
                </div>
              )}
              <button className={styles.continueBtn} onClick={handleContinue}>
                המשך
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
