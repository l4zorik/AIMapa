/**
 * Nástroj pro výpis všech dostupných endpointů v Express aplikaci
 */

// Předpokládá se, že máte již vytvořenou Express aplikaci v server.js
const app = require('./server');

// Funkce pro výpis všech registrovaných cest
function listRoutes() {
  console.log('=== SEZNAM VŠECH DOSTUPNÝCH ENDPOINTŮ ===');
  
  // Získání všech registrovaných cest
  const routes = [];
  
  // Procházení všech vrstev aplikace
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      // Cesty přímo v aplikaci
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods).join(', ').toUpperCase()
      });
    } else if (middleware.name === 'router') {
      // Cesty v podřazených routerech
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = handler.route.path;
          const baseUrl = middleware.regexp.toString()
            .replace('\\^', '')
            .replace('\\/?(?=\\/|$)', '')
            .replace(/\\\//g, '/');
          
          const fullPath = baseUrl.replace(/\(\?:\(\[\^\\\/\]\+\?\)\)/g, ':param') + path;
          
          routes.push({
            path: fullPath,
            methods: Object.keys(handler.route.methods).join(', ').toUpperCase()
          });
        }
      });
    }
  });

  // Výpis cest
  routes.forEach((route) => {
    console.log(`${route.methods} ${route.path}`);
  });
  
  console.log(`\nCelkem nalezeno ${routes.length} endpointů.`);
  console.log('==========================================');
}

// Spuštění výpisu
listRoutes();
