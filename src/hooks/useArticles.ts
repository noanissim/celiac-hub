import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Article {
  id: string;
  title: string;
  summary: string | null;
  sourceUrl: string | null;
  sourceName: string | null;
  publishedDate: string | null;
  category: "research" | "news";
  createdAt: string;
}

export type SortField = "published_date" | "title" | "source_name";
export type SortDir = "asc" | "desc";

interface ArticleFilters {
  category?: "research" | "news";
  sourceName?: string;
  year?: number;
  sortBy?: SortField;
  sortDir?: SortDir;
}

export function useArticles(filters: ArticleFilters = {}) {
  return useQuery({
    queryKey: ["articles", filters],
    queryFn: async () => {
      const sortBy = filters.sortBy ?? "published_date";
      const sortDir = filters.sortDir ?? "desc";

      let query = supabase
        .from("articles")
        .select("*")
        .order(sortBy, { ascending: sortDir === "asc" });

      if (filters.category) query = query.eq("category", filters.category);
      if (filters.sourceName) query = query.eq("source_name", filters.sourceName);
      if (filters.year) {
        query = query
          .gte("published_date", `${filters.year}-01-01`)
          .lte("published_date", `${filters.year}-12-31`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map((r): Article => ({
        id: r.id,
        title: r.title,
        summary: r.summary,
        sourceUrl: r.source_url,
        sourceName: (r as any).source_name ?? null,
        publishedDate: r.published_date,
        category: r.category as "research" | "news",
        createdAt: r.created_at,
      }));
    },
  });
}

export function useArticleSources() {
  return useQuery({
    queryKey: ["article-sources"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("source_name");
      if (error) throw error;
      return [...new Set(data.map((r) => (r as any).source_name).filter(Boolean))].sort() as string[];
    },
  });
}
