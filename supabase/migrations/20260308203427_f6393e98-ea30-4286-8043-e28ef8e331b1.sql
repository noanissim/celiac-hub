
-- Create recipes table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('breakfast', 'main', 'dessert', 'snack', 'salad', 'soup')),
  source_name TEXT,
  source_url TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'recipes' AND policyname = 'Recipes are publicly readable'
  ) THEN
    CREATE POLICY "Recipes are publicly readable" ON public.recipes FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_recipes_updated_at'
  ) THEN
    CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- Delete all existing fake recipes
DELETE FROM public.recipes;

-- Insert real recipes from Oogio.net (GF category)
INSERT INTO public.recipes (title, description, category, source_name, source_url, difficulty, tags) VALUES
('עוגיות שוקולד צ׳יפס קלות ב-10 דקות עבודה', 'עוגיות שוקולד צ׳יפס פשוטות וטעימות ללא גלוטן שמכינים ב-10 דקות עבודה בלבד', 'dessert', 'Oogio.net', 'https://www.oogio.net/easy_chocolate_chip_cookies/', 'easy', ARRAY['ללא גלוטן', 'עוגיות', 'שוקולד']),
('עוגת סינבון – עוגת קינמון רכה בחושה', 'עוגת קינמון רכה ובחושה בהשראת סינבון, ללא גלוטן', 'dessert', 'Oogio.net', 'https://www.oogio.net/cinnabon_cake/', 'easy', ARRAY['ללא גלוטן', 'עוגות', 'קינמון']),
('בראוניז מ-5 מצרכים', 'בראוניז שוקולד עשירים מ-5 מצרכים בלבד, ללא גלוטן', 'dessert', 'Oogio.net', 'https://www.oogio.net/5-ingredients-brownies/', 'easy', ARRAY['ללא גלוטן', 'בראוניז', 'שוקולד']),
('עוגת שוקולד טבעונית', 'עוגת שוקולד טבעונית וללא גלוטן, רכה ועשירה', 'dessert', 'Oogio.net', 'https://www.oogio.net/vegan_chocolate_cake/', 'easy', ARRAY['ללא גלוטן', 'טבעוני', 'שוקולד']),
('עוגיות שקדים ממכרות', 'עוגיות שקדים פריכות וממכרות ללא גלוטן', 'dessert', 'Oogio.net', 'https://www.oogio.net/dangerous_almond_cookies/', 'easy', ARRAY['ללא גלוטן', 'עוגיות', 'שקדים']),
('טארט מוס שוקולד עם טופי קרמל פקאן', 'טארט מוס שוקולד מפנק עם טופי קרמל ופקאן, ללא גלוטן', 'dessert', 'Oogio.net', 'https://www.oogio.net/pecan_caramel_chocolate_mousse_tart/', 'medium', ARRAY['ללא גלוטן', 'טארט', 'שוקולד']),
('פאדג׳ בראוניז שלושה שוקולדים', 'בראוניז שוקולד עשירים במיוחד עם שלושה סוגי שוקולד', 'dessert', 'Oogio.net', 'https://www.oogio.net/ultra_fudge_brownies/', 'medium', ARRAY['ללא גלוטן', 'בראוניז', 'שוקולד']),
('מאפינס בטטה וגבינה לפעוטות', 'מאפינס בריאים מבטטה וגבינה, מושלמים לפעוטות וללא גלוטן', 'snack', 'Oogio.net', 'https://www.oogio.net/sweet_potato_cheese_muffins/', 'easy', ARRAY['ללא גלוטן', 'מאפינס', 'ילדים']);

-- Insert real recipes from Essy Roz
INSERT INTO public.recipes (title, description, category, source_name, source_url, difficulty, tags) VALUES
('קרקר עדשים כתומות בטוסטר', 'קרקר עדשים טבעוני ומושלם שמכינים בטוסטר ביתי, מהיר ומזין', 'snack', 'Essy Roz', 'https://www.essyroz.com/orange-lentil-cracker-in-the-toaster/', 'easy', ARRAY['ללא גלוטן', 'טבעוני', 'עדשים']),
('עוגיית שוקולד צ׳יפס בשלוש דרכי הכנה', 'עוגיות שוקולד צ׳יפס מושלמות בשלוש דרכי הכנה שונות, ללא גלוטן', 'dessert', 'Essy Roz', 'https://www.essyroz.com/chocolate-chip-cookie-in-three-ways-of-preparation/', 'easy', ARRAY['ללא גלוטן', 'עוגיות', 'שוקולד']),
('לחמניית שקדים בשתי דקות', 'לחמנייה מהירה מקמח שקדים שמוכנה בשתי דקות, ללא גלוטן', 'breakfast', 'Essy Roz', 'https://www.essyroz.com/almond-bun-in-two-minutes/', 'easy', ARRAY['ללא גלוטן', 'לחם', 'שקדים']),
('טורטיית טחינה מהירה', 'טורטייה מטחינה שמוכנה בפחות מחמש דקות, ללא גלוטן', 'main', 'Essy Roz', 'https://www.essyroz.com/quick-tahini-tortilla/', 'easy', ARRAY['ללא גלוטן', 'טורטייה', 'טחינה']),
('פיצה קוטג׳', 'פיצה עסיסית וטעימה עם בצק קוטג׳ ללא גלוטן', 'main', 'Essy Roz', 'https://www.essyroz.com/cottage-pizza/', 'easy', ARRAY['ללא גלוטן', 'פיצה', 'קוטג׳']),
('כדורי שוקולד ללא גלוטן עם קוקוס', 'כדורי שוקולד רכים ונימוחים עם קוקוס, מ-5 מצרכים', 'dessert', 'Essy Roz', 'https://www.essyroz.com/gluten-free-chocolate-balls-with-coconut/', 'easy', ARRAY['ללא גלוטן', 'שוקולד', 'קוקוס']),
('לחם עדשים כתומות ושמחה בלב', 'לחם עדשים כתומות אגדי וללא גלוטן', 'main', 'Essy Roz', 'https://www.essyroz.com/gluten-free-lentils-bread/', 'easy', ARRAY['ללא גלוטן', 'לחם', 'עדשים']),
('סוכריות פנקייק בננה', 'פנקייק בננה בגודל ביס, מושלם לילדים וללא גלוטן', 'breakfast', 'Essy Roz', 'https://www.essyroz.com/banana-pancake-candy/', 'easy', ARRAY['ללא גלוטן', 'פנקייק', 'בננה']);
