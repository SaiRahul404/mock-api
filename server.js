const { exec } = require('child_process');
const path = require('path');

const dataPath = path.normalize(path.join(__dirname, 'mockoon-environment.json'));
const port = Number(process.env.PORT) || 3000;

// Validate port
if (isNaN(port) || port < 1024 || port > 65535) {
  console.error('Invalid port number:', port);
  process.exit(1);
}

// Check if file exists (optional)
try {
  require('fs').accessSync(dataPath);
} catch (err) {
  console.error('Data file not found:', dataPath);
  process.exit(1);
}

exec(
  `npx mockoon-cli start --data "${dataPath}" --port ${port} --disable-admin-api --disable-log-to-file`,
  { stdio: 'inherit' },
  (err, stdout, stderr) => {
    if (err) {
      console.error('Error starting Mockoon:');
      console.error(err.message);
      if (stderr) console.error(stderr);
      process.exit(1);
    }
    console.log('Mockoon started successfully');
    if (stdout) console.log(stdout);
  }
);