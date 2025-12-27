"use client";
import { useEffect } from 'react';
import StartPage from "./startPage"; 

export default function Page() {
  useEffect(() => {
    // ברגע שהדף נטען, אנחנו מסמנים שהמשתמש כבר ראה את ההוראות
    // (אפשר גם להפעיל את זה רק כשהוא לוחץ על "הבנתי" בתוך ChallengeBase)
    localStorage.setItem('hasVisitedBefore', 'true');
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <StartPage />
    </main>
  );
} 