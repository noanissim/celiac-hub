import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { ChefHat, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeCard } from "@/components/RecipeCard";
import { useRecipes } from "@/hooks/useRecipes";

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "breakfast", label: "Breakfast" },
  { value: "main", label: "Main" },
  { value: "dessert", label: "Dessert" },
  { value: "snack", label: "Snack" },
  { value: "side", label: "Side" },
];

export default function RecipesPage() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const category = tab === "all" ? undefined : tab;
  const { data: recipes = [], isLoading } = useRecipes(category);

  const filtered = search
    ? recipes.filter(
        (r) =>
          r.title.toLowerCase().includes(search.toLowerCase()) ||
          r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : recipes;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <Helmet>
        <title>Gluten-Free Recipes — CeliacHub</title>
        <meta name="description" content="Browse delicious gluten-free recipes for breakfast, mains, desserts, and snacks — all credited to their original creators." />
      </Helmet>
      {/* Header */}
      <div className="mb-8 text-center">
        <ChefHat className="mx-auto mb-2 h-10 w-10 text-primary" />
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">
          Gluten-Free Recipes
        </h1>
        <p className="mt-2 text-muted-foreground">
          Discover delicious GF recipes from trusted sources — always with credit to the original creator.
        </p>
      </div>

      {/* Search + Filters */}
      <div className="mb-6 space-y-4">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search recipes or tags…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mx-auto flex w-fit flex-wrap">
            {CATEGORIES.map((c) => (
              <TabsTrigger key={c.value} value={c.value}>
                {c.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-card overflow-hidden">
              <Skeleton className="aspect-[16/10] w-full" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recipe grid */}
      {!isLoading && filtered.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filtered.length === 0 && (
        <div className="py-16 text-center">
          <ChefHat className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
          <p className="text-lg font-medium text-muted-foreground">
            {search ? "No recipes match your search." : "No recipes yet — they'll appear here once added."}
          </p>
        </div>
      )}
    </div>
  );
}
