import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ChefHat, Utensils, Coffee, Globe, ShoppingBag, FileText, Heart, User } from "lucide-react";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import RestaurantsPage from "./pages/RestaurantsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/recipes" element={<PlaceholderPage title="Recipes" icon={ChefHat} description="Discover and share delicious gluten-free recipes for every meal." />} />
            <Route path="/restaurants" element={<RestaurantsPage />} />
            <Route path="/coffee-carts" element={<PlaceholderPage title="Coffee Carts Map" icon={Coffee} description="Locate gluten-free friendly coffee spots near you." />} />
            <Route path="/international" element={<PlaceholderPage title="International Guide" icon={Globe} description="Travel tips and dining cards for eating GF around the world." />} />
            <Route path="/shops" element={<PlaceholderPage title="Shops & Deals" icon={ShoppingBag} description="Browse the best gluten-free products and exclusive deals." />} />
            <Route path="/research" element={<PlaceholderPage title="Research Articles" icon={FileText} description="Stay updated with the latest celiac disease research." />} />
            <Route path="/favorites" element={<PlaceholderPage title="Favorites" icon={Heart} description="Your saved recipes, restaurants, and articles in one place." />} />
            <Route path="/profile" element={<PlaceholderPage title="Profile" icon={User} description="Manage your account and preferences." />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
