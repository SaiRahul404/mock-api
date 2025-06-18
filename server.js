const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const dataPath = path.join(__dirname, 'mockoon-environment.json');
const port = 3001;

// Validate data file
if (!fs.existsSync(dataPath)) {
  console.error(`Error: Data file not found at ${dataPath}`);
  process.exit(1);
}

// Validate port
if (isNaN(port) || port < 1 || port > 65535) {
  console.error('Error: Invalid port number');
  process.exit(1);
}

// Use spawn for long-running process
const mockoon = spawn('npx', [
  'mockoon-cli',
  'start',
  '--data',
  dataPath,
  '--port',
  port.toString(),
  '--disable-admin-api',
  '--disable-log-to-file'
]);

mockoon.stdout.on('data', (data) => {
  console.log(`Mockoon: ${data}`);
});

mockoon.stderr.on('data', (data) => {
  console.error(`Mockoon Error: ${data}`);
});

mockoon.on('close', (code) => {
  console.log(`Mockoon process exited with code ${code}`);
  process.exit(code);
});