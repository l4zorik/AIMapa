/**
 * Auth0 bundle
 * Verze 0.3.8.7
 */

import { createAuth0Client } from '@auth0/auth0-spa-js';

// Konfigurace Auth0
const config = {
  domain: process.env.AUTH0_DOMAIN || 'dev-zxj8pir0moo4pdk7.us.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'your-client-id',
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email'
  }
};

// Inicializace Auth0 klienta
async function initAuth0() {
  try {
    const auth0 = await createAuth0Client(config);
    return auth0;
  } catch (error) {
    console.error('Chyba při inicializaci Auth0:', error);
    throw error;
  }
}

// Export pro Webpack
export default {
  initAuth0
};
