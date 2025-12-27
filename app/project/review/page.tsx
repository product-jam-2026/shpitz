"use client";
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import SkipButton from "@/lib/components/SkipButton";
import NextButton from "@/lib/components/NextButton";
import SectionHeading from "@/lib/components/SectionHeading";

export default function MessageOnly() {
    const router = useRouter();

    const handleNext = () => {
        // Add your navigation logic here
        console.log("Next clicked!");
        // Example: router.push('/project/game');
    };

    const handleSkip = () => {
        // Add your skip logic here
        console.log("Skip clicked!");
        // Example: router.push('/project/game');
    };

    return (
        <div className={styles.container} dir="rtl">
            {/* Section Heading */}
            <SectionHeading>לומדים משהו</SectionHeading>

            {/* כרטיס ההודעה */}
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

            {/* טקסט רמז */}
            <div className={styles.hintText}>
                גליצים בתמונה -
הסוודר ואוזן שמאל נראית מרוחה והחיבור בין הצוואר לסוודר גם כן
            </div>

            {/* כפתור דלג */}
            <SkipButton onClick={handleSkip} />

            {/* כפתור הבא */}
            <NextButton onClick={handleNext} />
        </div>
    );
}
