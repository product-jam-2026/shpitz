// "use client";
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useState } from 'react';
// import Lottie from 'lottie-react';
// import confettiData from "@/public/animation/confettiAnimation.json";
// import styles from "./expalntionPage.module.css";
// import Image from 'next/image';
// const explanationSteps = [
//     { // שלב 0
//         body: "לחצו על כל מקום במסך\nלעבור בין חלקי ההסבר",
//         title: "איך משחקים?",
//         isTitleStep: true,
//         showOverlay: true
//     },
//     { // שלב 1
//         body: "תוצג לפניכם הודעת טקסט, חשבו האם היא תקינה או חשודה ובחרו את האופציה המתאימה",
//         isTitleStep: false,
//         isIntroStep: true,
//         showOverlay: true
//     },
//     { // שלב 2
//         body: "",
//         isTitleStep: false,
//         showOverlay: false 
//     },
//     { // שלב 3 (קליק רביעי) - Spotlight לכפתורי הפעולה
//         body: "בחרו האם הייתם פותחים את הלינק או מדווחים לאגודת איגוד האינטרנט",
//         isTitleStep: false, 
//         showOverlay: true, 
//         isActionsStep: true
//     },
//     { // שלב 4 (קליק חמישי) - פידבק וקונפטי
//         body: "יתקבל חיווי האם תשובתכם נכונה או לא",
//         isTitleStep: false, 
//         showOverlay: true,
//         isFeedbackStep: true,
//         targetStepNumber: 1
//     },
//     { // שלב 5 (קליק שישי) - סיום ההסבר
//         body:"תוכלו תמיד לקחת רמז אם לא תדעו כיצד להתקדם",
//         showOverlay: true,
//         isHintStep: true
//     },
//     { // שלב 6 - הסבר על הוראות
       
//         body: <>חזרו לעמוד זה והזכרו <br /> כיצד להשתמש</>,
//         showOverlay: true,
//         isInstructionsStep: true

//     },
//     { 
//         body: "הבנתי, בואו נתחיל לשחק!", 
//         showOverlay: true, 
//         isFinalStep: true 
//     }
// ];

// export default function ChallengeBase() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const fromGame = searchParams.get('from') === 'game';
//     const [currentStep, setCurrentStep] = useState(0);
    
//     const [isFinished, setIsFinished] = useState(false);

//     const handleNextStep = () => {
//         if (currentStep < explanationSteps.length - 1) {
//             setCurrentStep(currentStep + 1);
//         } else {
//             if (fromGame) {
//                 router.back();
//             } else {
//             router.push('/startPage'); 
//             }
//         }
//     };

//     const stepData = explanationSteps[currentStep];

//     return (
//         <div className={styles.pageWrapper}>
//             <div className={styles.container} dir="rtl">
//                 {/* 1. שורת התקדמות */}
//             <div className={`${styles.progressBarContainer} ${stepData.isFeedbackStep ? styles.activeHighlightWrapper : ""}`}>
//                 {stepData.isFeedbackStep && <div className={styles.barHighlightBox}></div>}
//                 <div className={styles.progressBar}>
//                     <div className={`
//                         ${styles.progressItem} 
//                         ${stepData.isFeedbackStep ? styles.stepHighlight : styles.progressActive}
//                     `}>1</div>
//                     {[2, 3, 4, 5].map(num => <div key={num} className={styles.progressItem}></div>)}
//                 </div>
//             </div>

//                 {/* 2. כותרת השאלה */}
//                 <h2 className={styles.questionTitle}>מה דעתכם על ההודעה?</h2>

