import { Clock, Users, ExternalLink, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/hooks/useRecipes";

const difficultyColor: Record<string, string> = {
  easy: "bg-green-500/15 text-green-700 border-green-200",
  medium: "bg-amber-500/15 text-amber-700 border-amber-200",
  hard: "bg-red-500/15 text-red-700 border-red-200",
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ChefHat className="h-12 w-12 text-muted-foreground/40" />
          </div>
        )}
        {recipe.difficulty && (
          <Badge
            className={`absolute top-2 right-2 text-[10px] ${difficultyColor[recipe.difficulty] ?? ""}`}
            variant="outline"
          >
            {recipe.difficulty}
          </Badge>
        )}
      </div>

      <CardContent className="space-y-3 p-4">
        {/* Title */}
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-foreground">
          {recipe.title}
        </h3>

        {/* Description */}
        {recipe.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {recipe.prepTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {recipe.prepTime}
            </span>
          )}
          {recipe.cookTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {recipe.cookTime}
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" /> {recipe.servings}
            </span>
          )}
        </div>

        {/* Tags */}
        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source credit + CTA */}
        <div className="flex items-center justify-between gap-2 border-t pt-3">
          <div className="flex items-center gap-2 min-w-0">
            {recipe.sourceLogoUrl ? (
              <img
                src={recipe.sourceLogoUrl}
                alt={recipe.sourceName}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
                {recipe.sourceName.charAt(0)}
              </div>
            )}
            <span className="truncate text-xs font-medium text-muted-foreground">
              {recipe.sourceName}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild className="shrink-0 text-xs h-8">
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
              <ExternalLink className="h-3 w-3" /> View Original
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
