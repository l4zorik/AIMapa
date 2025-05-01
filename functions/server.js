const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const serverless = require('serverless-http');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Inicializace Supabase klienta
const supabaseUrl = process.env.SUPABASE_URL || process.env.SUPABASE_DATABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Kontrola, zda jsou k dispozici potřebné proměnné prostředí
if (!supabaseUrl || !supabaseKey) {
  console.error('Chybí proměnné prostředí pro Supabase:');
  console.error('supabaseUrl:', supabaseUrl);
  console.error('supabaseKey:', supabaseKey ? 'Nastaveno' : 'Chybí');
  throw new Error('Supabase environment variables are missing');
}

// Vytvoření Supabase klienta
const supabase = createClient(supabaseUrl, supabaseKey);

// Kontrola, zda byl klient správně inicializován
if (!supabase) {
  throw new Error('Failed to initialize Supabase client');
}

const app = express();

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || '0267c18740cb77fe1dbc2ec1353c905b64ec40282e3d48a330826a073e64f9ff',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID || 'H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'e4uncVy8-5pqixbck29RKi1V61BT-B6G5L65dCkLR_pW_TIA8WRhVcfULycOibSW',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-zxj8pir0moo4pdk7.us.auth0.com',
  routes: {
    login: false,
    logout: false
  },
  logoutParams: {
    returnTo: process.env.AUTH0_LOGOUT_URL || process.env.AUTH0_BASE_URL || 'http://localhost:3000'
  }
};

// Middleware
app.use(auth(config));

// Synchronizuje uživatele z Auth0 do Supabase
async function syncUserWithSupabase(user) {
  if (!user) return null;

  try {
    // Zkontrolujeme, zda uživatel již existuje v Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth0_id', user.sub)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Chyba při hledání uživatele:', fetchError);
      return null;
    }

    // Pokud uživatel neexistuje, vytvoříme ho
    if (!existingUser) {
      const { data: newUser, error: insertError } = await supabase
        .from('user_profiles')
        .insert([
          {
            auth0_id: user.sub,
            email: user.email,
            name: user.name || user.nickname || user.email,
            picture: user.picture,
            last_login: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (insertError) {
        console.error('Chyba při vytváření uživatele:', insertError);
        return null;
      }

      return newUser;
    }

    // Aktualizujeme existujícího uživatele
    const { data: updatedUser, error: updateError } = await supabase
      .from('user_profiles')
      .update({
        email: user.email,
        name: user.name || user.nickname || existingUser.name,
        picture: user.picture || existingUser.picture,
        last_login: new Date().toISOString()
      })
      .eq('auth0_id', user.sub)
      .select()
      .single();

    if (updateError) {
      console.error('Chyba při aktualizaci uživatele:', updateError);
      return existingUser; // Vrátíme původního uživatele, pokud aktualizace selže
    }

    return updatedUser;
  } catch (error) {
    console.error('Neočekávaná chyba při synchronizaci uživatele:', error);
    return null;
  }
}

// Získá uživatelský profil z Supabase
async function getUserProfile(auth0Id) {
  if (!auth0Id) return null;

  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('auth0_id', auth0Id)
      .single();

    if (error) {
      console.error('Chyba při získávání uživatelského profilu:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Neočekávaná chyba při získávání uživatelského profilu:', error);
    return null;
  }
}

// Routes
app.get('/.netlify/functions/server', (req, res) => {
  res.json({ message: 'Server is running' });
});

// User profile information
app.get('/.netlify/functions/server/user', requiresAuth(), async (req, res) => {
  try {
    // Získání uživatelského profilu z Supabase
    const auth0User = req.oidc.user;
    const supabaseProfile = await getUserProfile(auth0User.sub);

    // Pokud profil existuje v Supabase, vrátíme kombinovaná data
    if (supabaseProfile) {
      res.json({
        ...auth0User,
        profile: supabaseProfile
      });
    } else {
      // Pokud profil neexistuje, vrátíme pouze Auth0 data
      res.json(auth0User);
    }
  } catch (error) {
    console.error('Chyba při získávání uživatelského profilu:', error);
    res.status(500).json({ error: 'Chyba při získávání uživatelského profilu' });
  }
});

// Callback route after authentication
app.get('/.netlify/functions/server/overeno', requiresAuth(), async (req, res) => {
  try {
    // Synchronizace uživatele s Supabase
    const user = req.oidc.user;
    await syncUserWithSupabase(user);
    console.log('Uživatel úspěšně synchronizován s Supabase');
    res.redirect('/map');
  } catch (error) {
    console.error('Chyba při synchronizaci uživatele:', error);
    res.redirect('/map');
  }
});

// Profile JSON route - returns raw user profile from Auth0
app.get('/.netlify/functions/server/profile/json', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Explicit logout route
app.get('/.netlify/functions/server/logout', (req, res) => {
  // Pokud používáme express-openid-connect, můžeme použít req.oidc.logout()
  // Tato metoda přesměruje uživatele na Auth0 logout endpoint
  const returnTo = process.env.AUTH0_LOGOUT_URL || process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  res.oidc.logout({ returnTo });
});

module.exports.handler = serverless(app);
