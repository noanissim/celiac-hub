import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CoffeeCart {
  id: string;
  name: string;
  nameHe: string | null;
  location: string;
  address: string;
  lat: number;
  lng: number;
  hours: string | null;
  gfOptions: string | null;
  description: string | null;
  menuLink: string | null;
}

function mapRow(r: any): CoffeeCart {
  return {
    id: r.id,
    name: r.name,
    nameHe: r.name_he,
    location: r.location,
    address: r.address,
    lat: r.lat,
    lng: r.lng,
    hours: r.opening_hours,
    gfOptions: r.gf_options,
    description: r.description,
    menuLink: r.menu_link,
  };
}

export function useCoffeeCarts() {
  return useQuery({
    queryKey: ["coffee-carts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("coffee_carts")
        .select("*")
        .order("name");
      if (error) throw error;
      return data.map(mapRow);
    },
  });
}
