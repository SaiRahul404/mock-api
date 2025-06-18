const { spawn } = require('child_process');
const path = require('path');

const dataPath = path.normalize(path.join(__dirname, 'mockoon-environment.json'));
const port = Number(process.env.PORT) || 3001;

// Validate port
if (isNaN(port) || port < 1024 || port > 65535) {
  console.error('Invalid port number:', port);
  process.exit(1);
}

// Check if file exists
try {
  require('fs').accessSync(dataPath);
} catch (err) {
  console.error('Data file not found:', dataPath);
  process.exit(1);
}

// Start Mockoon CLI with spawn, automatically accepting repair prompt
const mockoon = spawn('npx', [
  'mockoon-cli',
  'start',
  '--data',
  dataPath,
  '--port',
  port.toString(),
  '--disable-admin-api',
  '--disable-log-to-file'
], {
  stdio: ['pipe', 'inherit', 'inherit'], // Pipe stdin to send 'y'
  shell: true
});

// Automatically send 'y' to accept Mockoon repair prompt
mockoon.stdin.write('y\n');
mockoon.stdin.end();

mockoon.on('error', (err) => {
  console.error('Error starting Mockoon:', err.message);
  process.exit(1);
});

mockoon.on('exit', (code) => {
  console.log(`Mockoon process exited with code ${code}`);
  process.exit(code || 1);
});

// Handle SIGTERM for graceful shutdown
process.on('SIGTERM', () => {
  mockoon.kill();
  process.exit(0);
});