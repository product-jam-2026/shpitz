"use client";
import { useEffect, useState } from 'react';
import StartPage from "./startPage"; 
import { useDailyQuestions } from "@/app/hooks/useDailyQuestions";

export default function Page() {
  const { questions, loading, error } = useDailyQuestions();

  useEffect(() => {
    localStorage.setItem('hasVisitedBefore', 'true');
    
    // Save questions to localStorage when they're loaded
    if (questions && questions.length > 0) {
      localStorage.setItem('dailyQuestions', JSON.stringify(questions));
    }
  }, [questions]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F3F3F3] flex items-center justify-center">
         <StartPage />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#F3F3F3] flex items-center justify-center">
        <p>שגיאה בטעינת השאלות: {error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <StartPage />
    </main>
  );
}