"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import SkipButton from "@/lib/components/SkipButton";
import NextButton from "@/lib/components/NextButton";
import SectionHeading from "@/lib/components/SectionHeading";
import { useDailyQuestions } from "@/app/hooks/useDailyQuestions";

export default function MessageOnly() {
    const router = useRouter();
    const { questions, loading } = useDailyQuestions();
    const [currentIndex, setCurrentIndex] = useState(0);

    if (loading) return <p>Loading...</p>;

    if (!questions || questions.length === 0) {
        return <p>No questions available</p>;
    }

    const current = questions[currentIndex];
    const totalQuestions = questions.length;

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Navigate to game when finished
            console.log("Tutorial completed!");
            // router.push('/project/game');
        }
    };

    const handleSkip = () => {
        console.log("Skip clicked!");
        // router.push('/project/game');
    };

    return (
        <div className={styles.container} dir="rtl">
            {/* Section Heading with counter */}
            <div className={styles.progressBar}>
                <div className={styles.progressCounter}>{currentIndex + 1}/{totalQuestions}</div>
                <div className={styles.progressLabel}>לומדים משהו</div>
            </div>

            {/* כרטיס ההודעה */}
            <div className={styles.messageCard}>
                <div className={styles.messageHeader}>
                    <div className={styles.avatarCircle}></div>
                    <p dir="ltr" className="font-bold text-xs">
                        {current.Owner ?? "+972 528886666"}
                    </p>
                </div>
                <div className={styles.messageTimestamp}>היום 9:07</div>
                <div className={styles.messageBubbleContainer}>
                    <div className={styles.messageBubbleText}>
                        <p>{current.content}</p>
                    </div>
                </div>
            </div>

            {/* טקסט רמז */}
            <div className={styles.hintText}>
                {current.tips ?? "אין רמז זמין"}
            </div>

            {/* כפתור דלג */}
            <SkipButton onClick={handleSkip} />

            {/* כפתור הבא */}
            <NextButton onClick={handleNext} />
        </div>
    );
}