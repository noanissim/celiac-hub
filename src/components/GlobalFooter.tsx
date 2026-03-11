import { Link } from "react-router-dom";

export function GlobalFooter() {
  return (
    <footer className="border-t bg-muted/40 px-6 py-6 text-center text-xs text-muted-foreground">
      <p className="mb-1">
        This is an academic project and a Proof of Concept (POC) developed for educational purposes only.
        The information provided is not verified and should not be relied upon.
      </p>
      <p className="mb-2" dir="rtl">
        זהו פרויקט אקדמי והוכחת היתכנות (POC) שפותח למטרות לימודיות בלבד. המידע המוצג אינו מאומת ואין להסתמך עליו.
      </p>
      <Link to="/legal" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">
        Legal Disclaimer / הצהרה משפטית
      </Link>
    </footer>
  );
}
