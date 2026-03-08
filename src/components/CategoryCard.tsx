import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  url: string;
  delay?: number;
}

export function CategoryCard({ title, description, icon: Icon, url, delay = 0 }: CategoryCardProps) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(url)}
      className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/30 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </button>
  );
}
