const express = require('express');
const path = require('path');
const { auth, requiresAuth } = require('express-openid-connect');
require('dotenv').config();
const { syncUserWithSupabase, getUserProfile } = require('./utils/userManager');

const app = express();
const port = process.env.PORT || 3000;

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
    logout: false,
    callback: '/callback'
  },
  authorizationParams: {
    response_type: 'code',
    response_mode: 'query',
    scope: 'openid profile email'
  },
  logoutParams: {
    returnTo: process.env.AUTH0_LOGOUT_URL || process.env.AUTH0_BASE_URL || 'http://localhost:3000'
  }
};

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(auth(config));

// Routes
app.get('/', (req, res) => {
  res.redirect('/map');
});

// Map route - protected by authentication
app.get('/map', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// User profile information
app.get('/user', requiresAuth(), async (req, res) => {
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

// Callback route for Auth0
app.get('/callback', (req, res) => {
  // Tato cesta je automaticky zpracována Auth0 middleware
  // Není potřeba zde nic dělat, middleware se postará o zpracování callbacku
  console.log('Auth0 callback received');
});

// Callback route after authentication
app.get('/overeno', requiresAuth(), async (req, res) => {
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
app.get('/profile/json', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Profile HTML route - displays user profile page
app.get('/profile', requiresAuth(), (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'profile.html'));
});

// Explicit logout route
app.get('/logout', (req, res) => {
  const returnTo = process.env.AUTH0_LOGOUT_URL || process.env.AUTH0_BASE_URL || 'http://localhost:3000';
  res.oidc.logout({ returnTo });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
