"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./game.module.css";
import { useDailyQuestions } from "@/app/hooks/useDailyQuestions";

type ResultState = "none" | "success" | "fail";

type DbMessage = {
  id: number;
  content: string;
  isTrue: boolean;
  tips: string | null;
  Owner: string | null;
  hint: string | null;
};

export default function Challenge() {
  const router = useRouter();
  const { questions, loading, error } = useDailyQuestions();

  const [step, setStep] = useState(1); // 1..5
  const [result, setResult] = useState<ResultState>("none");
  const [correctAnswers, setCorrectAnswers] = useState(0); // Track correct answers

  const [showHint, setShowHint] = useState(false);
  const current = questions ? questions[step - 1] : undefined;

  const tipText = useMemo(() => {
    return current?.tips ?? "טיפ לא זמין כרגע.";
  }, [current]);

  const handleAnswer = (clickedOpen: boolean) => {
    if (!current) return;

    const isCorrect = clickedOpen === current.isTrue;

    setResult(isCorrect ? "success" : "fail");
    
    // Increment correct answers counter
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
  };
  const handleShowHint = () => {
  setShowHint(true);
  };
  const handleCloseHint = () => {
  setShowHint(false);
  };
  const handleContinue = () => {
    setResult("none");
    if (step < 5) {
      setStep((s) => s + 1);
    } else {
      // Save score to localStorage before navigating
      localStorage.setItem('gameScore', correctAnswers.toString());
      localStorage.setItem('totalQuestions', '5');
      
      // Navigate to pre_review page when finished
      router.push('/pre_review');
    }
  };

  // תצוגת טעינה
  if (loading) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone} dir="rtl">
          <p style={{ textAlign: "center", marginTop: 24 }}>טוען...</p>
        </div>
      </div>
    );
  }

  // תצוגת שגיאה או אם אין שאלות
  if (error || !current) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone} dir="rtl">
          <p style={{ textAlign: "center", marginTop: 24 }}>
            {error ?? "אין שאלה להצגה (המאגר ריק או שהשליפה נכשלה)"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.screen}>
      <div className={styles.phone} dir="rtl">
        {/* פס התקדמות */}
        <div className={styles.progressBar}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`${styles.progressItem} ${
                n === step ? styles.progressActive : ""
              }`}
            >
              {n}
            </div>
          ))}
        </div>

        {/* כותרת */}
        <h2 className={styles.questionTitle}>
          האם הייתם פותחים
          <br />
          את הלינק?
        </h2>

        {/* כרטיס הודעה */}
        <div className={styles.messageCard}>
          <div className={styles.messageHeader}>
            <div className={styles.avatarCircle} />
            <p dir="ltr" className={styles.senderNumber}>
              {current.Owner ?? "+972"}
            </p>
          </div>

          <div className={styles.messageTimestamp}>היום 9:07</div>

          <div className={styles.messageBubble}>
            <p className={styles.messageText}>{current.content}</p>
          </div>
        </div>

        {/* כפתורים תחתונים */}
        <div className={styles.actions}>
          <div className={styles.toolsRow}>
            <button className={styles.toolButton} type="button" onClick={handleShowHint}>
              <span>רמז</span>
            </button>
            <button className={styles.toolButton} type="button">
              ? הוראות
            </button>
          </div>

          <div className={styles.mainRow}>
            <button
              className={styles.reportBtn}
              type="button"
              onClick={() => handleAnswer(false)}
            >
              לדווח
            </button>
            <button
              className={styles.openBtn}
              type="button"
              onClick={() => handleAnswer(true)}
            >
              לפתוח
            </button>
          </div>
        </div>
        {showHint && (
          <div className={styles.hintOverlay} onClick={handleCloseHint}>
            <div className={styles.hintCard} onClick={(e) => e.stopPropagation()}>
              <div className={styles.hintIcon}>
                {/* כאן תבוא התמונה של האייקון מהעיצוב */}
                <img
                    src="/icons/hint.svg"
                    alt="רמז"
                    className={styles.hintIcon}
                  />
              </div>
              <p className={styles.hintText}>
                {current.hint || "אין רמז זמין לשאלה זו."}
              </p>
              <button className={styles.backToGameBtn} onClick={handleCloseHint}>
                חזרה למשחק
              </button>
            </div>
          </div>
        )}
        {/* Overlay תוצאה */}
        {result !== "none" && (
          <div className={styles.overlay} role="dialog" aria-modal="true">
            <div
              className={`${styles.resultCard} ${
                result === "success" ? styles.successCard : styles.failCard
              }`}
            >
              {result === "success" ? (
                <div className={styles.successHeader}>
                  כל הכבוד! עניתם נכון
                  <br />
                  ותהיו שפיץ!
                </div>
              ) : (
                <>
                  <div className={styles.failTitle}>תשובה לא נכונה</div>
                  <div className={styles.failTipRow}>
                    <div className={styles.warnIcon} aria-hidden="true">
                      ⚠
                    </div>
                    <div className={styles.failTipText}>{tipText}</div>
                  </div>
                </>
              )}

              <button
                className={styles.continueBtn}
                type="button"
                onClick={handleContinue}
              >
                המשך
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}