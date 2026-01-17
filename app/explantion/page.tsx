"use client";
import { useEffect } from 'react';

export default function Page() {
  useEffect(() => {
    // ברגע שהדף נטען, אנחנו מסמנים שהמשתמש כבר ראה את ההוראות
    localStorage.setItem('hasVisitedBefore', 'true');
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <div>הדף הזה כבר לא בשימוש</div>
    </main>
  );
} 