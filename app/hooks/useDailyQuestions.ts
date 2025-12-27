// hooks/useDailyQuestions.ts
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export type DbMessage = {
  id: number;
  content: string;
  isTrue: boolean;
  tips: string | null;
  Owner: string | null;
  hint: string | null;
};

// 1. A helper function to generate a number based on today's date string
// This ensures the "random" shuffle is the same for everyone, all day long.
function getDailySeed() {
  const date = new Date();
  // Create a string like "2023-10-27"
  const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
  // Convert string to a number hash
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

// 2. A seeded random generator (Linear Congruential Generator)
function seededRandom(seed: number) {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;
  let state = seed;

  return function () {
    state = (a * state + c) % m;
    return state / (m - 1);
  };
}

// 3. The Hook itself
export function useDailyQuestions() {
  const [questions, setQuestions] = useState<DbMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndShuffle = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch ALL potential candidates (we filter them in JS to ensure daily rotation works)
        // If your table is huge, we might need a different strategy, but for <1000 rows this is fine.
        const { data, error } = await supabase
          .from("assets")
          .select("id, content, isTrue, tips, Owner, hint")
          .eq("topic", "message")
          .eq("type", "txt");

        if (error) throw error;
        if (!data || data.length === 0) {
            setQuestions([]); 
            return;
        }

        // --- THE DAILY MAGIC ---
        const seed = getDailySeed(); // Get today's unique number
        const rng = seededRandom(seed); // Create a random generator locked to today

        // Shuffle the array using our daily seed
        const shuffled = [...data].sort(() => rng() - 0.5);

        // Take the first 5
        setQuestions(shuffled.slice(0, 5) as DbMessage[]);
        
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndShuffle();
  }, []);

  return { questions, loading, error };
}