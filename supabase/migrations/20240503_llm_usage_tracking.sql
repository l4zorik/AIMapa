-- Migrace pro sledování využití LLM
-- Verze 0.3.8.7

-- Tabulka pro ukládání záznamů o využití LLM
CREATE TABLE IF NOT EXISTS llm_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  input_tokens INTEGER NOT NULL,
  output_tokens INTEGER NOT NULL,
  total_tokens INTEGER NOT NULL,
  latency INTEGER,
  cost DECIMAL(10, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexy pro rychlejší vyhledávání
  CONSTRAINT llm_usage_user_id_idx UNIQUE (id, user_id)
);

-- Vytvoření indexů
CREATE INDEX IF NOT EXISTS llm_usage_user_id_index ON llm_usage(user_id);
CREATE INDEX IF NOT EXISTS llm_usage_provider_index ON llm_usage(provider);
CREATE INDEX IF NOT EXISTS llm_usage_model_index ON llm_usage(model);
CREATE INDEX IF NOT EXISTS llm_usage_created_at_index ON llm_usage(created_at);

-- Tabulka pro ukládání agregovaných statistik využití LLM
CREATE TABLE IF NOT EXISTS llm_usage_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  request_count INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  total_tokens INTEGER NOT NULL DEFAULT 0,
  total_cost DECIMAL(10, 6) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Unikátní omezení pro kombinaci user_id, provider, model a date
  CONSTRAINT llm_usage_stats_unique UNIQUE (user_id, provider, model, date)
);

-- Vytvoření indexů
CREATE INDEX IF NOT EXISTS llm_usage_stats_user_id_index ON llm_usage_stats(user_id);
CREATE INDEX IF NOT EXISTS llm_usage_stats_provider_index ON llm_usage_stats(provider);
CREATE INDEX IF NOT EXISTS llm_usage_stats_model_index ON llm_usage_stats(model);
CREATE INDEX IF NOT EXISTS llm_usage_stats_date_index ON llm_usage_stats(date);

-- Vytvoření pohledu pro získání souhrnných statistik za uživatele
CREATE OR REPLACE VIEW user_llm_usage_summary AS
SELECT
  user_id,
  SUM(request_count) AS total_requests,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(total_tokens) AS total_tokens,
  SUM(total_cost) AS total_cost
FROM
  llm_usage_stats
GROUP BY
  user_id;

-- Vytvoření pohledu pro získání souhrnných statistik za poskytovatele
CREATE OR REPLACE VIEW provider_llm_usage_summary AS
SELECT
  provider,
  SUM(request_count) AS total_requests,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(total_tokens) AS total_tokens,
  SUM(total_cost) AS total_cost
FROM
  llm_usage_stats
GROUP BY
  provider;

-- Vytvoření pohledu pro získání souhrnných statistik za model
CREATE OR REPLACE VIEW model_llm_usage_summary AS
SELECT
  provider,
  model,
  SUM(request_count) AS total_requests,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(total_tokens) AS total_tokens,
  SUM(total_cost) AS total_cost
FROM
  llm_usage_stats
GROUP BY
  provider, model;

-- Vytvoření pohledu pro získání denních statistik
CREATE OR REPLACE VIEW daily_llm_usage_summary AS
SELECT
  date,
  SUM(request_count) AS total_requests,
  SUM(input_tokens) AS total_input_tokens,
  SUM(output_tokens) AS total_output_tokens,
  SUM(total_tokens) AS total_tokens,
  SUM(total_cost) AS total_cost
FROM
  llm_usage_stats
GROUP BY
  date
ORDER BY
  date DESC;

-- Vytvoření funkce pro získání statistik za určité období
CREATE OR REPLACE FUNCTION get_llm_usage_stats(
  p_user_id UUID,
  p_start_date DATE,
  p_end_date DATE
)
RETURNS TABLE (
  provider VARCHAR,
  model VARCHAR,
  total_requests BIGINT,
  total_input_tokens BIGINT,
  total_output_tokens BIGINT,
  total_tokens BIGINT,
  total_cost NUMERIC
)
LANGUAGE SQL
AS $$
  SELECT
    provider,
    model,
    SUM(request_count) AS total_requests,
    SUM(input_tokens) AS total_input_tokens,
    SUM(output_tokens) AS total_output_tokens,
    SUM(total_tokens) AS total_tokens,
    SUM(total_cost) AS total_cost
  FROM
    llm_usage_stats
  WHERE
    user_id = p_user_id
    AND date BETWEEN p_start_date AND p_end_date
  GROUP BY
    provider, model
  ORDER BY
    total_requests DESC;
$$;

-- Vytvoření RLS politik
ALTER TABLE llm_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_usage_stats ENABLE ROW LEVEL SECURITY;

-- Politika pro čtení vlastních záznamů
CREATE POLICY llm_usage_select_policy ON llm_usage
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politika pro vkládání vlastních záznamů
CREATE POLICY llm_usage_insert_policy ON llm_usage
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politika pro čtení vlastních statistik
CREATE POLICY llm_usage_stats_select_policy ON llm_usage_stats
  FOR SELECT
  USING (auth.uid() = user_id);

-- Politika pro vkládání vlastních statistik
CREATE POLICY llm_usage_stats_insert_policy ON llm_usage_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Politika pro aktualizaci vlastních statistik
CREATE POLICY llm_usage_stats_update_policy ON llm_usage_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Vytvoření triggeru pro aktualizaci updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_llm_usage_stats_updated_at
BEFORE UPDATE ON llm_usage_stats
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
