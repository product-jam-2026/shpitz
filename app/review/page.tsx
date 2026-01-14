"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";

export default function ReviewPage() {
    const router = useRouter();
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load all questions and results from localStorage
        const dailyResultsStr = localStorage.getItem('dailyResults');
        
        if (dailyResultsStr) {
            try {
                const results = JSON.parse(dailyResultsStr);
                const wrongAnswers = results.wrongAnswers || [];
                
                // Get all questions from localStorage (you'll need to adjust this based on your data structure)
                // For now, I'm assuming you have a way to get all questions
                const allQuestionsStr = localStorage.getItem('dailyQuestions');
                
                if (allQuestionsStr) {
                    const questions = JSON.parse(allQuestionsStr);
                    
                    // Mark each question as correct or wrong
                    const questionsWithStatus = questions.map((question: any, index: number) => {
                        const isWrong = wrongAnswers.some((wrongQ: any) => 
                            wrongQ.questionIndex === index || wrongQ.id === question.id
                        );
                        
                        return {
                            ...question,
                            isCorrect: !isWrong,
                            questionIndex: index
                        };
                    });
                    
                    setAllQuestions(questionsWithStatus);
                } else {
                    // If we don't have all questions, fall back to showing only wrong answers
                    const questionsWithStatus = wrongAnswers.map((question: any, index: number) => ({
                        ...question,
                        isCorrect: false
                    }));
                    setAllQuestions(questionsWithStatus);
                }
            } catch (error) {
                console.error('Error parsing dailyResults:', error);
                router.push('/finish');
            }
        } else {
            router.push('/finish');
        }
        
        setLoading(false);
    }, [router]);

    const handleFinish = () => {
        router.push('/finish');
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container} dir="rtl">
                    <p>טוען...</p>
                </div>
            </div>
        );
    }

    if (allQuestions.length === 0) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.container} dir="rtl">
                    <p>אין שאלות להצגה...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            {/* Back arrow button */}
            <button className={styles.backButton} onClick={handleBack}>
                <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41" fill="none">
                    <path d="M27.4258 18.6515L17.9309 9.1566L20.347 6.78288L33.9111 20.347L20.347 33.9111L17.9309 31.5374L27.4258 22.0425L6.78288 22.0425L6.78288 18.6515L27.4258 18.6515Z" fill="#1C1D1E"/>
                </svg>
            </button>

            <div className={styles.container} dir="rtl">
                <div className={styles.contentArea}>
                    {/* Title section */}
                    <div className={styles.titleSection}>
                        <div className={styles.avatarCircleLarge}>
                            <img 
                                src="/icons/review.svg" 
                                alt="Review Icon" 
                                className={styles.avatarIcon}
                            />
                        </div>
                        <h1 className={styles.mainTitle}>סיכום יומי</h1>
                        <p className={styles.subtitle}>
                            זה הזמן לעצור ולבדוק מה יכולתם
                            <br />
                            לזהות כבר במהלך המשחק
                        </p>
                    </div>

                    {/* Show all questions with correct/incorrect styling */}
                    {allQuestions.map((question, index) => (
                        <div 
                            key={index} 
                            className={`${styles.questionContainer} ${question.isCorrect ? styles.correctQuestion : ''}`}
                        >
                            <div>
                                <h3 className={`${styles.tipTitle} ${question.isCorrect ? styles.correctTitle : ''}`}>
                                    שאלה #{index + 1}
                                </h3>
                                <div className={styles.hintText}>
                                    {question?.tips ?? "אין רמז זמין"}
                                </div>
                            </div>
                            <div className={styles.messageCard}>
                                <div className={`${styles.messageHeader} ${question.isCorrect ? styles.correctHeader : ''}`}>
                                    <p dir="ltr">
                                        {question?.Owner ?? "+972 528886666"}
                                    </p>
                                </div>
                                <div className={styles.messageBubbleContainer}>
                                    <div className={styles.messageBubbleText}>
                                        <p>{question?.content}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.buttonArea}>
                    <div className={styles.buttonContainer}>
                        <button 
                            className={styles.understoodButton}
                            onClick={handleFinish}
                            style={{
                                transform: 'none',
                                transition: 'opacity 0.1s',
                            }}
                        >
                            <span className={styles.buttonText}>הבנתי</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}