const { exec } = require('child_process');

exec('npx mockoon-cli start --data ./mockoon-environment.json --port 3001 --daemon-off', (err, stdout, stderr) => {
  if (err) {
    console.error('Error starting Mockoon:', stderr);
    process.exit(1);
  }
  console.log('Mockoon started:', stdout);
});
