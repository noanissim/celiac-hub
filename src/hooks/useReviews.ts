import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  userId: string;
  restaurantId: string;
  content: string;
  rating: number | null;
  createdAt: string;
  displayName: string;
  avatarUrl: string;
}

export function useReviews(restaurantId: string) {
  return useQuery({
    queryKey: ["reviews", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (error) throw error;

      // Fetch profile names for each review
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

      return data.map((r): Review => ({
        id: r.id,
        userId: r.user_id,
        restaurantId: r.restaurant_id,
        content: r.content,
        rating: r.rating,
        createdAt: r.created_at,
        displayName: profileMap.get(r.user_id)?.display_name || "Anonymous",
        avatarUrl: profileMap.get(r.user_id)?.avatar_url || "",
      }));
    },
  });
}

export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, restaurantId, content, rating }: {
      userId: string;
      restaurantId: string;
      content: string;
      rating?: number;
    }) => {
      const { error } = await supabase.from("reviews").insert({
        user_id: userId,
        restaurant_id: restaurantId,
        content,
        rating: rating ?? null,
      });
      if (error) throw error;
    },
    onSuccess: (_, { restaurantId }) => {
      queryClient.invalidateQueries({ queryKey: ["reviews", restaurantId] });
    },
  });
}
