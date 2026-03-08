import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReviews, useAddReview } from "@/hooks/useReviews";
import { toast } from "sonner";

export function CommentSection({ restaurantId }: { restaurantId: string }) {
  const { user, profile } = useAuth();
  const { data: reviews = [], isLoading } = useReviews(restaurantId);
  const { mutate: addReview, isPending } = useAddReview();
  const [newComment, setNewComment] = useState("");
  const [rating, setRating] = useState(0);
  const MAX_REVIEW_LENGTH = 2000;

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    if (!user) {
      toast("Please sign in to post a review 💛");
      return;
    }
    addReview(
      { userId: user.id, restaurantId, content: newComment.trim(), rating: rating || undefined },
      {
        onSuccess: () => {
          setNewComment("");
          setRating(0);
          toast.success("Review posted!");
        },
      }
    );
  };

  return (
    <div className="space-y-4 rounded-xl border bg-muted/30 p-4">
      <h4 className="text-sm font-semibold text-foreground">Community Reviews</h4>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">No reviews yet. Be the first to share your experience!</p>
      )}

      {reviews.map((r) => (
        <div key={r.id} className="flex gap-3 rounded-lg bg-background p-3">
          <Avatar className="h-8 w-8 shrink-0">
            {r.avatarUrl && <AvatarImage src={r.avatarUrl} />}
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {r.displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{r.displayName}</span>
              <span>{new Date(r.createdAt).toLocaleDateString()}</span>
            </div>
            {r.rating && (
              <div className="flex gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-3 w-3 ${s <= r.rating! ? "fill-accent text-accent" : "text-muted"}`} />
                ))}
              </div>
            )}
            <p className="mt-1 text-sm text-foreground/90">{r.content}</p>
          </div>
        </div>
      ))}

      {/* Input area - only for logged in users */}
      {user ? (
        <div className="space-y-2 border-t pt-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rating:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s === rating ? 0 : s)} className="p-0.5">
                  <Star className={`h-4 w-4 transition-colors ${s <= rating ? "fill-accent text-accent" : "text-muted-foreground hover:text-accent"}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Textarea
              placeholder="Share your experience..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[60px] flex-1"
            />
            <Button onClick={handleSubmit} disabled={isPending || !newComment.trim()} className="self-end">
              {isPending ? "..." : "Post"}
            </Button>
          </div>
        </div>
      ) : (
        <p className="border-t pt-3 text-center text-sm text-muted-foreground">
          Sign in to share your review 💛
        </p>
      )}
    </div>
  );
}
