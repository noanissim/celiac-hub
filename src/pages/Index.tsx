import {
  ChefHat,
  Utensils,
  Coffee,
  Globe,
  ShoppingBag,
  FileText,
  Wheat } from
"lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import heroImage from "@/assets/hero-illustration.jpg";

const categories = [
{ title: "Recipes", description: "Delicious gluten-free meals for every occasion", icon: ChefHat, url: "/recipes" },
{ title: "Restaurants", description: "Celiac-safe dining spots near you", icon: Utensils, url: "/restaurants" },
{ title: "Coffee Carts", description: "Find GF-friendly coffee on the go", icon: Coffee, url: "/coffee-carts" },
{ title: "International Guide", description: "Eat safely while traveling abroad", icon: Globe, url: "/international" },
{ title: "Shops & Deals", description: "Best products and exclusive discounts", icon: ShoppingBag, url: "/shops" },
{ title: "Research Articles", description: "Latest science and medical insights", icon: FileText, url: "/research" }];


const Index = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroImage})` }} />
        
        <div className="absolute inset-0" style={{ background: "var(--hero-gradient)" }} />
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
          


          
          <h1 className="mb-4 text-3xl font-bold leading-tight text-foreground md:text-5xl">
            We're all in this together!
            <br />
            Having a <span className="text-primary">Gluten-Free</span> life has never been easier
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            Whether you're newly diagnosed, a seasoned celiac, or a parent navigating GF life for your child — CeliacHub brings the community, tools, and knowledge together in one place.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto w-full max-w-5xl px-6 py-12">
        <h2 className="mb-8 text-center text-xl font-bold text-foreground md:text-2xl">
          Explore the Hub
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((cat, i) =>
          <CategoryCard key={cat.title} {...cat} delay={i * 80} />
          )}
        </div>
      </section>

      {/* Community Section */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-16">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <h2 className="mb-3 text-xl font-bold text-foreground">Built by the community, for the community</h2>
          <p className="text-muted-foreground">
            CeliacHub is a growing platform made with love by people who understand the daily challenges of living gluten-free. Sign in to save your favorites, contribute reviews, and join the conversation.
          </p>
        </div>
      </section>
    </div>);

};

export default Index;