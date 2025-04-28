/**
 * Auth0 SPA JS Bundle
 * Verze 0.3.8.5
 * 
 * Tento soubor importuje Auth0 SPA JS knihovnu a exportuje ji jako globální proměnnou auth0
 */

// Importujeme Auth0 SPA JS knihovnu
import { createAuth0Client } from '@auth0/auth0-spa-js';

// Exportujeme ji jako globální proměnnou
window.auth0 = { createAuth0Client };

console.log('Auth0 SPA JS knihovna byla úspěšně načtena');
