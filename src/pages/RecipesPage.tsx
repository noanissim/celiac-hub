import { useState } from "react";
import { ChefHat } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRecipes } from "@/hooks/useRecipes";
import { RecipeCard } from "@/components/RecipeCard";

const categories = [
  { value: "all", label: "All Recipes" },
  { value: "main", label: "Mains" },
  { value: "baking", label: "Baking" },
  { value: "dessert", label: "Desserts" },
  { value: "breakfast", label: "Breakfast" },
  { value: "salad", label: "Salads" },
];

export default function RecipesPage() {
  const [tab, setTab] = useState("all");
  const category = tab === "all" ? undefined : tab;
  const { data: recipes = [], isLoading } = useRecipes(category);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <ChefHat className="mx-auto mb-2 h-10 w-10 text-primary" />
        <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">
          Gluten-Free Recipes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Delicious GF recipes curated from trusted sources — always with credit to the original creator.
        </p>
      </div>

      {/* Category Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mb-8">
        <TabsList className="flex w-full flex-wrap gap-1 h-auto p-1">
          {categories.map((c) => (
            <TabsTrigger key={c.value} value={c.value} className="text-xs sm:text-sm">
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden">
              <Skeleton className="aspect-[4/3] w-full" />
              <div className="space-y-3 p-5">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && recipes.length === 0 && (
        <div className="py-16 text-center">
          <ChefHat className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg text-muted-foreground">No recipes found in this category yet.</p>
        </div>
      )}

      {/* Source disclaimer */}
      <div className="mt-12 rounded-xl border bg-muted/50 p-6 text-center">
        <p className="text-sm text-muted-foreground leading-relaxed">
          All recipes are curated from external sources and credited to their original creators.
          <br />
          Click <strong>"View Original"</strong> on each card to see the full recipe on the source website.
        </p>
      </div>
    </div>
  );
}