//                 {/* 3. כרטיס ההודעה */}
//                 <div className={styles.messageCard}>
//                     <div className={styles.messageHeader}>
//                         <div className={styles.avatarCircle}></div>
//                         <p dir="ltr" className="font-bold text-xs">+972 528886666</p>
//                     </div>
//                     <div className={styles.messageTimestamp}>היום 9:07</div>
//                     <div className={styles.messageBubbleContainer}>
//                         <svg width="299" height="233" viewBox="0 0 304 233" fill="none">
//                             <path d="M287.157 0C296.265 0 303.648 13.9904 303.648 31.2484V209.03C303.648 226.288 296.265 240.279 287.157 240.279H22.1801C18.4076 240.279 14.9318 237.876 12.1531 233.838C8.96927 242.25 -0.59049 243.028 0.0287365 241.294C5.1016 227.115 5.59976 221.579 5.78779 212.485C5.72195 211.351 5.68844 210.198 5.68844 209.03V31.2484C5.68847 13.9904 13.072 0 22.1801 0H287.157Z" fill="#F3F3F3"/>
//                         </svg>
//                         <div className={styles.messageBubbleText}>
//                             <p>לקוח יקר, עקב תקלה נדרש לעדכן אמצעי התשלום לחשבונך באפליקציית bit כנס לקישור המצורף על מנת לעדכן</p>
//                             <a href="#" className="text-blue-600 underline block mt-2">https://tinyurl.com/betti</a>
//                         </div>
//                     </div>
//                 </div>

//                 {/* 4. גריד הכפתורים - ההדגשה קיימת רק בשלב 3 */}
//                 <div className={styles.actionGrid}>
//                 <button className={`${styles.smallToolButton} ${stepData.isHintStep ? styles.highlightHint : ""}`}>
//                     {/* סדר האלמנטים: האייקון יופיע לפני הטקסט */}
//                     <Image 
//                     src="/icons/sharp.svg" // הוספנו / בתחילת הנתיב כדי לגשת לתיקיית public
//                     alt="hint icon" 
//                     width={40} 
//                     height={40} 
//                     className={styles.buttonIcon}
//                     />
//                     <span>רמז</span> {/* הסרנו את ה-backtick המיותר שהיה כאן */}
//                 </button>

//                 <button className={`${styles.smallToolButton} ${stepData.isInstructionsStep ? styles.highlightHint : ""}`}>
//                     <span>? הוראות</span>
//                 </button>
//                 <button className={`${styles.squareButton} ${styles.squareButtonOpen} ${stepData.isActionsStep && !stepData.isFeedbackStep ? styles.highlight : ""}`}>תקינה</button>
//                 <button className={`${styles.squareButton} ${styles.squareButtonReport} ${stepData.isActionsStep && !stepData.isFeedbackStep ? styles.highlight : ""}`}>חשודה</button>
//                 </div>

//                 {/* 5. שכבת ההסבר (Overlay) */}
//                 {!isFinished && stepData.showOverlay && (
//                     <div className={styles.overlay} onClick={handleNextStep}>
//                         <div className={styles.stepAnimation} key={currentStep}>
                        
//                         {/* קונפטי - מופיע רק בשלב 4 (הפידבק) */}
//                         {stepData.isFeedbackStep}

//                         {/* step 3 */}
//                         {stepData.isActionsStep && (
//                             <>
//                                 {/* <div className={styles.highlightSpotlightBox}></div> */}
//                                 <div className={styles.actionsExplanationArea}>
//                                     {/* <div className={styles.rotatedTextContainer}> */}
//                                         <p className={styles.explanationText}>{explanationSteps[3].body}</p>
//                                     {/* </div> */}
//                                     <div className={styles.customArrowsContainer} style={{bottom: '120px'}}>
//                                         <svg width="51" height="95" viewBox="0 0 51 95" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                             <path d="M47.3561 1.00011C48.514 2.72843 49.7214 6.86441 48.9958 31.3777C48.6659 42.5213 43.8394 53.8506 40.1752 60.8931C36.6333 67.7007 31.2691 72.1768 23.5492 79.9341C18.2708 85.2379 10.1117 87.9883 9.42481 88.8542C6.03771 93.1243 23.2695 87.9512 33.9643 88.0152C36.4006 88.0298 37.8842 87.9258 34.9647 88.7047C15.8202 93.8117 8.81345 93.813 3.03195 93.6363C-2.1118 93.479 3.82141 85.8258 6.43477 79.1122C8.23639 75.3019 10.137 71.444 11.6881 68.0239C12.3031 66.5038 12.5685 65.4215 13.2657 61.7303" stroke="#C7EE26" stroke-width="2" stroke-linecap="round"/>
//                                         </svg>
//                                     </div>
//                                 </div>
//                             </> 

                        
//                         )}

