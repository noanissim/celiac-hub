import { useState, useMemo } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RestaurantCard } from "@/components/RestaurantCard";
import { CommentSection } from "@/components/CommentSection";
import { RestaurantDetailModal } from "@/components/RestaurantDetailModal";
import { restaurants, allCities } from "@/data/restaurants";
import type { Restaurant, RestaurantCategory, GFLevel, PriceLevel } from "@/data/restaurants";
import type { RestaurantCategory, GFLevel, PriceLevel } from "@/data/restaurants";

export default function RestaurantsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<RestaurantCategory | "all">("all");
  const [gfLevel, setGfLevel] = useState<GFLevel | "all">("all");
  const [kosher, setKosher] = useState<"all" | "yes" | "no">("all");
  const [price, setPrice] = useState<PriceLevel | "all">("all");
  const [city, setCity] = useState<string>("all");
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (category !== "all" && r.category !== category) return false;
      if (gfLevel !== "all" && r.gfLevel !== gfLevel) return false;
      if (kosher === "yes" && !r.kosher) return false;
      if (kosher === "no" && r.kosher) return false;
      if (price !== "all" && r.price !== price) return false;
      if (city !== "all" && r.city !== city) return false;
      return true;
    });
  }, [search, category, gfLevel, kosher, price, city]);

  const toggleComments = (id: string) => setOpenComments(openComments === id ? null : id);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-foreground md:text-4xl">Restaurants & Cafés</h1>
        <p className="mt-2 text-muted-foreground">Find celiac-safe dining spots reviewed by the community</p>
      </div>

      {/* Search & Filter Toggle */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg border bg-card p-4 sm:grid-cols-3 md:grid-cols-5">
          <Select value={category} onValueChange={(v) => setCategory(v as RestaurantCategory | "all")}>
            <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="italian">🇮🇹 Italian</SelectItem>
              <SelectItem value="asian">🍜 Asian</SelectItem>
              <SelectItem value="meat">🥩 Meat</SelectItem>
              <SelectItem value="cafe">☕ Café</SelectItem>
            </SelectContent>
          </Select>

          <Select value={gfLevel} onValueChange={(v) => setGfLevel(v as GFLevel | "all")}>
            <SelectTrigger><SelectValue placeholder="GF Level" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All GF Levels</SelectItem>
              <SelectItem value="100% GF">100% GF</SelectItem>
              <SelectItem value="GF Options">GF Options</SelectItem>
            </SelectContent>
          </Select>

          <Select value={kosher} onValueChange={(v) => setKosher(v as "all" | "yes" | "no")}>
            <SelectTrigger><SelectValue placeholder="Kosher" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="yes">Kosher</SelectItem>
              <SelectItem value="no">Not Kosher</SelectItem>
            </SelectContent>
          </Select>

          <Select value={price} onValueChange={(v) => setPrice(v as PriceLevel | "all")}>
            <SelectTrigger><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="₪">₪</SelectItem>
              <SelectItem value="₪₪">₪₪</SelectItem>
              <SelectItem value="₪₪₪">₪₪₪</SelectItem>
            </SelectContent>
          </Select>

          <Select value={city} onValueChange={setCity}>
            <SelectTrigger><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {allCities.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results count */}
      <p className="mb-4 text-sm text-muted-foreground">
        Showing {filtered.length} of {restaurants.length} restaurants
      </p>

      {/* Restaurant Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((r) => (
          <div key={r.id}>
            <RestaurantCard restaurant={r} onToggleComments={toggleComments} showComments={openComments === r.id} />
            {openComments === r.id && (
              <div className="mt-2">
                <CommentSection restaurantId={r.id} />
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-lg text-muted-foreground">No restaurants found matching your filters.</p>
          <Button variant="link" onClick={() => { setSearch(""); setCategory("all"); setGfLevel("all"); setKosher("all"); setPrice("all"); setCity("all"); }}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
