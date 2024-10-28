// server.js
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const cors = require('cors');
const { SSL_CERT, SSL_KEY, PORT, HTTP_OR_HTTPS, SERVE_FE } = require('./config');
const initializeSocketRoutes = require('./routes/socketRoutes');

const app = express();
app.use(cors());

let server;
if (HTTP_OR_HTTPS === 'https') {
  // SSL certificates
  const options = {
    key: SSL_KEY,
    cert: SSL_CERT,
  };

  // Redirect HTTP to HTTPS
  const httpServer = http.createServer((req, res) => {
    res.writeHead(301, { Location: `https://${req.headers.host}${req.url}` });
    res.end();
  });

  httpServer.listen(8080);

  // Create HTTPS server
  const httpsServer = https.createServer(options, app);
  httpsServer.listen(PORT, () => {
    console.log(`Communication service server is running on HTTPS, port ${PORT}`);
  });

  server = httpsServer;
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    console.log(`Communication service server is running on HTTP, port ${PORT}`);
  });

  server = httpServer;
}

// Health Check
app.get('/api/comm', (req, res) => {
  res.status(200).send('Hello world');
})

if (SERVE_FE === 'true') {
  app.use(express.static(path.join(__dirname, 'public')));
}

initializeSocketRoutes(server);
