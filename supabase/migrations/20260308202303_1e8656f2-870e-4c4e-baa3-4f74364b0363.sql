
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source_name TEXT NOT NULL,
  source_logo_url TEXT,
  source_url TEXT NOT NULL,
  prep_time TEXT,
  cook_time TEXT,
  servings TEXT,
  difficulty TEXT DEFAULT 'easy',
  tags TEXT[] DEFAULT '{}',
  category TEXT NOT NULL DEFAULT 'main',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are publicly readable" ON public.recipes
  FOR SELECT USING (true);