//                         {/* --- שלב 4: אלמנטים חדשים (פידבק ושני חיצים) --- */}
//                         {stepData.isFeedbackStep && (
//                             <div className={styles.stepAnimation}>
//                                 <div className={styles.actionsExplanationArea}>
//                                     {/* <div className={styles.rotatedTextContainer} style={{transform: 'rotate(-6deg)', bottom: '55vh'}}>
//                                         <p className={styles.explanationText}>{stepData.body}</p>
//                                     </div> */}
//                                     <div className={styles.feedbackCombinedContainer}>
//                                     {/* חיצי שלב 5 החדשים */}
//                                     {/* <div className={styles.feedbackArrowsWrapper}> */}
//                                         {/* חץ עליון למספר 1 */}
//                                         <div className={styles.arrowTopAnimated}>
//                                             <Image 
//                                                 src="icons/vectorDownStep4.svg" // שנה לשם הקובץ האמיתי שלך
//                                                 alt="Bottom Arrow"
//                                                 width={32}
//                                                 height={93}
//                                                 className={styles.arrowImage}
//                                             />
//                                         </div>
//                                         <div className={styles.combinedFeedbackText}>
//                                             <p>{stepData.body}</p>
//                                         </div>
//                                         {/* חץ תחתון לכפתור המשך */}
//                                         <div className={styles.arrowBottomAnimated}>
//                                             <Image 
//                                                 src="icons/vectorDownStep4.svg" 
//                                                 alt="Bottom Arrow"
//                                                 width={32}
//                                                 height={93}
//                                                 className={styles.arrowImage}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className={styles.feedbackCard}>
//                                         <div className={styles.lottieContainer}>
//                                             <Lottie 
//                                                     animationData={confettiData} 
//                                                     loop={true} 
//                                                     className={styles.lottieAnimation}
//                                                 />
//                                         </div>
//                                         <p className={styles.feedbackText}>כל הכבוד, עוד כמה סיבובים <br/> ותהיה שפיץ!</p>
//                                         <button className={styles.continueButton}>המשך</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}

//                         {/* --- חדש: שלב 6 בתוך ה-Overlay --- */}
//                     {stepData.isHintStep && (
//                         <div className={styles.stepAnimation}>
//                         <div key="step-6" className={styles.hintExplanationArea}>
                            
//                             <div className={styles.hintExplanationArea}>
//                                 <div >
//                                     <p className={styles.explanationTextStep6}>{stepData.body}</p>
//                                 </div>
//                                 <div className={styles.arrowToHint}>
//                                     <svg width="32" height="94" viewBox="0 0 37 103" fill="none">
//                                         <path d="M26.1152 1C27.628 2.42802 29.7238 6.19258 34.4601 30.2549C36.6132 41.1934 34.4232 53.3117 32.4146 60.9921C30.4729 68.4163 26.2367 73.9719 20.4322 83.2499C16.4635 89.5935 9.11897 94.0871 8.64154 95.084C6.28732 99.9997 21.94 91.1289 32.382 88.8162C34.7606 88.2894 36.1841 87.8586 33.5104 89.2663C15.9782 98.4974 9.1467 100.055 3.47031 101.166C-1.57992 102.155 2.50552 93.3756 3.56269 86.2493C4.47312 82.134 5.46957 77.9504 6.22239 74.2712C6.48442 72.6525 6.50283 71.5382 6.36296 67.7844" 
//                                             stroke="#CCFF00" strokeWidth="2" strokeLinecap="round"/>
//                                     </svg>
//                                 </div>
//                                 <div className={styles.hintHighlightBox}></div>
//                             </div>
//                         </div>
//                     </div>
//                     )}

