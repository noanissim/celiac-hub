import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  sourceName: string;
  sourceLogoUrl: string | null;
  sourceUrl: string;
  prepTime: string | null;
  cookTime: string | null;
  servings: string | null;
  difficulty: string | null;
  tags: string[];
  category: string;
}

export function useRecipes(category?: string) {
  return useQuery({
    queryKey: ["recipes", category],
    queryFn: async () => {
      let query = supabase
        .from("recipes")
        .select("*")
        .order("created_at", { ascending: false });
      if (category) query = query.eq("category", category);
      const { data, error } = await query;
      if (error) throw error;
      return data.map((r): Recipe => ({
        id: r.id,
        title: r.title,
        description: r.description,
        imageUrl: r.image_url,
        sourceName: r.source_name,
        sourceLogoUrl: r.source_logo_url,
        sourceUrl: r.source_url,
        prepTime: r.prep_time,
        cookTime: r.cook_time,
        servings: r.servings,
        difficulty: r.difficulty,
        tags: r.tags ?? [],
        category: r.category,
      }));
    },
  });
}
