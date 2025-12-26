import type { SupabaseClient } from "@supabase/supabase-js";

export type MessageQuestion = {
  id: number;
  content: string;
  isTrue: boolean;
  difficulty: number | null;
  type: string | null;
  topic: string | null;
  tips: string | null;
  owner: string | null;
};

type AssetRow = {
  id: number;
  content: string | null;
  isTrue: boolean | null;
  difficulty: number | null;
  type: string | null;
  topic: string | null;
  tips: string | null;
  Owner: string | null; // Note: column name is "Owner" (capital O)
};

export async function fetchFiveMessageQuestions(
  supabase: SupabaseClient
): Promise<MessageQuestion[]> {
  const { data, error } = await supabase
    .from("assets")
    .select("id, content, isTrue, difficulty, type, topic, tips, Owner")
    .eq("topic", "message")
    .eq("type", "txt")
    .order("id", { ascending: true })
    .limit(5);

  if (error) throw error;

  const rows = (data ?? []) as AssetRow[];

  return rows
    .filter((r) => r.content && typeof r.isTrue === "boolean")
    .map((r) => ({
      id: r.id,
      content: r.content ?? "",
      isTrue: Boolean(r.isTrue),
      difficulty: r.difficulty,
      type: r.type,
      topic: r.topic,
      tips: r.tips,
      owner: r.Owner,
    }));
}
