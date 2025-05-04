/**
 * Auth0 Terminal Explorer
 * Interaktivní nástroj pro průzkum a testování Auth0 endpointů z terminálu
 */

const readline = require('readline');
const axios = require('axios');
const chalk = require('chalk'); // Pro barevný výstup v terminálu
const figlet = require('figlet'); // Pro stylizovaný text
const open = require('open'); // Pro otevření URL v prohlížeči
require('dotenv').config();

// Základní URL vaší aplikace
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

// Vytvoření readline interface pro interakci s uživatelem
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Funkce pro zobrazení hlavičky
function showHeader() {
  console.clear();
  console.log(
    chalk.blue(
      figlet.textSync('Auth0 Explorer', { font: 'Standard', horizontalLayout: 'full' })
    )
  );
  console.log(chalk.yellow('Interaktivní průzkumník Auth0 endpointů\n'));
  console.log(chalk.green(`Připojeno k: ${chalk.white(baseUrl)}\n`));
}

// Funkce pro zobrazení hlavního menu
function showMainMenu() {
  showHeader();
  console.log(chalk.cyan('HLAVNÍ MENU:'));
  console.log(chalk.white('1. Zobrazit dostupné Auth0 endpointy'));
  console.log(chalk.white('2. Otestovat endpoint'));
  console.log(chalk.white('3. Otevřít přihlašovací stránku v prohlížeči'));
  console.log(chalk.white('4. Otevřít odhlašovací stránku v prohlížeči'));
  console.log(chalk.white('5. Získat informace o Auth0 konfiguraci'));
  console.log(chalk.white('6. Simulovat API požadavek s JWT tokenem'));
  console.log(chalk.white('7. Zobrazit nápovědu'));
  console.log(chalk.white('0. Ukončit program\n'));
  
  rl.question(chalk.yellow('Vyberte možnost (0-7): '), handleMainMenuChoice);
}

// Funkce pro zpracování volby z hlavního menu
function handleMainMenuChoice(choice) {
  switch (choice) {
    case '1':
      listEndpoints();
      break;
    case '2':
      testEndpoint();
      break;
    case '3':
      openLoginPage();
      break;
    case '4':
      openLogoutPage();
      break;
    case '5':
      getAuth0Config();
      break;
    case '6':
      simulateApiRequest();
      break;
    case '7':
      showHelp();
      break;
    case '0':
      console.log(chalk.green('\nDěkujeme za použití Auth0 Terminal Explorer. Na shledanou!'));
      rl.close();
      break;
    default:
      console.log(chalk.red('\nNeplatná volba. Zkuste to znovu.'));
      setTimeout(showMainMenu, 1500);
  }
}

// Funkce pro výpis dostupných Auth0 endpointů
function listEndpoints() {
  showHeader();
  console.log(chalk.cyan('DOSTUPNÉ AUTH0 ENDPOINTY:\n'));
  
  const endpoints = [
    { path: '/login', description: 'Přesměruje na Auth0 přihlašovací stránku' },
    { path: '/logout', description: 'Odhlásí uživatele a přesměruje na nastavenou URL' },
    { path: '/callback', description: 'Zpracovává odpověď po úspěšné autentizaci' },
    { path: '/auth/config', description: 'Vrací konfiguraci Auth0 pro klienta' },
    { path: '/api', description: 'Základní API endpoint (může vyžadovat autentizaci)' },
    { path: '/api/admin', description: 'Admin API endpoint (vyžaduje admin oprávnění)' },
    { path: '/api/stripe', description: 'Stripe API endpoint' },
    { path: '/health', description: 'Endpoint pro kontrolu stavu aplikace' },
    { path: '/metrics', description: 'Endpoint pro metriky aplikace (pouze pro adminy)' }
  ];
  
  endpoints.forEach((endpoint, index) => {
    console.log(chalk.white(`${index + 1}. ${chalk.yellow(endpoint.path)}`));
    console.log(`   ${chalk.gray(endpoint.description)}`);
    console.log(`   ${chalk.blue(`${baseUrl}${endpoint.path}`)}\n`);
  });
  
  rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
    showMainMenu();
  });
}

