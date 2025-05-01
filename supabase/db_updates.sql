-- Aktualizace struktury databáze pro verzi 0.3.8.6

-- Úprava tabulky user_profiles
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS current_money NUMERIC DEFAULT 500.0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS current_xp INTEGER DEFAULT 0;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;

-- Úprava tabulky user_stats
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.user_profiles(id);
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS total_xp INTEGER DEFAULT 0;
ALTER TABLE public.user_stats ADD COLUMN IF NOT EXISTS total_rewards INTEGER DEFAULT 0;

-- Úprava tabulky tasks
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS priority INTEGER DEFAULT 1;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE;

-- Úprava tabulky rewards
ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS is_used BOOLEAN DEFAULT FALSE;
ALTER TABLE public.rewards ADD COLUMN IF NOT EXISTS used_at TIMESTAMP WITH TIME ZONE;

-- Úprava RLS politik pro tabulku user_profiles
DROP POLICY IF EXISTS "Anyone can view user profiles" ON public.user_profiles;
CREATE POLICY "Users can view only their own profile" ON public.user_profiles 
  FOR SELECT TO authenticated 
  USING (auth0_id = auth.uid()::text);

-- Úprava RLS politik pro tabulku user_stats
DROP POLICY IF EXISTS "Users can view their own stats." ON public.user_stats;
DROP POLICY IF EXISTS "Users can update their own stats." ON public.user_stats;
CREATE POLICY "Users can view their own stats." ON public.user_stats 
  FOR SELECT TO authenticated 
  USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));
CREATE POLICY "Users can update their own stats." ON public.user_stats 
  FOR UPDATE TO authenticated 
  USING (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));
CREATE POLICY "Users can insert their own stats." ON public.user_stats 
  FOR INSERT TO authenticated 
  WITH CHECK (user_id IN (SELECT id FROM public.user_profiles WHERE auth0_id = auth.uid()::text));

-- Vytvoření triggeru pro automatické vytvoření user_stats při vytvoření nového uživatele
CREATE OR REPLACE FUNCTION public.create_user_stats() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_stats (user_id, total_earnings, total_tasks, total_work_time, total_logins, total_xp, total_rewards)
  VALUES (NEW.id, 0, 0, 0, 1, 0, 0);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_user_profile_created ON public.user_profiles;
CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_stats();
