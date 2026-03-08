import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Restaurant {
  id: string;
  name: string;
  category: "italian" | "asian" | "meat" | "cafe";
  address: string;
  city: string;
  rating: number;
  reviewCount: number | null;
  description: string | null;
  gfLevel: "100% GF" | "GF Options";
  kosher: boolean;
  price: "₪" | "₪₪" | "₪₪₪";
  websiteUrl: string | null;
  menuUrl: string | null;
  openingHours: Record<string, string> | null;
  images: string[];
}

function mapRow(r: any): Restaurant {
  return {
    id: r.id,
    name: r.name,
    category: r.category,
    address: r.address,
    city: r.city,
    rating: Number(r.rating),
    reviewCount: r.review_count,
    description: r.description,
    gfLevel: r.gf_level,
    kosher: r.kosher,
    price: r.price,
    websiteUrl: r.website_url,
    menuUrl: r.menu_url,
    openingHours: r.opening_hours as Record<string, string> | null,
    images: r.image_urls || [],
  };
}

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("rating", { ascending: false });
      if (error) throw error;
      return data.map(mapRow);
    },
  });
}

export function useAllCities() {
  return useQuery({
    queryKey: ["restaurant-cities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("city");
      if (error) throw error;
      return [...new Set(data.map((r) => r.city))].sort();
    },
  });
}
