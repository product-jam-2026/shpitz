"use client";
import { useState } from 'react';
import styles from "./expalntionPage.module.css";

const explanationSteps = [
  { // שלב 0 - קליק ראשון
    body: "[לחצו על כל מקום במסך\nלעבור בין חלקי ההסבר]",
    title: "איך משחקים?",
    isTitleStep: true,
    showOverlay: true
  },
  { // שלב 1 - קליק שני
    body: "תוצג לפניכם הודעת טקסט, חשבו האם היא אמיתית או הונאה ולאחר מכן בחרו האם הייתם פותחים את הלינק או מדווחים.",
    isTitleStep: false,
    showOverlay: true
  },
  { // שלב 2 - קליק שלישי (המסך הופך גלוי)
    body: "",
    isTitleStep: false,
    showOverlay: false 
  },
  { // שלב 3 - קליק רביעי (Spotlight לכפתורי הפעולה)
    body: "בחרו האם הייתם פותחים את הלינק או מדווחים לאגודת איגוד האינטרנט",
    isTitleStep: false, 
    showOverlay: true, 
    isActionsStep: true
  }
];

export default function ChallengeBase() {
    const [currentStep, setCurrentStep] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const handleNextStep = () => {
        if (currentStep < explanationSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsFinished(true); 
        }
    };

    const stepData = explanationSteps[currentStep];

    return (
        <div className={styles.container} dir="rtl">
            {/* 1. שורת התקדמות */}
            <div className={styles.progressBar}>
                <div className={`${styles.progressItem} ${styles.progressActive}`}>1</div>
                {[2, 3, 4, 5].map(num => <div key={num} className={styles.progressItem}>{num}</div>)}
            </div>

            {/* 2. כותרת השאלה */}
            <h2 className={styles.questionTitle}>
                האם הייתם פותחים<br />את הלינק?
            </h2>

            {/* 3. כרטיס ההודעה */}
            <div className={styles.messageCard}>
                <div className={styles.messageHeader}>
                    <div className={styles.avatarCircle}></div>
                    <p dir="ltr" className="font-bold text-xs">+972 528886666</p>
                </div>
                <div className={styles.messageTimestamp}>היום 9:07</div>
                <div className={styles.messageBubbleContainer}>
                    <svg width="299" height="233" viewBox="0 0 304 233" fill="none">
                        <path d="M287.157 0C296.265 0 303.648 13.9904 303.648 31.2484V209.03C303.648 226.288 296.265 240.279 287.157 240.279H22.1801C18.4076 240.279 14.9318 237.876 12.1531 233.838C8.96927 242.25 -0.59049 243.028 0.0287365 241.294C5.1016 227.115 5.59976 221.579 5.78779 212.485C5.72195 211.351 5.68844 210.198 5.68844 209.03V31.2484C5.68847 13.9904 13.072 0 22.1801 0H287.157Z" fill="#F3F3F3"/>
                    </svg>
                    <div className={styles.messageBubbleText}>
                        <p>לקוח יקר, עקב תקלה נדרש לעדכן אמצעי התשלום לחשבונך באפליקציית bit כנס לקישור המצורף על מנת לעדכן</p>
                        <a href="#" className="text-blue-600 underline block mt-2">https://tinyurl.com/betti</a>
                    </div>
                </div>
            </div>

            {/* 4. גריד הכפתורים */}
            <div className={styles.actionGrid}>
                <button className={styles.smallToolButton}><span>רמז</span></button>
                <button className={styles.smallToolButton}>? הוראות</button>
                <button className={`${styles.squareButton} ${stepData?.isActionsStep ? styles.highlight : ""}`}>לפתוח</button>
                <button className={`${styles.squareButton} ${stepData?.isActionsStep ? styles.highlight : ""}`}>לדווח</button>
            </div>

            {/* 5. שכבת ההסבר (Overlay) */}
            {!isFinished && stepData.showOverlay && (
                <div className={styles.overlay} onClick={handleNextStep}>
                    <div key={currentStep} className={styles.instructionBoxAnim}>
                        {stepData.isTitleStep ? (
                            <div className={styles.instructionBox}>
                                <h1 className={styles.instructionTitle}>{stepData.title}</h1>
                                <p className={styles.instructionBody}>{stepData.body}</p>
                            </div>
                        ) : stepData.isActionsStep ? (
                            /* שלב 4: תצוגה מיוחדת עם ריבוע הארה, חיצי SVG וטקסט מוטה */
                            <div className={styles.actionsExplanationArea}>
                                <div className={styles.rotatedTextContainer}>
                                    <p className={styles.explanationText}>{stepData.body}</p>
                                </div>
                                <div className={styles.customArrowsContainer}>
                                        <svg 
                                            className={styles.customArrowSvg}
                                            xmlns="http://www.w3.org/2000/svg" 
                                            width="37" height="103" viewBox="0 0 37 103" fill="none"
                                        >
                                            <path d="M26.1152 1C27.628 2.42802 29.7238 6.19258 34.4601 30.2549C36.6132 41.1934 34.4232 53.3117 32.4146 60.9921C30.4729 68.4163 26.2367 73.9719 20.4322 83.2499C16.4635 89.5935 9.11897 94.0871 8.64154 95.084C6.28732 99.9997 21.94 91.1289 32.382 88.8162C34.7606 88.2894 36.1841 87.8586 33.5104 89.2663C15.9782 98.4974 9.1467 100.055 3.47031 101.166C-1.57992 102.155 2.50552 93.3756 3.56269 86.2493C4.47312 82.134 5.46957 77.9504 6.22239 74.2712C6.48442 72.6525 6.50283 71.5382 6.36296 67.7844" 
                                                stroke="#CCFF00" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>

                                </div>
                                {/* ריבוע האפור שיוצר את ה-Spotlight סביב שני הכפתורים */}
                                <div className={styles.highlightSpotlightBox}></div>
                            </div>
                        ) : (
                            <div className={styles.fullTextOverlay}>
                                <p className={styles.explanationText}>{stepData.body}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 6. שכבת לחיצה שקופה (לשלב 2) */}
            {!isFinished && !stepData.showOverlay && (
                <div className={styles.transparentClickLayer} onClick={handleNextStep}></div>
            )}
        </div>
    );
}