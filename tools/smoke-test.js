const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, res => {
  console.log(`Smoke test: statusCode=${res.statusCode}`);
  if (res.statusCode === 200) process.exit(0);
  else process.exit(2);
});

req.on('error', err => {
  console.error('Smoke test failed:', err.message);
  process.exit(1);
});

req.end();
