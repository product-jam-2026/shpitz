"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";
import SkipButton from "@/lib/components/SkipButton";
import NextButton from "@/lib/components/NextButton";

console.log('📄 REVIEW PAGE FILE LOADED');

export default function ReviewPage() {
    console.log('📖 Review page component rendered');
    
    const router = useRouter();
    const [wrongQuestions, setWrongQuestions] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔍 Loading wrong answers from localStorage...');
        
        // Load wrong answers from localStorage
        const dailyResultsStr = localStorage.getItem('dailyResults');
        console.log('Raw dailyResults:', dailyResultsStr);
        
        if (dailyResultsStr) {
            try {
                const results = JSON.parse(dailyResultsStr);
                console.log('Parsed results:', results);
                console.log('wrongAnswers field:', results.wrongAnswers);
                
                const wrongAnswers = results.wrongAnswers || [];
                console.log(`Found ${wrongAnswers.length} wrong answers`);
                
                if (wrongAnswers.length === 0) {
                    console.log('No wrong answers - redirecting to finish');
                    router.push('/finish');
                    return;
                }
                
                setWrongQuestions(wrongAnswers);
            } catch (error) {
                console.error('Error parsing dailyResults:', error);
                router.push('/finish');
            }
        } else {
            console.log('No dailyResults found - redirecting to finish');
            router.push('/finish');
        }
        
        setLoading(false);
    }, [router]);

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container} dir="rtl">
                    <p>טוען...</p>
                </div>
            </div>
        );
    }

    if (wrongQuestions.length === 0) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container} dir="rtl">
                    <p>כל התשובות נכונות! מעביר לסיום...</p>
                </div>
            </div>
        );
    }

    const current = wrongQuestions[currentIndex];
    const totalQuestions = wrongQuestions.length;
    const isLastQuestion = currentIndex === totalQuestions - 1;

    console.log(`Showing question ${currentIndex + 1}/${totalQuestions}:`, current);

    const handleNext = () => {
        if (currentIndex < totalQuestions - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            router.push('/finish');
        }
    };

    const handleSkip = () => {
        router.push('/finish');
    };

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container} dir="rtl">
                <div className={styles.contentArea}>
                    <div className={styles.progressBar}>
                        <div className={styles.progressCounter}>{currentIndex + 1}/{totalQuestions}</div>
                        <div className={styles.progressLabel}>סיכום יומי - תשובות שגויות</div>
                    </div>

                    <div className={styles.messageCard}>
                        <div className={styles.messageHeader}>
                            <div className={styles.avatarCircle}></div>
                            <p dir="ltr" className="font-bold text-xs">
                                {current?.Owner ?? "+972 528886666"}
                            </p>
                        </div>
                        <div className={styles.messageTimestamp}>היום 9:07</div>
                        <div className={styles.messageBubbleContainer}>
                            <div className={styles.messageBubbleText}>
                                <p>{current?.content}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.hintText}>
                        {current?.tips ?? "אין רמז זמין"}
                    </div>
                </div>

                <div className={styles.buttonArea}>
                    {!isLastQuestion && <SkipButton onClick={handleSkip} />}
                    <NextButton onClick={handleNext} text={isLastQuestion ? "סיום" : undefined} />
                </div>
            </div>
        </div>
    );
}