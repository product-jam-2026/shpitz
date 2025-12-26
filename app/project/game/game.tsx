"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./game.module.css";
import { createClient } from "@/lib/supabase/client";

type ResultState = "none" | "success" | "fail";

type DbMessage = {
  id: number;
  content: string;
  isTrue: boolean;
  tips: string | null;
  Owner: string | null;
};

export default function Challenge() {
  const [step, setStep] = useState(1); // 1..5
  const [result, setResult] = useState<ResultState>("none");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<DbMessage[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        // מביאים 5 הודעות. תעדכני פילטרים אם צריך (difficulty/type)
        const { data, error } = await supabase
          .from("assets")
          .select("id, content, isTrue, tips, Owner")
          .eq("topic", "message")
          .eq("type", "txt")
          .order("id", { ascending: true })
          .limit(5);

        if (error) throw error;

        if (!data || data.length === 0) {
          setQuestions([]);
          setError("לא נמצאו הודעות בטבלה assets עם topic=message ו-type=txt.");
          return;
        }

        setQuestions(data as DbMessage[]);
      } catch (e: any) {
        setError(e?.message ?? "שגיאה בטעינת נתונים");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const current = questions[step - 1];

  const tipText = useMemo(() => {
    return current?.tips ?? "טיפ לא זמין כרגע.";
  }, [current]);

  const handleAnswer = (clickedOpen: boolean) => {
  if (!current) return;

  // isTrue = האם ההודעה אמיתית (True -> לפתוח, False -> לדווח)
  const isCorrect = clickedOpen === current.isTrue;

  setResult(isCorrect ? "success" : "fail");
};



  const handleContinue = () => {
    setResult("none");
    if (step < 5) setStep((s) => s + 1);
  };

  if (loading) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone} dir="rtl">
          <p style={{ textAlign: "center", marginTop: 24 }}>טוען...</p>
        </div>
      </div>
    );
  }

  if (error || !current) {
    return (
      <div className={styles.screen}>
        <div className={styles.phone} dir="rtl">
          <p style={{ textAlign: "center", marginTop: 24 }}>
            {error ?? "אין שאלה להצגה"}
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
            <button className={styles.toolButton} type="button">
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
