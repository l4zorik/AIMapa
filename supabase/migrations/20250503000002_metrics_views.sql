-- Vytvoření materializovaného pohledu pro API metriky
CREATE MATERIALIZED VIEW api_metrics_hourly AS
SELECT
    date_trunc('hour', timestamp) as time_bucket,
    COUNT(*) as request_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(CASE 
        WHEN response_time > 0 THEN response_time 
        ELSE NULL 
    END) as avg_response_time,
    COUNT(CASE 
        WHEN status_code >= 400 THEN 1 
        ELSE NULL 
    END)::float / COUNT(*) * 100 as error_rate,
    path
FROM api_logs
GROUP BY date_trunc('hour', timestamp), path;

-- Vytvoření indexů pro optimalizaci dotazů
CREATE INDEX idx_api_metrics_hourly_time ON api_metrics_hourly(time_bucket DESC);
CREATE INDEX idx_api_metrics_hourly_path ON api_metrics_hourly(path);

-- Vytvoření funkce pro obnovení materializovaného pohledu
CREATE OR REPLACE FUNCTION refresh_api_metrics()
RETURNS trigger AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY api_metrics_hourly;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Vytvoření triggeru pro automatické obnovení pohledu
CREATE TRIGGER refresh_api_metrics_trigger
AFTER INSERT OR UPDATE OR DELETE ON api_logs
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_api_metrics();

-- Vytvoření pohledu pro user activity
CREATE VIEW user_activity_daily AS
SELECT
    date_trunc('day', timestamp) as day,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(*) as total_actions,
    COUNT(DISTINCT path) as unique_endpoints,
    COUNT(CASE 
        WHEN status_code >= 400 THEN 1 
        ELSE NULL 
    END) as errors
FROM api_logs
GROUP BY date_trunc('day', timestamp);

-- Vytvoření pohledu pro routes metriky
CREATE VIEW route_metrics AS
SELECT
    r.user_id,
    COUNT(*) as total_routes,
    COUNT(CASE WHEN r.is_public THEN 1 ELSE NULL END) as public_routes,
    MAX(r.created_at) as last_route_created,
    COUNT(DISTINCT rp.id) as total_points,
    AVG(r.distance) as avg_route_distance
FROM routes r
LEFT JOIN route_points rp ON r.id = rp.route_id
GROUP BY r.user_id;

-- Pohled pro monitoring výkonu API
CREATE VIEW api_performance AS
SELECT
    path,
    method,
    COUNT(*) as calls,
    AVG(response_time) as avg_response_time,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time) as p95_response_time,
    COUNT(CASE WHEN status_code >= 400 THEN 1 END) as errors,
    COUNT(DISTINCT user_id) as unique_users
FROM api_logs
WHERE timestamp > NOW() - INTERVAL '24 hours'
GROUP BY path, method;

-- Přidání pomocných funkcí pro Admin Dashboard
CREATE OR REPLACE FUNCTION get_dashboard_metrics(
    time_range interval DEFAULT '24 hours'::interval
)
RETURNS TABLE (
    metric_name text,
    metric_value jsonb
) AS $$
BEGIN
    RETURN QUERY
    
    -- Celkové metriky
    SELECT 'total_users', to_jsonb(COUNT(*)) 
    FROM users
    UNION ALL
    SELECT 'active_users', to_jsonb(COUNT(DISTINCT user_id))
    FROM api_logs 
    WHERE timestamp > NOW() - time_range
    UNION ALL
    SELECT 'total_routes', to_jsonb(COUNT(*))
    FROM routes
    UNION ALL
    SELECT 'api_calls', to_jsonb(COUNT(*))
    FROM api_logs
    WHERE timestamp > NOW() - time_range
    UNION ALL
    
    -- Error rate
    SELECT 'error_rate', to_jsonb(
        ROUND(
            (COUNT(CASE WHEN status_code >= 400 THEN 1 END)::float / 
            NULLIF(COUNT(*), 0) * 100)::numeric, 
            2
        )
    )
    FROM api_logs
    WHERE timestamp > NOW() - time_range
    UNION ALL
    
    -- Popular endpoints
    SELECT 'popular_endpoints', to_jsonb(
        array_agg(row_to_json(popular_endpoints))
    )
    FROM (
        SELECT path, COUNT(*) as calls
        FROM api_logs
        WHERE timestamp > NOW() - time_range
        GROUP BY path
        ORDER BY COUNT(*) DESC
        LIMIT 5
    ) popular_endpoints;
END;
$$ LANGUAGE plpgsql;