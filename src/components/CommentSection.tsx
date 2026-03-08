import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

const mockComments: Record<string, Comment[]> = {
  fratelli: [
    { id: "1", author: "Maya R.", text: "Amazing GF pizza — you can't even tell the difference! Staff is very aware of celiac needs.", date: "2026-02-15" },
    { id: "2", author: "Omer L.", text: "Best Italian in Netanya for celiacs. Highly recommend the GF pasta.", date: "2026-01-20" },
  ],
  kazze: [
    { id: "3", author: "Shira K.", text: "Finally a place where I can eat EVERYTHING on the menu! 100% GF heaven.", date: "2026-03-01" },
  ],
};

export function CommentSection({ restaurantId }: { restaurantId: string }) {
  const [comments, setComments] = useState<Comment[]>(mockComments[restaurantId] || []);
  const [newComment, setNewComment] = useState("");

  const addComment = () => {
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      {
        id: Date.now().toString(),
        author: "You",
        text: newComment.trim(),
        date: new Date().toISOString().split("T")[0],
      },
    ]);
    setNewComment("");
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/50 p-4">
      {comments.length === 0 && (
        <p className="text-sm text-muted-foreground">No comments yet. Be the first to share your experience!</p>
      )}
      {comments.map((c) => (
        <div key={c.id} className="rounded-md bg-background p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">{c.author}</span>
            <span>{c.date}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/90">{c.text}</p>
        </div>
      ))}
      <div className="flex gap-2">
        <Textarea
          placeholder="Share your experience..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="min-h-[60px] flex-1"
        />
        <Button onClick={addComment} className="self-end">Post</Button>
      </div>
    </div>
  );
}
