import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useIsFavorited, useToggleFavorite, type ItemType } from "@/hooks/useFavorites";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  itemId: string;
  itemType: ItemType;
  className?: string;
}

export function FavoriteButton({ itemId, itemType, className }: FavoriteButtonProps) {
  const { user } = useAuth();
  const isFavorited = useIsFavorited(user?.id, itemId, itemType);
  const { mutate: toggle, isPending } = useToggleFavorite();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast("Please sign in to save favorites 💛", {
        description: "Use the Sign In button in the top right corner.",
      });
      return;
    }
    toggle({ userId: user.id, itemId, itemType, isFavorited });
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("shrink-0 transition-transform hover:scale-110", className)}
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-all duration-200",
          isFavorited ? "fill-destructive text-destructive scale-110" : "text-muted-foreground"
        )}
      />
    </Button>
  );
}
