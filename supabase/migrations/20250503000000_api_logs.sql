-- Create API logs table
CREATE TABLE api_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    timestamp timestamptz NOT NULL,
    method text NOT NULL,
    path text NOT NULL,
    query jsonb,
    headers jsonb,
    user_id text REFERENCES auth.users(id),
    ip text,
    user_agent text,
    response_time integer,
    status_code integer,
    response_size integer,
    created_at timestamptz DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX idx_api_logs_timestamp ON api_logs(timestamp);
CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_path ON api_logs(path);

-- Set up RLS policies
ALTER TABLE api_logs ENABLE ROW LEVEL SECURITY;

-- Only admins and moderators can view logs
CREATE POLICY "Admins and moderators can view logs" ON api_logs
    FOR SELECT
    USING (
        auth.uid() IN (
            SELECT id FROM auth.users
            WHERE raw_user_meta_data->>'role' IN ('admin', 'moderator')
        )
    );

-- System can insert logs
CREATE POLICY "System can insert logs" ON api_logs
    FOR INSERT
    WITH CHECK (true);

-- Create view for basic metrics
CREATE VIEW api_metrics AS
SELECT 
    date_trunc('hour', timestamp) as time_bucket,
    path,
    method,
    COUNT(*) as request_count,
    AVG(response_time) as avg_response_time,
    MAX(response_time) as max_response_time,
    MIN(response_time) as min_response_time,
    AVG(response_size) as avg_response_size,
    COUNT(DISTINCT user_id) as unique_users
FROM api_logs
GROUP BY date_trunc('hour', timestamp), path, method;