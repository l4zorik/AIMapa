-- Vytvoření tabulky pro logování LLM API komunikace
CREATE TABLE IF NOT EXISTS llm_api_logs (
  id SERIAL PRIMARY KEY,
  request_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  user_id TEXT,
  conversation_id TEXT,
  prompt TEXT,
  prompt_length INTEGER,
  response TEXT,
  response_length INTEGER,
  usage JSONB,
  latency INTEGER,
  cost NUMERIC(10, 6),
  from_cache BOOLEAN,
  error_message TEXT,
  error_stack TEXT,
  error_code TEXT,
  options JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexy pro rychlejší vyhledávání
CREATE INDEX IF NOT EXISTS llm_api_logs_request_id_idx ON llm_api_logs (request_id);
CREATE INDEX IF NOT EXISTS llm_api_logs_user_id_idx ON llm_api_logs (user_id);
CREATE INDEX IF NOT EXISTS llm_api_logs_conversation_id_idx ON llm_api_logs (conversation_id);
CREATE INDEX IF NOT EXISTS llm_api_logs_timestamp_idx ON llm_api_logs (timestamp);
CREATE INDEX IF NOT EXISTS llm_api_logs_provider_model_idx ON llm_api_logs (provider, model);

-- Nastavení Row Level Security (RLS)
ALTER TABLE llm_api_logs ENABLE ROW LEVEL SECURITY;

-- Politika pro administrátory - plný přístup
CREATE POLICY admin_policy ON llm_api_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (
    SELECT auth.uid() FROM auth.users
    WHERE auth.uid() IN (SELECT user_id FROM user_roles WHERE role = 'admin')
  ));

-- Politika pro uživatele - pouze čtení vlastních logů
CREATE POLICY user_select_policy ON llm_api_logs
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Funkce pro získání statistik využití LLM API
CREATE OR REPLACE FUNCTION get_llm_api_stats(
  p_user_id TEXT DEFAULT NULL,
  p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
  provider TEXT,
  model TEXT,
  total_requests BIGINT,
  total_responses BIGINT,
  total_errors BIGINT,
  total_cost NUMERIC(12, 6),
  average_latency NUMERIC(10, 2),
  total_tokens BIGINT,
  total_prompt_tokens BIGINT,
  total_completion_tokens BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH response_stats AS (
    SELECT
      provider,
      model,
      COUNT(*) FILTER (WHERE type = 'request') AS requests,
      COUNT(*) FILTER (WHERE type = 'response') AS responses,
      COUNT(*) FILTER (WHERE type = 'error') AS errors,
      SUM(cost) AS total_cost,
      AVG(latency) FILTER (WHERE type = 'response') AS avg_latency,
      SUM((usage->>'total_tokens')::INTEGER) FILTER (WHERE type = 'response') AS tokens,
      SUM((usage->>'prompt_tokens')::INTEGER) FILTER (WHERE type = 'response') AS prompt_tokens,
      SUM((usage->>'completion_tokens')::INTEGER) FILTER (WHERE type = 'response') AS completion_tokens
    FROM llm_api_logs
    WHERE
      (p_user_id IS NULL OR user_id = p_user_id) AND
      (p_start_date IS NULL OR timestamp >= p_start_date) AND
      (p_end_date IS NULL OR timestamp <= p_end_date)
    GROUP BY provider, model
  )
  SELECT
    provider,
    model,
    requests AS total_requests,
    responses AS total_responses,
    errors AS total_errors,
    COALESCE(total_cost, 0) AS total_cost,
    COALESCE(avg_latency, 0) AS average_latency,
    COALESCE(tokens, 0) AS total_tokens,
    COALESCE(prompt_tokens, 0) AS total_prompt_tokens,
    COALESCE(completion_tokens, 0) AS total_completion_tokens
  FROM response_stats
  ORDER BY total_cost DESC;
END;
$$;
