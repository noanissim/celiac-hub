import { MapPin, Star } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import type { Restaurant } from "@/hooks/useRestaurants";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onToggleComments: (id: string) => void;
  showComments: boolean;
  onClick: () => void;
}

export function RestaurantCard({ restaurant, onToggleComments, showComments, onClick }: RestaurantCardProps) {
  const categoryLabel: Record<string, string> = {
    italian: "🇮🇹 Italian",
    asian: "🍜 Asian",
    meat: "🥩 Meat",
    cafe: "☕ Café",
  };

  return (
    <Card className="group relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01]" style={{ boxShadow: "var(--card-hover-shadow)" }} onClick={onClick}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-bold text-foreground font-[var(--font-display)]">{restaurant.name}</h3>
            <Badge variant={restaurant.gfLevel === "100% GF" ? "default" : "secondary"} className="text-xs">
              {restaurant.gfLevel}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{categoryLabel[restaurant.category]}</p>
        </div>
        <FavoriteButton itemId={restaurant.id} itemType="restaurant" />
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center gap-3 text-sm">
          <span className="flex items-center gap-1 font-semibold text-accent-foreground">
            <Star className="h-4 w-4 fill-accent text-accent" />
            {restaurant.rating}
            {restaurant.reviewCount && (
              <span className="font-normal text-muted-foreground">({restaurant.reviewCount.toLocaleString()})</span>
            )}
          </span>
          <span className="text-muted-foreground">{restaurant.price}</span>
          {restaurant.kosher && <Badge variant="outline" className="text-xs">Kosher</Badge>}
        </div>

        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{restaurant.address}</span>
        </div>

        <p className="text-sm text-foreground/80">{restaurant.description}</p>

        <Button variant="ghost" size="sm" className="w-full text-primary" onClick={(e) => { e.stopPropagation(); onToggleComments(restaurant.id); }}>
          {showComments ? "Hide Comments" : "💬 Community Comments"}
        </Button>
      </CardContent>
    </Card>
  );
}
