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

export type DbPhoto = {
  id: number;
  picture: string;
  isTrue: boolean;
  tips: string | null;
  hint: string | null;
};

export type DailyQuestion = DbMessage | DbPhoto;

// Helper to check if a question is a photo
export function isPhotoQuestion(question: DailyQuestion): question is DbPhoto {
  return 'picture' in question;
}

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

// Helper function to determine if today should show photos or messages
// Based on the daily seed, returns true for messages, false for photos
export function shouldShowMessages() {
  // 🔧 Force messages mode (original behavior)
  return true; // Set to true for messages, false for photos

  // Uncomment below to enable date-based switching:
  // const seed = getDailySeed();
  // return seed % 2 === 0; // Even = messages, Odd = photos
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
  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMessageMode, setIsMessageMode] = useState(true);

  useEffect(() => {
    const fetchAndShuffle = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Determine if today is message day or photo day
        const showMessages = shouldShowMessages();
        setIsMessageMode(showMessages);

        let data: any[] | null = null;
        let error: any = null;

        if (showMessages) {
          // Fetch text messages from assets table
          const response = await supabase
            .from("assets")
            .select("id, content, isTrue, tips, Owner, hint")
            .eq("topic", "message")
            .eq("type", "txt");

          data = response.data;
          error = response.error;
        } else {
          // Fetch photos from pictures table
          const response = await supabase
            .from("pictures")
            .select("id, picture, isTrue, tips, hint");

          data = response.data;
          error = response.error;
        }

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
        setQuestions(shuffled.slice(0, 5) as DailyQuestion[]);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndShuffle();
  }, []);

  return { questions, loading, error, isMessageMode };
}