/**
 * Skript pro spuštění Express a Fastify serverů současně
 * Verze 0.3.8.7
 */

const { spawn } = require('child_process');
const path = require('path');

// Funkce pro spuštění procesu
function startProcess(command, args, name) {
  const process = spawn(command, args, {
    stdio: 'pipe',
    shell: true
  });
  
  console.log(`[${name}] Spouštím...`);
  
  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });
  
  process.stderr.on('data', (data) => {
    console.error(`[${name}] ${data.toString().trim()}`);
  });
  
  process.on('close', (code) => {
    console.log(`[${name}] Proces ukončen s kódem ${code}`);
  });
  
  return process;
}

// Spuštění Express serveru
const expressServer = startProcess('node', ['server.js'], 'Express');

// Spuštění Fastify serveru
const fastifyServer = startProcess('node', ['fastify-server.js'], 'Fastify');

// Zpracování ukončení
process.on('SIGINT', () => {
  console.log('Ukončuji servery...');
  expressServer.kill();
  fastifyServer.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Ukončuji servery...');
  expressServer.kill();
  fastifyServer.kill();
  process.exit(0);
});
