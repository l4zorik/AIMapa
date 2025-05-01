const express = require('express');
const { auth, requiresAuth } = require('express-openid-connect');
const serverless = require('serverless-http');
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Inicializace Supabase klienta
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a long, randomly-generated string stored in env',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3000',
  clientID: process.env.AUTH0_CLIENT_ID || 'H6ISWfg3rYoJbCFucezi0wzi5kLnfoTZ',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-zxj8pir0moo4pdk7.us.auth0.com'
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

module.exports.handler = serverless(app);
