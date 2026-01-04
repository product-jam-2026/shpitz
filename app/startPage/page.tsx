"use client";
import { useEffect } from 'react';
import StartPage from "./startPage"; 

export default function Page() {
  useEffect(() => {
  
    localStorage.setItem('hasVisitedBefore', 'true');
  }, []);

  return (
    <main className="min-h-screen bg-[#F3F3F3]">
      <StartPage />
    </main>
  );
} 