//             {/* --- שלב 0: כותרת ההסבר --- */}
//             {stepData.isTitleStep && (
//                 <div className={styles.stepAnimation}>
//                     <div className={styles.instructionBox}>
//                         <h1 className={styles.instructionTitle}>{stepData.title}</h1>
//                         <p className={styles.instructionBody}>{stepData.body}</p>
//                     </div>
//                 </div>
//             )}
//             {/* --- שלב 1: טקסט מבוא --- */}
//             {stepData.isIntroStep && (
//             <div className={styles.stepAnimation}>
//                 <p className={styles.explanationTextStep1}>{stepData.body}</p>
//             </div>
//             )}

//             {stepData.isInstructionsStep && (
//                 <div className={styles.stepAnimation}>
//                 <div key="step-7" className={styles.instructionsArea}>
            
//             {/* הטקסט המוטה - נשאר באותו עיצוב וזווית */}
            
//                 <p className={styles.explanationText6}>{stepData.body}</p>
           

//             {/* חץ שמצביע על כפתור ההוראות (צד שמאל) */}
//             <div className={styles.arrowToInstructionsNew}>
//                 <svg width="42" height="99" viewBox="0 0 42 99" fill="none" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M40.6317 1.00014C39.0165 2.01372 36.0965 5.05002 23.5547 26.1241C17.8533 35.7043 14.7718 47.1983 13.2576 54.6026C11.7939 61.7598 12.6664 67.6513 13.2255 77.2459C13.6078 83.806 17.0837 89.3255 17.0403 90.3282C16.8267 95.2728 9.1467 84.1548 2.65029 80.0318C1.16983 79.0926 0.328007 78.425 1.68048 80.2259C10.5491 92.0349 14.7841 94.7728 18.3727 96.881C21.5654 98.7567 22.0313 89.9483 24.0065 83.2335C24.9351 79.2981 25.829 75.2837 26.7024 71.7771C27.1355 70.2477 27.5482 69.2261 29.0813 65.8231" 
//                     stroke="#CCFF00" strokeWidth="2" strokeLinecap="round"/>
//                 </svg>
//             </div>

//                 {/* מלבן הארה סביב כפתור ההוראות בצד שמאל */}
//                 <div className={styles.instructionsHighlightBox}></div>
//             </div>
//         </div>
//         )}
//             {/* --- שלב סופי: תיבה לבנה --- */}
//             {stepData.isFinalStep && (
//                 <div className={styles.stepAnimation}>
//                 <div key="final-step" className={styles.finalBoxContainer}>
//                     <div className={styles.finalInstructionBox}>
//                         <p className={styles.finalText}>{stepData.body}</p>
//                     </div>
//                 </div>
//             </div>
//             )}
//             {/* טקסט חופשי (שלב 1) - הוספנו כאן את החרגת isHintStep כדי שלא יופיע פעמיים */}
//             {!stepData.isTitleStep && !stepData.isActionsStep && !stepData.isFeedbackStep && !stepData.isHintStep && !stepData.isInstructionsStep && !stepData.isFinalStep && stepData.body && !stepData.isIntroStep &&(
//                 <div className={styles.stepAnimation}>
//                     <div className={styles.fullTextOverlay}>
//                         <p className={styles.explanationText}>{stepData.body}</p>
//                     </div>
//                 </div>
//             )}
//         </div>

//     </div>
//     )}

//                 {/* 6. שכבת לחיצה שקופה (לשלב 2) */}
//                 {!isFinished && !stepData.showOverlay && (
//                     <div className={styles.transparentClickLayer} onClick={handleNextStep}></div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Lottie from "lottie-react";
import Image from "next/image";

