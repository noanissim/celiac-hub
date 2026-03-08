import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ChefHat, Utensils, Coffee, Globe, ShoppingBag, FileText, Heart, User } from "lucide-react";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import CoffeeCartsMap from "./pages/CoffeeCartsMap";
import ArticlesPage from "./pages/ArticlesPage";
import RecipesPage from "./pages/RecipesPage";
import ProfilePage from "./pages/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/recipes" element={<RecipesPage />} />
              <Route path="/restaurants" element={<RestaurantsPage />} />
              <Route path="/coffee-carts" element={<CoffeeCartsMap />} />
              <Route path="/international" element={<PlaceholderPage title="International Guide" icon={Globe} description="Travel tips and dining cards for eating GF around the world." />} />
              <Route path="/shops" element={<PlaceholderPage title="Shops & Deals" icon={ShoppingBag} description="Browse the best gluten-free products and exclusive deals." />} />
              <Route path="/research" element={<ArticlesPage />} />
              <Route path="/favorites" element={<ProfilePage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
