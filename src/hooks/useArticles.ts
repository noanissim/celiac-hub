import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  summary: string | null;
  sourceUrl: string | null;
  publishedDate: string | null;
  category: "research" | "news";
  createdAt: string;
}

export function useArticles(category?: "research" | "news") {
  return useQuery({
    queryKey: ["articles", category],
    queryFn: async () => {
      let query = supabase
        .from("articles")
        .select("*")
        .order("published_date", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return data.map((r): Article => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        sourceUrl: r.source_url,
        publishedDate: r.published_date,
        category: r.category as "research" | "news",
      }));
    },
  });
}
