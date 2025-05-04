-- Vytvoření tabulky pro uživatelské role
CREATE TABLE user_roles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    auth0_id text NOT NULL UNIQUE REFERENCES auth.users(id),
    roles jsonb DEFAULT '["user"]'::jsonb,
    permissions jsonb DEFAULT '["read:content", "write:own", "delete:own"]'::jsonb,
    last_login timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Vytvoření indexů pro rychlejší vyhledávání
CREATE INDEX idx_user_roles_auth0_id ON user_roles(auth0_id);
CREATE INDEX idx_user_roles_roles ON user_roles USING gin(roles);

-- Nastavení RLS politik
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Uživatelé mohou číst své vlastní role
CREATE POLICY "Users can read their own roles" ON user_roles
    FOR SELECT
    USING (auth.uid() = auth0_id);

-- Pouze admin může číst role ostatních uživatelů
CREATE POLICY "Admins can read all roles" ON user_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.uid() = id
            AND raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Systém může aktualizovat role
CREATE POLICY "System can update roles" ON user_roles
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Funkce pro aktualizaci timestamp při změně
CREATE OR REPLACE FUNCTION update_user_roles_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pro aktualizaci timestamp
CREATE TRIGGER update_user_roles_timestamp
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_roles_timestamp();

-- Funkce pro kontrolu oprávnění
CREATE OR REPLACE FUNCTION check_user_permission(user_id text, required_permission text)
RETURNS boolean AS $$
DECLARE
    user_perms jsonb;
BEGIN
    SELECT permissions INTO user_perms
    FROM user_roles
    WHERE auth0_id = user_id;

    RETURN (user_perms ? required_permission) OR 
           (user_perms ? 'write:all') OR 
           EXISTS (
               SELECT 1 FROM auth.users
               WHERE id = user_id
               AND raw_user_meta_data->>'role' = 'admin'
           );
END;
$$ LANGUAGE plpgsql;