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
    const isLastQuestion = currentIndex === totalQuestions - 1;

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            // Navigate to finish page when at last question
            router.push('/finish');
        }
    };

    const handleSkip = () => {
        // Navigate to finish page when skip is clicked
        router.push('/finish');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container} dir="rtl">
                {/* Content Area - stays at top */}
                <div className={styles.contentArea}>
                    {/* Section Heading with counter */}
                    <div className={styles.progressBar}>
                        <div className={styles.progressCounter}>{currentIndex + 1}/{totalQuestions}</div>
                        <div className={styles.progressLabel}>סיכום יומי</div>
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
                </div>

                {/* Button Area - anchored to bottom */}
                <div className={styles.buttonArea}>
                    {/* כפתור דלג - hide on last question */}
                    {!isLastQuestion && <SkipButton onClick={handleSkip} />}

                    {/* כפתור הבא - text changes on last question */}
                    <NextButton onClick={handleNext} text={isLastQuestion ? "סיום" : undefined} />
                </div>
            </div>
        </div>
    );
}