// Funkce pro testování endpointu
function testEndpoint() {
  showHeader();
  console.log(chalk.cyan('TEST ENDPOINTU:\n'));
  
  rl.question(chalk.yellow('Zadejte cestu k endpointu (např. /login, /api/health): '), async (path) => {
    console.log(chalk.white(`\nTestuji endpoint: ${chalk.blue(`${baseUrl}${path}`)}`));
    
    try {
      console.log(chalk.gray('\nOdesílám požadavek...'));
      
      const startTime = Date.now();
      const response = await axios.get(`${baseUrl}${path}`, {
        validateStatus: () => true, // Akceptuje jakýkoliv status kód
        maxRedirects: 0 // Nesleduje přesměrování
      });
      const endTime = Date.now();
      
      console.log(chalk.green('\nOdpověď přijata!'));
      console.log(chalk.white(`Status: ${getStatusWithColor(response.status)}`));
      console.log(chalk.white(`Doba odezvy: ${chalk.yellow(`${endTime - startTime} ms`)}`));
      
      if (response.headers['content-type']) {
        console.log(chalk.white(`Content-Type: ${chalk.yellow(response.headers['content-type'])}`));
      }
      
      if (response.status === 302) {
        console.log(chalk.white(`Přesměrování na: ${chalk.yellow(response.headers.location)}`));
      }
      
      if (response.data && typeof response.data === 'object') {
        console.log(chalk.white('\nData odpovědi:'));
        console.log(chalk.gray(JSON.stringify(response.data, null, 2)));
      }
      
    } catch (error) {
      console.log(chalk.red('\nChyba při testování endpointu:'));
      
      if (error.response) {
        console.log(chalk.white(`Status: ${getStatusWithColor(error.response.status)}`));
        console.log(chalk.white('Data odpovědi:'));
        console.log(chalk.gray(JSON.stringify(error.response.data, null, 2)));
      } else {
        console.log(chalk.red(error.message));
      }
    }
    
    rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
      showMainMenu();
    });
  });
}

// Funkce pro otevření přihlašovací stránky v prohlížeči
function openLoginPage() {
  showHeader();
  console.log(chalk.cyan('OTEVŘENÍ PŘIHLAŠOVACÍ STRÁNKY:\n'));
  
  const loginUrl = `${baseUrl}/login`;
  console.log(chalk.white(`Otevírám přihlašovací stránku: ${chalk.blue(loginUrl)}`));
  
  open(loginUrl)
    .then(() => {
      console.log(chalk.green('\nStránka byla úspěšně otevřena v prohlížeči.'));
    })
    .catch((err) => {
      console.log(chalk.red(`\nChyba při otevírání stránky: ${err.message}`));
    })
    .finally(() => {
      rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
        showMainMenu();
      });
    });
}

// Funkce pro otevření odhlašovací stránky v prohlížeči
function openLogoutPage() {
  showHeader();
  console.log(chalk.cyan('OTEVŘENÍ ODHLAŠOVACÍ STRÁNKY:\n'));
  
  const logoutUrl = `${baseUrl}/logout`;
  console.log(chalk.white(`Otevírám odhlašovací stránku: ${chalk.blue(logoutUrl)}`));
  
  open(logoutUrl)
    .then(() => {
      console.log(chalk.green('\nStránka byla úspěšně otevřena v prohlížeči.'));
    })
    .catch((err) => {
      console.log(chalk.red(`\nChyba při otevírání stránky: ${err.message}`));
    })
    .finally(() => {
      rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
        showMainMenu();
      });
    });
}

// Funkce pro získání Auth0 konfigurace
async function getAuth0Config() {
  showHeader();
  console.log(chalk.cyan('AUTH0 KONFIGURACE:\n'));
  
  try {
    console.log(chalk.gray('Získávám Auth0 konfiguraci...'));
    
    const response = await axios.get(`${baseUrl}/auth/config`, {
      validateStatus: () => true
    });
    
    if (response.status === 200 && response.data) {
      console.log(chalk.green('\nKonfigurace úspěšně získána!\n'));
      
      const config = response.data;
      console.log(chalk.white(`Domain: ${chalk.yellow(config.domain || 'Není k dispozici')}`));
      console.log(chalk.white(`Client ID: ${chalk.yellow(config.clientId || 'Není k dispozici')}`));
      console.log(chalk.white(`Audience: ${chalk.yellow(config.audience || 'Není k dispozici')}`));
      console.log(chalk.white(`Callback URL: ${chalk.yellow(config.callbackUrl || 'Není k dispozici')}`));
      console.log(chalk.white(`Logout URL: ${chalk.yellow(config.logoutUrl || 'Není k dispozici')}`));
      console.log(chalk.white(`Scope: ${chalk.yellow(config.scope || 'Není k dispozici')}`));
    } else {
      console.log(chalk.red('\nNepodařilo se získat konfiguraci.'));
      console.log(chalk.white(`Status: ${getStatusWithColor(response.status)}`));
      
      if (response.data) {
        console.log(chalk.white('Odpověď:'));
        console.log(chalk.gray(JSON.stringify(response.data, null, 2)));
      }
    }
  } catch (error) {
    console.log(chalk.red('\nChyba při získávání konfigurace:'));
    console.log(chalk.red(error.message));
  }
  
  rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
    showMainMenu();
  });
}

