-- Vytvoření tabulek pro AIMapa verze 0.3.8.5

-- Tabulka uživatelů
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    auth0_id TEXT UNIQUE,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    avatar_url TEXT,
    level INTEGER DEFAULT 1,
    xp INTEGER DEFAULT 0,
    xp_to_next_level INTEGER DEFAULT 100,
    balance DECIMAL DEFAULT 500,
    currency TEXT DEFAULT 'CZK',
    bitcoin DECIMAL DEFAULT 0.05,
    subscription_plan TEXT DEFAULT 'free',
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE,
    subscription_auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka statistik uživatelů
CREATE TABLE IF NOT EXISTS public.user_stats (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tasks_completed INTEGER DEFAULT 0,
    distance_traveled DECIMAL DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    money_earned DECIMAL DEFAULT 0,
    money_spent DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka nastavení uživatelů
CREATE TABLE IF NOT EXISTS public.user_settings (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    dark_mode BOOLEAN DEFAULT TRUE,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    sound_enabled BOOLEAN DEFAULT TRUE,
    language TEXT DEFAULT 'cs',
    marker_style TEXT DEFAULT 'circle',
    marker_effects BOOLEAN DEFAULT TRUE,
    ai_api TEXT DEFAULT 'openai',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka achievementů uživatelů
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka bodů na mapě
CREATE TABLE IF NOT EXISTS public.map_points (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    icon TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka tras
CREATE TABLE IF NOT EXISTS public.routes (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    distance DECIMAL,
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka bodů tras
CREATE TABLE IF NOT EXISTS public.route_points (
    id SERIAL PRIMARY KEY,
    route_id INTEGER REFERENCES public.routes(id) ON DELETE CASCADE,
    order_index INTEGER NOT NULL,
    latitude DECIMAL NOT NULL,
    longitude DECIMAL NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka virtuální práce
CREATE TABLE IF NOT EXISTS public.virtual_work (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'in_progress',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    duration INTEGER,
    reward DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka úkolů virtuální práce
CREATE TABLE IF NOT EXISTS public.virtual_work_tasks (
    id SERIAL PRIMARY KEY,
    virtual_work_id INTEGER REFERENCES public.virtual_work(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka předplatných
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT DEFAULT 'active',
    auto_renew BOOLEAN DEFAULT TRUE,
    stripe_subscription_id TEXT,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka zákazníků Stripe
CREATE TABLE IF NOT EXISTS public.stripe_customers (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka historie plateb
CREATE TABLE IF NOT EXISTS public.payment_history (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    stripe_invoice_id TEXT,
    stripe_payment_intent_id TEXT,
    amount DECIMAL NOT NULL,
    currency TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka denních úkolů
CREATE TABLE IF NOT EXISTS public.daily_quests (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    reward_xp INTEGER NOT NULL,
    reward_money DECIMAL NOT NULL,
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka odměn
CREATE TABLE IF NOT EXISTS public.rewards (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cost DECIMAL NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabulka zpětné vazby
CREATE TABLE IF NOT EXISTS public.feedback (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vytvoření Row Level Security (RLS) politik
-- Povolení čtení vlastních dat pro přihlášené uživatele
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Povolení aktualizace vlastních dat pro přihlášené uživatele
CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Podobné politiky pro ostatní tabulky
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stats" ON public.user_stats
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own stats" ON public.user_stats
    FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own settings" ON public.user_settings
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.user_settings
    FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own achievements" ON public.user_achievements
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

ALTER TABLE public.map_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own map points" ON public.map_points
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own map points" ON public.map_points
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own map points" ON public.map_points
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own map points" ON public.map_points
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own routes" ON public.routes
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own routes" ON public.routes
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own routes" ON public.routes
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own routes" ON public.routes
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.route_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own route points" ON public.route_points
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.routes
            WHERE routes.id = route_points.route_id
            AND routes.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert their own route points" ON public.route_points
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.routes
            WHERE routes.id = route_points.route_id
            AND routes.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update their own route points" ON public.route_points
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.routes
            WHERE routes.id = route_points.route_id
            AND routes.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete their own route points" ON public.route_points
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.routes
            WHERE routes.id = route_points.route_id
            AND routes.user_id = auth.uid()
        )
    );

ALTER TABLE public.virtual_work ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own virtual work" ON public.virtual_work
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own virtual work" ON public.virtual_work
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own virtual work" ON public.virtual_work
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own virtual work" ON public.virtual_work
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.virtual_work_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own virtual work tasks" ON public.virtual_work_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.virtual_work
            WHERE virtual_work.id = virtual_work_tasks.virtual_work_id
            AND virtual_work.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can insert their own virtual work tasks" ON public.virtual_work_tasks
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.virtual_work
            WHERE virtual_work.id = virtual_work_tasks.virtual_work_id
            AND virtual_work.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can update their own virtual work tasks" ON public.virtual_work_tasks
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.virtual_work
            WHERE virtual_work.id = virtual_work_tasks.virtual_work_id
            AND virtual_work.user_id = auth.uid()
        )
    );
CREATE POLICY "Users can delete their own virtual work tasks" ON public.virtual_work_tasks
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.virtual_work
            WHERE virtual_work.id = virtual_work_tasks.virtual_work_id
            AND virtual_work.user_id = auth.uid()
        )
    );

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own subscriptions" ON public.subscriptions
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
    FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.stripe_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own stripe customers" ON public.stripe_customers
    FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.payment_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own payment history" ON public.payment_history
    FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own daily quests" ON public.daily_quests
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own daily quests" ON public.daily_quests
    FOR UPDATE USING (auth.uid() = user_id);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own rewards" ON public.rewards
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own rewards" ON public.rewards
    FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own rewards" ON public.rewards
    FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rewards" ON public.rewards
    FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own feedback" ON public.feedback
    FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own feedback" ON public.feedback
    FOR INSERT WITH CHECK (auth.uid() = user_id);
