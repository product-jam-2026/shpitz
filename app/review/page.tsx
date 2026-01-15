"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./page.module.css";

// Function to parse text and detect URLs
const parseTextWithLinks = (text: string) => {
    if (!text) return null;

    // Regex to match URLs (http, https, www)
    const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = urlRegex.exec(text)) !== null) {
        // Add text before the URL
        if (match.index > lastIndex) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex, match.index)
            });
        }

        // Add the URL
        const url = match[0];
        parts.push({
            type: 'link',
            content: url,
            href: url.startsWith('http') ? url : `https://${url}`
        });

        lastIndex = match.index + url.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push({
            type: 'text',
            content: text.substring(lastIndex)
        });
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
};

export default function ReviewPage() {
    const router = useRouter();
    const [allQuestions, setAllQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMessageMode, setIsMessageMode] = useState(true);

    useEffect(() => {
        // Reset body styles that were set by the game page
        document.body.style.height = '';
        document.body.style.overflow = '';

        // Remove any active focus that might show a cursor
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }

        // Load the mode (messages or photos)
        const savedMode = localStorage.getItem('dailyQuestionMode');
        // Default to messages if not set, otherwise check if it's NOT 'photos'
        setIsMessageMode(savedMode !== 'photos');

        // Load all questions and results from localStorage
        const dailyResultsStr = localStorage.getItem('dailyResults');

        if (dailyResultsStr) {
            try {
                const results = JSON.parse(dailyResultsStr);
                const wrongAnswers = results.wrongAnswers || [];
                const answersHistory = results.answersHistory || [];

                // Get all questions from localStorage
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
                } else if (answersHistory.length > 0) {
                    // If we don't have dailyQuestions but have answersHistory, use that
                    const questionsWithStatus = answersHistory.map((answer: any, index: number) => ({
                        ...answer.questionData,
                        isCorrect: answer.isCorrect,
                        questionIndex: index
                    }));
                    setAllQuestions(questionsWithStatus);
                } else if (wrongAnswers.length > 0) {
                    // Last fallback: show only wrong answers
                    const questionsWithStatus = wrongAnswers.map((question: any, index: number) => ({
                        ...question,
                        isCorrect: false,
                        questionIndex: index
                    }));
                    setAllQuestions(questionsWithStatus);
                } else {
                    // No data available at all
                    console.warn('No question data found in dailyResults');
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
                    {allQuestions.map((question, index) => {
                        const contentParts = parseTextWithLinks(question?.content);

                        return (
                            <div
                                key={question.id || index}
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
                                {isMessageMode ? (
                                    <div className={styles.messageCard}>
                                        <div className={`${styles.messageHeader} ${question.isCorrect ? styles.correctHeader : ''}`}>
                                            <p dir="ltr">
                                                {question?.Owner ?? "+972 528886666"}
                                            </p>
                                        </div>
                                        <div className={styles.messageBubbleContainer}>
                                            <div className={styles.messageBubbleText}>
                                                <p>
                                                    {contentParts?.map((part, idx) =>
                                                        part.type === 'link' ? (
                                                            <a
                                                                key={idx}
                                                                href={part.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                {part.content}
                                                            </a>
                                                        ) : (
                                                            <span key={idx}>{part.content}</span>
                                                        )
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={styles.photoCard}>
                                        <img
                                            src={question?.picture}
                                            alt={`Question ${index + 1}`}
                                            className={styles.photoImage}
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className={styles.buttonArea}>
                    <div className={styles.buttonContainer}>
                        <button
                            className={styles.understoodButton}
                            onClick={handleFinish}
                        >
                            <span className={styles.buttonText}>הבנתי</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}