import { Clock, Users, ExternalLink, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/hooks/useRecipes";

const difficultyColors: Record<string, string> = {
  easy: "bg-green-500/15 text-green-700 border-green-200",
  medium: "bg-amber-500/15 text-amber-700 border-amber-200",
  hard: "bg-red-500/15 text-red-700 border-red-200",
};

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image placeholder */}
      <div className="relative aspect-[4/3] bg-muted flex items-center justify-center overflow-hidden">
        {recipe.imageUrl ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
            <ChefHat className="h-12 w-12" />
            <span className="text-xs font-medium">Recipe Photo</span>
          </div>
        )}
        {recipe.difficulty && (
          <Badge
            variant="outline"
            className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider ${difficultyColors[recipe.difficulty] ?? ""}`}
          >
            {recipe.difficulty}
          </Badge>
        )}
      </div>

      <CardContent className="space-y-3 p-5">
        <h3 className="font-display text-lg font-bold leading-snug text-foreground line-clamp-2">
          {recipe.title}
        </h3>

        {recipe.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {recipe.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {recipe.prepTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {recipe.prepTime}
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
              <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 font-medium">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source Credit — crucial */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-2">
            {recipe.sourceLogoUrl ? (
              <img src={recipe.sourceLogoUrl} alt={recipe.sourceName} className="h-5 w-5 rounded-full object-cover" />
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {recipe.sourceName.charAt(0)}
              </div>
            )}
            <span className="text-xs font-semibold text-muted-foreground">{recipe.sourceName}</span>
          </div>
          <Button variant="outline" size="sm" asChild className="h-8 text-xs">
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="gap-1.5">
              <ExternalLink className="h-3 w-3" />
              View Original
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
