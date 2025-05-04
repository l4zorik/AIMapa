-- Create API keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id text REFERENCES auth.users(id),
    key text NOT NULL,
    description text,
    created_at timestamptz DEFAULT now()
);

-- Add index for user_id
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);

-- Enable row level security
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own keys
CREATE POLICY "Users can manage their own keys" ON api_keys
    FOR ALL
    USING (auth.uid() = user_id);