import confettiData from "@/public/animation/confettiAnimation.json";
import styles from "./expalntionPage.module.css";
import Image from 'next/image';
const explanationSteps = [
    { // שלב 0
        body: "לחצו על כל מקום במסך\nלעבור בין חלקי ההסבר",
        title: "איך משחקים?",
        isTitleStep: true,
        showOverlay: true
    },
    { // שלב 1
        body: "תוצג לפניכם הודעת טקסט, חשבו האם היא תקינה או חשודה ובחרו את האופציה המתאימה",
        isTitleStep: false,
        isIntroStep: true,
        showOverlay: true
    },
    { // שלב 2
        body: "",
        isTitleStep: false,
        showOverlay: false 
    },
    { // שלב 3 (קליק רביעי) - Spotlight לכפתורי הפעולה
        body: "בחרו האם הייתם פותחים את הלינק או מדווחים לאגודת איגוד האינטרנט",
        isTitleStep: false, 
        showOverlay: true, 
        isActionsStep: true
    },
    { // שלב 4 (קליק חמישי) - פידבק וקונפטי
        body: "יתקבל חיווי האם תשובתכם נכונה או לא",
        isTitleStep: false, 
        showOverlay: true,
        isFeedbackStep: true,
        targetStepNumber: 1
    },
    { // שלב 5 (קליק שישי) - סיום ההסבר
        body:"תוכלו תמיד לקחת רמז אם לא תדעו כיצד להתקדם",
        showOverlay: true,
        isHintStep: true
    },
    { // שלב 6 - הסבר על הוראות
       
        body: <>חזרו לעמוד זה והזכרו <br /> כיצד להשתמש</>,
        showOverlay: true,
        isInstructionsStep: true

    },
    { 
        body: "הבנתי, בואו נתחיל לשחק!", 
        showOverlay: true, 
        isFinalStep: true 
    }
];

