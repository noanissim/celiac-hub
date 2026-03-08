CREATE UNIQUE INDEX IF NOT EXISTS restaurants_name_city_unique ON public.restaurants (name, city);
CREATE UNIQUE INDEX IF NOT EXISTS articles_title_unique ON public.articles (title);