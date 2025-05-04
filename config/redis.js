/**
 * Redis konfigurace
 * Verze 0.3.8.7
 */

const Redis = require('ioredis');
const RedisMock = require('redis-mock');
require('dotenv').config();

// Konfigurace Redis
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || '',
  db: process.env.REDIS_DB || 0,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
};

// Vytvoření Redis klienta
let redisClient;

// Pro účely testů vždy používáme mock Redis
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development' || !process.env.REDIS_ENABLED) {
  // Použití mock Redis pro testy a vývoj
  redisClient = RedisMock.createClient();
  console.log('Používám mock Redis pro testy/vývoj');
} else if (process.env.REDIS_ENABLED === 'true') {
  // Použití reálného Redis v produkci
  try {
    redisClient = new Redis(redisConfig);
    console.log(`Redis klient připojen k ${redisConfig.host}:${redisConfig.port}`);

    // Události
    redisClient.on('error', (err) => {
      console.error('Redis chyba:', err);
    });

    redisClient.on('connect', () => {
      console.log('Redis klient připojen');
    });

    redisClient.on('reconnecting', () => {
      console.log('Redis klient se znovu připojuje...');
    });
  } catch (error) {
    console.error('Chyba při připojování k Redis:', error);
    // Fallback na mock Redis v případě chyby
    redisClient = RedisMock.createClient();
    console.log('Fallback na mock Redis kvůli chybě připojení');
  }
} else {
  // Redis není povolen
  redisClient = RedisMock.createClient();
  console.log('Redis není povolen, používám mock Redis');
}

/**
 * Získání hodnoty z Redis
 * @param {string} key - Klíč
 * @returns {Promise<string|null>} Hodnota nebo null, pokud klíč neexistuje
 */
async function get(key) {
  if (!redisClient) return null;

  try {
    return await redisClient.get(key);
  } catch (error) {
    console.error(`Chyba při získávání hodnoty z Redis pro klíč ${key}:`, error);
    return null;
  }
}

/**
 * Nastavení hodnoty v Redis
 * @param {string} key - Klíč
 * @param {string} value - Hodnota
 * @param {number} expiration - Doba platnosti v sekundách (volitelné)
 * @returns {Promise<boolean>} true, pokud byla hodnota nastavena, jinak false
 */
async function set(key, value, expiration = null) {
  if (!redisClient) return false;

  try {
    if (expiration) {
      await redisClient.set(key, value, 'EX', expiration);
    } else {
      await redisClient.set(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Chyba při nastavování hodnoty v Redis pro klíč ${key}:`, error);
    return false;
  }
}

/**
 * Odstranění hodnoty z Redis
 * @param {string} key - Klíč
 * @returns {Promise<boolean>} true, pokud byla hodnota odstraněna, jinak false
 */
async function del(key) {
  if (!redisClient) return false;

  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error(`Chyba při odstraňování hodnoty z Redis pro klíč ${key}:`, error);
    return false;
  }
}

/**
 * Kontrola, zda klíč existuje v Redis
 * @param {string} key - Klíč
 * @returns {Promise<boolean>} true, pokud klíč existuje, jinak false
 */
async function exists(key) {
  if (!redisClient) return false;

  try {
    const result = await redisClient.exists(key);
    return result === 1;
  } catch (error) {
    console.error(`Chyba při kontrole existence klíče ${key} v Redis:`, error);
    return false;
  }
}

/**
 * Nastavení hodnoty v Redis, pouze pokud klíč neexistuje
 * @param {string} key - Klíč
 * @param {string} value - Hodnota
 * @param {number} expiration - Doba platnosti v sekundách (volitelné)
 * @returns {Promise<boolean>} true, pokud byla hodnota nastavena, jinak false
 */
async function setNX(key, value, expiration = null) {
  if (!redisClient) return false;

  try {
    let result;

    if (expiration) {
      result = await redisClient.set(key, value, 'NX', 'EX', expiration);
    } else {
      result = await redisClient.set(key, value, 'NX');
    }

    return result === 'OK';
  } catch (error) {
    console.error(`Chyba při nastavování hodnoty v Redis pro klíč ${key} (NX):`, error);
    return false;
  }
}

/**
 * Inkrementace hodnoty v Redis
 * @param {string} key - Klíč
 * @returns {Promise<number|null>} Nová hodnota nebo null v případě chyby
 */
async function incr(key) {
  if (!redisClient) return null;

  try {
    return await redisClient.incr(key);
  } catch (error) {
    console.error(`Chyba při inkrementaci hodnoty v Redis pro klíč ${key}:`, error);
    return null;
  }
}

/**
 * Nastavení TTL pro klíč v Redis
 * @param {string} key - Klíč
 * @param {number} expiration - Doba platnosti v sekundách
 * @returns {Promise<boolean>} true, pokud byl TTL nastaven, jinak false
 */
async function expire(key, expiration) {
  if (!redisClient) return false;

  try {
    await redisClient.expire(key, expiration);
    return true;
  } catch (error) {
    console.error(`Chyba při nastavování TTL pro klíč ${key} v Redis:`, error);
    return false;
  }
}

/**
 * Získání TTL pro klíč v Redis
 * @param {string} key - Klíč
 * @returns {Promise<number|null>} TTL v sekundách nebo null v případě chyby
 */
async function ttl(key) {
  if (!redisClient) return null;

  try {
    return await redisClient.ttl(key);
  } catch (error) {
    console.error(`Chyba při získávání TTL pro klíč ${key} z Redis:`, error);
    return null;
  }
}

/**
 * Získání všech klíčů odpovídajících vzoru
 * @param {string} pattern - Vzor (např. "user:*")
 * @returns {Promise<Array<string>|null>} Pole klíčů nebo null v případě chyby
 */
async function keys(pattern) {
  if (!redisClient) return null;

  try {
    return await redisClient.keys(pattern);
  } catch (error) {
    console.error(`Chyba při získávání klíčů odpovídajících vzoru ${pattern} z Redis:`, error);
    return null;
  }
}

/**
 * Vyčištění databáze
 * @returns {Promise<boolean>} true, pokud byla databáze vyčištěna, jinak false
 */
async function flushDb() {
  if (!redisClient) return false;

  try {
    await redisClient.flushdb();
    return true;
  } catch (error) {
    console.error('Chyba při vyčišťování Redis databáze:', error);
    return false;
  }
}

/**
 * Ukončení připojení k Redis
 * @returns {Promise<boolean>} true, pokud bylo připojení ukončeno, jinak false
 */
async function quit() {
  if (!redisClient) return true;

  try {
    await redisClient.quit();
    return true;
  } catch (error) {
    console.error('Chyba při ukončování připojení k Redis:', error);
    return false;
  }
}

module.exports = {
  client: redisClient,
  get,
  set,
  del,
  exists,
  setNX,
  incr,
  expire,
  ttl,
  keys,
  flushDb,
  quit
};