export default function ChallengeBase() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromGame = searchParams.get("from") === "game";

  const [currentStep, setCurrentStep] = useState(0);
  const stepData = explanationSteps[currentStep];

  // Which progress square should be highlighted (default 1)
  const activeProgress = useMemo(() => stepData.targetStepNumber ?? 1, [stepData.targetStepNumber]);

  const handleNextStep = () => {
    if (currentStep < explanationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Finish: if we came from the game, go back. otherwise go to startPage
    if (fromGame) router.back();
    else router.push("/startPage");
  };

  // Static demo message (the explanation page is a “guided demo”)
  const demoOwner = "+972 528886666";
  const demoText =
    "לקוח יקר, עקב תקלה נדרש לעדכן אמצעי התשלום לחשבונך באפליקציית bit כנס לקישור המצורף על מנת לעדכן";
  const demoLink = "https://tinyurl.com/betti";

  return (
    <div className={gameStyles.screen}>
      <div className={gameStyles.phone} dir="rtl">
        {/* Scroll area like the real game */}
        <div className={gameStyles.scrollableArea}>
          {/* Progress bar like the real game */}
          <div className={gameStyles.progressBar}>
            {[1, 2, 3, 4, 5].map(n => {
              let cl = gameStyles.progressItem;

              // In explanation mode we highlight based on the current tutorial step
              if (n === activeProgress) cl += ` ${gameStyles.progressActive}`;

              return (
                <div key={n} className={cl}>
                  {n}
                </div>
              );
            })}
          </div>

          <h2 className={gameStyles.questionTitle}>מה דעתכם על ההודעה?</h2>

          {/* Message card like the real game */}
          <div className={gameStyles.messageCardWrap}>
            <div className={gameStyles.messageCard}>
              <div className={gameStyles.messageHeader}>
                <img
                  src="/icons/messageIcon.svg"
                  alt="Message Icon"
                  className={gameStyles.headerIcon}
                />
                <p dir="ltr" className={gameStyles.ownerText}>
                  {demoOwner}
                </p>
              </div>

              <div className={gameStyles.messageTimestamp}>היום 9:07</div>

              <div className={gameStyles.messageBubble}>
                <p className={gameStyles.messageText}>{demoText}</p>
                <a
                  href="#"
                  onClick={e => e.preventDefault()}
                  style={{ display: "block", marginTop: 10, textDecoration: "underline" }}
                >
                  {demoLink}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom actions like the real game (buttons are “demo-only”) */}
        <div className={gameStyles.actions}>
          <div className={gameStyles.toolsRow}>
            <button
              className={`${gameStyles.toolButton} ${stepData.isHintStep ? styles.highlightHint : ""}`}
              type="button"
              onClick={e => e.preventDefault()}
            >
              <img src="/icons/sharp.svg" alt="Hint Icon" style={{ width: 35, height: 35 }} />
              <span>רמז</span>
            </button>

            <button
              className={`${gameStyles.toolButton} ${stepData.isInstructionsStep ? styles.highlightHint : ""}`}
              type="button"
              onClick={e => e.preventDefault()}
            >
              ? הוראות
            </button>
          </div>

          <div className={gameStyles.mainRow}>
            <button
              className={`${gameStyles.reportBtn} ${
                stepData.isActionsStep && !stepData.isFeedbackStep ? styles.highlight : ""
              }`}
              type="button"
              onClick={e => e.preventDefault()}
            >
              תקינה
            </button>

            <button
              className={`${gameStyles.openBtn} ${
                stepData.isActionsStep && !stepData.isFeedbackStep ? styles.highlight : ""
              }`}
              type="button"
              onClick={e => e.preventDefault()}
            >
              חשודה
            </button>
          </div>
        </div>

        {/* Feedback “result card” demo (in the real game this is result overlay) */}
        {stepData.isFeedbackStep && (
          <div className={styles.feedbackOverlayBlock}>
            <div className={styles.feedbackCard}>
              <div className={styles.lottieContainer}>
                <Lottie animationData={confettiData} loop={true} className={styles.lottieAnimation} />
              </div>
              <p className={styles.feedbackText}>
                כל הכבוד, עוד כמה סיבובים <br /> ותהיה שפיץ!
              </p>
              <button className={styles.continueButton} type="button">
                המשך
              </button>
            </div>
          </div>
        )}

        {/* Main tutorial overlay (click anywhere to continue) */}
        {stepData.showOverlay && (
          <div  className={`${styles.overlay} ${stepData.isIntroStep ? styles.overlayMessageSpotlight : ""}`}
            onClick={handleNextStep}
          >
            <div className={styles.stepAnimation} key={currentStep}>
              {/* Title step */}
              {stepData.isTitleStep && (
                <div className={styles.instructionBox}>
                  <h1 className={styles.instructionTitle}>{stepData.title}</h1>
                  <p className={styles.instructionBody}>{String(stepData.body)}</p>
                </div>
              )}

              {/* Intro step */}
              {stepData.isIntroStep && (
                <p className={styles.explanationTextStep1}>{stepData.body}</p>
              )}

              {/* Actions step (spotlight + text + arrow) */}
              {stepData.isActionsStep && (
                <div className={styles.actionsExplanationArea}>
                  <p className={styles.explanationText}>{stepData.body}</p>

                  {/* Keep your arrow SVG (unchanged idea) */}
                  <div className={styles.customArrowsContainer} style={{ bottom: "120px" }}>
                    <svg width="51" height="95" viewBox="0 0 51 95" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M47.3561 1.00011C48.514 2.72843 49.7214 6.86441 48.9958 31.3777C48.6659 42.5213 43.8394 53.8506 40.1752 60.8931C36.6333 67.7007 31.2691 72.1768 23.5492 79.9341C18.2708 85.2379 10.1117 87.9883 9.42481 88.8542C6.03771 93.1243 23.2695 87.9512 33.9643 88.0152C36.4006 88.0298 37.8842 87.9258 34.9647 88.7047C15.8202 93.8117 8.81345 93.813 3.03195 93.6363C-2.1118 93.479 3.82141 85.8258 6.43477 79.1122C8.23639 75.3019 10.137 71.444 11.6881 68.0239C12.3031 66.5038 12.5685 65.4215 13.2657 61.7303"
                        stroke="#C7EE26"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Feedback step: text + arrows (your idea preserved) */}
              {stepData.isFeedbackStep && (
                <div className={styles.feedbackCombinedContainer}>
                  <div className={styles.arrowTopAnimated}>
                    <Image
                      src="/icons/vectorDownStep4.svg"
                      alt="Arrow"
                      width={32}
                      height={93}
                      className={styles.arrowImage}
                    />
                  </div>

                  <div className={styles.combinedFeedbackText}>
                    <p>{stepData.body}</p>
                  </div>

                  <div className={styles.arrowBottomAnimated}>
                    <Image
                      src="/icons/vectorDownStep4.svg"
                      alt="Arrow"
                      width={32}
                      height={93}
                      className={styles.arrowImage}
                    />
                  </div>
                </div>
              )}

              {/* Hint step */}
              {stepData.isHintStep && (
                <div className={styles.hintExplanationArea}>
                  <p className={styles.explanationTextStep6}>{stepData.body}</p>
                  <div className={styles.arrowToHint}>
                    <svg width="32" height="94" viewBox="0 0 37 103" fill="none">
                      <path
                        d="M26.1152 1C27.628 2.42802 29.7238 6.19258 34.4601 30.2549C36.6132 41.1934 34.4232 53.3117 32.4146 60.9921C30.4729 68.4163 26.2367 73.9719 20.4322 83.2499C16.4635 89.5935 9.11897 94.0871 8.64154 95.084C6.28732 99.9997 21.94 91.1289 32.382 88.8162C34.7606 88.2894 36.1841 87.8586 33.5104 89.2663C15.9782 98.4974 9.1467 100.055 3.47031 101.166C-1.57992 102.155 2.50552 93.3756 3.56269 86.2493C4.47312 82.134 5.46957 77.9504 6.22239 74.2712C6.48442 72.6525 6.50283 71.5382 6.36296 67.7844"
                        stroke="#CCFF00"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.hintHighlightBox}></div>
                </div>
              )}

              {/* Instructions step */}
              {stepData.isInstructionsStep && (
                <div className={styles.instructionsArea}>
                  <p className={styles.explanationText6}>{stepData.body}</p>
                  <div className={styles.arrowToInstructionsNew}>
                    <svg width="42" height="99" viewBox="0 0 42 99" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M40.6317 1.00014C39.0165 2.01372 36.0965 5.05002 23.5547 26.1241C17.8533 35.7043 14.7718 47.1983 13.2576 54.6026C11.7939 61.7598 12.6664 67.6513 13.2255 77.2459C13.6078 83.806 17.0837 89.3255 17.0403 90.3282C16.8267 95.2728 9.1467 84.1548 2.65029 80.0318C1.16983 79.0926 0.328007 78.425 1.68048 80.2259C10.5491 92.0349 14.7841 94.7728 18.3727 96.881C21.5654 98.7567 22.0313 89.9483 24.0065 83.2335C24.9351 79.2981 25.829 75.2837 26.7024 71.7771C27.1355 70.2477 27.5482 69.2261 29.0813 65.8231"
                        stroke="#CCFF00"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className={styles.instructionsHighlightBox}></div>
                </div>
              )}

              {/* Final step */}
              {stepData.isFinalStep && (
                <div className={styles.finalBoxContainer}>
                  <div className={styles.finalInstructionBox}>
                    <p className={styles.finalText}>{stepData.body}</p>
                  </div>
                </div>
              )}

              {/* Generic free-text step (if you add more later) */}
              {!stepData.isTitleStep &&
                !stepData.isIntroStep &&
                !stepData.isActionsStep &&
                !stepData.isFeedbackStep &&
                !stepData.isHintStep &&
                !stepData.isInstructionsStep &&
                !stepData.isFinalStep &&
                stepData.body && (
                  <div className={styles.fullTextOverlay}>
                    <p className={styles.explanationText}>{stepData.body}</p>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Transparent click layer for step 2 */}
        {!stepData.showOverlay && (
          <div className={styles.transparentClickLayer} onClick={handleNextStep} />
        )}
      </div>
    </div>
  );
}
