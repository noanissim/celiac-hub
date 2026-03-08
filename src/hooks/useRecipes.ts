import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  category: string;
  prepTime: string | null;
  cookTime: string | null;
  servings: string | null;
  difficulty: string | null;
  tags: string[];
  imageUrl: string | null;
  sourceName: string;
  sourceUrl: string;
  sourceLogoUrl: string | null;
  createdAt: string;
}

function mapRow(r: any): Recipe {
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    prepTime: r.prep_time,
    cookTime: r.cook_time,
    servings: r.servings,
    difficulty: r.difficulty,
    tags: r.tags || [],
    imageUrl: r.image_url,
    sourceName: r.source_name,
    sourceUrl: r.source_url,
    sourceLogoUrl: r.source_logo_url,
    createdAt: r.created_at,
  };
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
      return data.map(mapRow);
    },
  });
}

export function useRecipeCategories() {
  return useQuery({
    queryKey: ["recipe-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("category");
      if (error) throw error;
      return [...new Set(data.map((r) => r.category))].sort();
    },
  });
}