// Funkce pro simulaci API požadavku s JWT tokenem
function simulateApiRequest() {
  showHeader();
  console.log(chalk.cyan('SIMULACE API POŽADAVKU S JWT TOKENEM:\n'));
  
  rl.question(chalk.yellow('Zadejte cestu k API endpointu (např. /api/protected): '), (path) => {
    rl.question(chalk.yellow('Zadejte JWT token (nebo stiskněte Enter pro požadavek bez tokenu): '), async (token) => {
      console.log(chalk.white(`\nOdesílám požadavek na: ${chalk.blue(`${baseUrl}${path}`)}`));
      
      try {
        const headers = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log(chalk.gray('Požadavek obsahuje autorizační token.'));
        } else {
          console.log(chalk.gray('Požadavek bez autorizačního tokenu.'));
        }
        
        console.log(chalk.gray('\nOdesílám požadavek...'));
        
        const response = await axios.get(`${baseUrl}${path}`, {
          headers,
          validateStatus: () => true
        });
        
        console.log(chalk.green('\nOdpověď přijata!'));
        console.log(chalk.white(`Status: ${getStatusWithColor(response.status)}`));
        
        if (response.data) {
          console.log(chalk.white('\nData odpovědi:'));
          console.log(chalk.gray(JSON.stringify(response.data, null, 2)));
        }
        
      } catch (error) {
        console.log(chalk.red('\nChyba při odesílání požadavku:'));
        console.log(chalk.red(error.message));
      }
      
      rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
        showMainMenu();
      });
    });
  });
}

// Funkce pro zobrazení nápovědy
function showHelp() {
  showHeader();
  console.log(chalk.cyan('NÁPOVĚDA K AUTH0 ENDPOINTŮM:\n'));
  
  console.log(chalk.white('1. Přihlášení (/login)'));
  console.log(chalk.gray('   - Přesměruje uživatele na Auth0 přihlašovací stránku'));
  console.log(chalk.gray('   - Po úspěšném přihlášení přesměruje zpět na callback URL'));
  console.log(chalk.gray('   - Příklad použití: window.location.href = "/login"\n'));
  
  console.log(chalk.white('2. Odhlášení (/logout)'));
  console.log(chalk.gray('   - Odhlásí uživatele a přesměruje na nastavenou URL'));
  console.log(chalk.gray('   - Příklad použití: window.location.href = "/logout"\n'));
  
  console.log(chalk.white('3. Callback (/callback)'));
  console.log(chalk.gray('   - Zpracovává odpověď po úspěšné autentizaci'));
  console.log(chalk.gray('   - Tento endpoint je volán Auth0, ne přímo uživatelem'));
  console.log(chalk.gray('   - Musí být nastaven v Auth0 dashboardu jako "Allowed Callback URL"\n'));
  
  console.log(chalk.white('4. Zabezpečení API endpointů'));
  console.log(chalk.gray('   - Použijte middleware requiresAuth() pro zabezpečení endpointů'));
  console.log(chalk.gray('   - Příklad: app.get("/api/protected", requiresAuth(), (req, res) => {...})\n'));
  
  console.log(chalk.white('5. Kontrola přihlášení'));
  console.log(chalk.gray('   - V Express routerech: if (req.oidc.isAuthenticated()) {...}'));
  console.log(chalk.gray('   - Získání informací o uživateli: req.oidc.user\n'));
  
  rl.question(chalk.yellow('\nStiskněte Enter pro návrat do hlavního menu...'), () => {
    showMainMenu();
  });
}

// Pomocná funkce pro získání barevného textu podle HTTP status kódu
function getStatusWithColor(status) {
  let statusText = '';
  
  if (status >= 200 && status < 300) {
    statusText = chalk.green(`${status}`);
  } else if (status >= 300 && status < 400) {
    statusText = chalk.blue(`${status}`);
  } else if (status >= 400 && status < 500) {
    statusText = chalk.yellow(`${status}`);
  } else {
    statusText = chalk.red(`${status}`);
  }
  
  // Přidání textového popisu
  const descriptions = {
    200: 'OK',
    201: 'Created',
    204: 'No Content',
    301: 'Moved Permanently',
    302: 'Found (Redirect)',
    304: 'Not Modified',
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    500: 'Internal Server Error',
    502: 'Bad Gateway',
    503: 'Service Unavailable'
  };
  
  if (descriptions[status]) {
    statusText += ` ${chalk.white(descriptions[status])}`;
  }
  
  return statusText;
}

// Spuštění aplikace
showMainMenu();

// Ukončení aplikace při stisku Ctrl+C
rl.on('SIGINT', () => {
  console.log(chalk.green('\nDěkujeme za použití Auth0 Terminal Explorer. Na shledanou!'));
  rl.close();
});
