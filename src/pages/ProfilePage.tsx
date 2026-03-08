import { Helmet } from "react-helmet-async";
import { User, Heart, Utensils, Coffee, ChefHat, LogOut, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { useRestaurants } from "@/hooks/useRestaurants";
import { useRecipes } from "@/hooks/useRecipes";
import { useCoffeeCarts } from "@/hooks/useCoffeeCarts";
import { useArticles } from "@/hooks/useArticles";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { data: favorites = [] } = useFavorites(user?.id);
  const { data: restaurants = [] } = useRestaurants();
  const { data: recipes = [] } = useRecipes();
  const { data: carts = [] } = useCoffeeCarts();
  const { data: articles = [] } = useArticles();

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2"><Skeleton className="h-5 w-40" /><Skeleton className="h-4 w-56" /></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <User className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
        <h1 className="text-2xl font-bold text-foreground">Sign in to view your profile</h1>
        <p className="mt-2 text-muted-foreground">Use the Sign In button in the header to get started.</p>
      </div>
    );
  }

  const favRestaurants = restaurants.filter((r) => favorites.some((f) => f.item_id === r.id && f.item_type === "restaurant"));
  const favRecipes = recipes.filter((r) => favorites.some((f) => f.item_id === r.id && f.item_type === "recipe"));
  const favCarts = carts.filter((c) => favorites.some((f) => f.item_id === c.id && f.item_type === "cart"));
  const favArticles = articles.filter((a) => favorites.some((f) => f.item_id === a.id && f.item_type === "article"));

  const initials = profile?.displayName
    ? profile.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Helmet>
        <title>My Profile — CeliacHub</title>
        <meta name="description" content="View your CeliacHub profile and manage your favorite restaurants, recipes, coffee carts, and articles." />
      </Helmet>
      {/* Profile header */}
      <Card className="mb-8">
        <CardContent className="flex items-center gap-5 p-6">
          <Avatar className="h-16 w-16">
            {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />}
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-foreground">{profile?.displayName || "User"}</h1>
            <p className="text-sm text-muted-foreground truncate">{profile?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={async () => { await signOut(); navigate("/"); }} className="gap-1.5">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Favorites */}
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
        <Heart className="h-5 w-5 text-destructive" /> My Favorites
      </h2>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Heart className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
            <p className="text-sm text-muted-foreground">Tap the heart icon on restaurants, recipes, or coffee carts to save them here.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="restaurants">
          <TabsList className="mb-4">
            <TabsTrigger value="restaurants" className="gap-1.5"><Utensils className="h-3.5 w-3.5" /> Restaurants ({favRestaurants.length})</TabsTrigger>
            <TabsTrigger value="recipes" className="gap-1.5"><ChefHat className="h-3.5 w-3.5" /> Recipes ({favRecipes.length})</TabsTrigger>
            <TabsTrigger value="carts" className="gap-1.5"><Coffee className="h-3.5 w-3.5" /> Coffee ({favCarts.length})</TabsTrigger>
            <TabsTrigger value="articles" className="gap-1.5"><FileText className="h-3.5 w-3.5" /> Articles ({favArticles.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="restaurants">
            {favRestaurants.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No favorite restaurants yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favRestaurants.map((r) => (
                  <Card key={r.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/restaurants")}>
                    <CardHeader className="pb-1"><h3 className="font-bold text-foreground">{r.name}</h3></CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">{r.address}</CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recipes">
            {favRecipes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No favorite recipes yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favRecipes.map((r) => (
                  <Card key={r.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/recipes")}>
                    <CardHeader className="pb-1"><h3 className="font-bold text-foreground">{r.title}</h3></CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">{r.sourceName}</CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="carts">
            {favCarts.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No favorite coffee carts yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favCarts.map((c) => (
                  <Card key={c.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/coffee-carts")}>
                    <CardHeader className="pb-1"><h3 className="font-bold text-foreground">{c.name}</h3></CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">{c.address}</CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles">
            {favArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No favorite articles yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {favArticles.map((a) => (
                  <Card key={a.id} className="cursor-pointer hover:shadow-md transition-all" onClick={() => navigate("/research")}>
                    <CardHeader className="pb-1"><h3 className="font-bold text-foreground text-sm">{a.title}</h3></CardHeader>
                    <CardContent className="pt-0 text-sm text-muted-foreground">{a.sourceName}</CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
