-- Vytvoření tabulky users pro ukládání uživatelů z Auth0
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth0_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  name TEXT,
  picture TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_metadata JSONB DEFAULT '{}'::JSONB,
  app_metadata JSONB DEFAULT '{}'::JSONB
);

-- Vytvoření indexů pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS idx_users_auth0_id ON public.users(auth0_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Nastavení Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Vytvoření policy pro přístup k vlastním datům
CREATE POLICY "Users can view their own data" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Vytvoření funkce pro aktualizaci updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Vytvoření triggeru pro aktualizaci updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
