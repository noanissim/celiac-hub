import { MapPin, Clock, ExternalLink, FileText, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import type { Restaurant } from "@/hooks/useRestaurants";

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RestaurantDetailModal({ restaurant, open, onOpenChange }: RestaurantDetailModalProps) {
  if (!restaurant) return null;

  const categoryLabel: Record<string, string> = {
    italian: "🇮🇹 Italian",
    asian: "🍜 Asian",
    meat: "🥩 Meat",
    cafe: "☕ Café",
  };

  const images = restaurant.images || [];
  const hours = restaurant.openingHours || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-none bg-card/80 p-0 backdrop-blur-xl sm:rounded-2xl"
        style={{ boxShadow: "0 25px 60px -12px hsl(25 30% 15% / 0.25)" }}>
        <DialogTitle className="sr-only">{restaurant.name}</DialogTitle>

        {images.length > 0 && (
          <div className="relative">
            <Carousel className="w-full" opts={{ loop: true }}>
              <CarouselContent>
                {images.map((src, i) => (
                  <CarouselItem key={i}>
                    <img src={src} alt={`${restaurant.name} photo ${i + 1}`} className="h-64 w-full object-cover sm:h-72" loading="lazy" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 h-9 w-9 border-none bg-background/60 backdrop-blur-sm hover:bg-background/80" />
              <CarouselNext className="right-3 h-9 w-9 border-none bg-background/60 backdrop-blur-sm hover:bg-background/80" />
            </Carousel>
          </div>
        )}

        <div className="space-y-5 px-6 pb-6 pt-2">
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>{restaurant.name}</h2>
              <Badge variant={restaurant.gfLevel === "100% GF" ? "default" : "secondary"} className="shrink-0 text-xs">{restaurant.gfLevel}</Badge>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
              <span>{categoryLabel[restaurant.category]}</span>
              <span className="flex items-center gap-1 font-semibold text-accent-foreground">
                <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                {restaurant.rating}
                {restaurant.reviewCount && <span className="font-normal text-muted-foreground">({restaurant.reviewCount.toLocaleString()})</span>}
              </span>
              <span>{restaurant.price}</span>
              {restaurant.kosher && <Badge variant="outline" className="text-xs">Kosher</Badge>}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">{restaurant.description}</p>

          <div className="space-y-3 rounded-xl border bg-muted/40 p-4">
            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span className="text-foreground">{restaurant.address}</span>
            </div>
            {Object.keys(hours).length > 0 && (
              <div className="flex items-start gap-2.5 text-sm">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="grid w-full grid-cols-2 gap-x-4 gap-y-0.5 text-foreground">
                  {Object.entries(hours).map(([day, time]) => (
                    <div key={day} className="flex justify-between">
                      <span className="font-medium">{day}</span>
                      <span className="text-muted-foreground">{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {restaurant.websiteUrl ? (
              <Button asChild className="flex-1 transition-transform hover:scale-[1.02]">
                <a href={restaurant.websiteUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" /> Visit Website
                </a>
              </Button>
            ) : (
              <Button variant="secondary" className="flex-1" disabled>
                <ExternalLink className="h-4 w-4" /> Contact for Details
              </Button>
            )}
            {restaurant.menuUrl ? (
              <Button asChild variant="outline" className="flex-1 transition-transform hover:scale-[1.02]">
                <a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4" /> View Menu
                </a>
              </Button>
            ) : (
              <Button variant="outline" className="flex-1" disabled>
                <FileText className="h-4 w-4" /> Contact for Menu
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
