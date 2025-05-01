-- Vytvoření tabulky pro uživatelské profily
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT,
  picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vytvoření Row Level Security (RLS) politik
-- Povolení čtení pro všechny autentizované uživatele (pro zjednodušení)
CREATE POLICY "Anyone can view user profiles" ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Povolení aktualizace pouze vlastních dat (pro budoucí použití)
CREATE POLICY "Users can update only their own profile" ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth0_id = current_user);

-- Povolení vkládání dat pro všechny autentizované uživatele
CREATE POLICY "Authenticated users can insert profiles" ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Povolení mazání pouze vlastních dat (pro budoucí použití)
CREATE POLICY "Users can delete only their own profile" ON public.user_profiles
  FOR DELETE
  TO authenticated
  USING (auth0_id = current_user);

-- Povolení čtení dat pro server (pro synchronizaci)
CREATE POLICY "Server can read all profiles" ON public.user_profiles
  FOR SELECT
  TO anon
  USING (true);

-- Povolení aktualizace dat pro server (pro synchronizaci)
CREATE POLICY "Server can update all profiles" ON public.user_profiles
  FOR UPDATE
  TO anon
  USING (true);

-- Povolení vkládání dat pro server (pro synchronizaci)
CREATE POLICY "Server can insert profiles" ON public.user_profiles
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Zapnutí Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Vytvoření funkce pro automatickou aktualizaci updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Vytvoření triggeru pro automatickou aktualizaci updated_at
CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
