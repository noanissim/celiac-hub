
-- 1. Fix profiles: replace broad public SELECT with a restricted policy using column-level security via a view
-- Drop the overly broad public SELECT policy
DROP POLICY "Profiles are publicly readable for display" ON public.profiles;

-- Create a policy that lets everyone read only their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Create a security definer function to fetch display-safe profile info (for reviews etc.)
CREATE OR REPLACE FUNCTION public.get_display_profiles(user_ids uuid[])
RETURNS TABLE(id uuid, display_name text, avatar_url text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p.id, p.display_name, p.avatar_url
  FROM public.profiles p
  WHERE p.id = ANY(user_ids);
$$;

-- 2. Add review content length constraint
ALTER TABLE public.reviews
  ADD CONSTRAINT review_content_length CHECK (char_length(content) <= 2000);
