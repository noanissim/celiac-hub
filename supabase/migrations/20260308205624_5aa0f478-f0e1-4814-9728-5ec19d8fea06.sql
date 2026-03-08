
CREATE POLICY "Profiles are publicly readable for display" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
