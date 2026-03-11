import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const TERMS_ACCEPTED_KEY = "celiachub_terms_accepted";

export function TermsBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(TERMS_ACCEPTED_KEY)) {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleAccept = () => {
    localStorage.setItem(TERMS_ACCEPTED_KEY, "1");
    setVisible(false);
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t bg-card/95 backdrop-blur-sm px-4 py-4 shadow-lg animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
        <p className="text-sm text-muted-foreground flex-1">
          Welcome to <strong className="text-foreground">CeliacHub</strong> (Academic Demo). By using this site, you
          acknowledge that this is a student project and the data is for demonstration only.
        </p>
        <Button onClick={handleAccept} size="sm" className="shrink-0">
          I Understand
        </Button>
      </div>
    </div>
  );
}
