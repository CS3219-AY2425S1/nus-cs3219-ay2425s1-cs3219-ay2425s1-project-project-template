// server.js
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const cors = require('cors');
const { SSL_CERT, SSL_KEY, PORT, HTTP_OR_HTTPS } = require('./config');
const initializeSocketRoutes = require('./routes/socketRoutes');

const app = express();
app.use(cors());

// hardcoded for now
const MY_NETWORK_IP = '172.20.10.6';

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

  httpServer.listen(8080, MY_NETWORK_IP);

  // Create HTTPS server
  const httpsServer = https.createServer(options, app);
  httpsServer.listen(PORT, MY_NETWORK_IP, () => {
    console.log(`HTTPS Server is running on https://${MY_NETWORK_IP}:${PORT}`);
  });

  // Serve static files
  app.use(express.static(path.join(__dirname, 'public')));

  server = httpsServer;
} else {
  const httpServer = https.createServer(options, app);
  httpServer.listen(PORT, MY_NETWORK_IP, () => {
    console.log(`HTTP Server is running on https://${MY_NETWORK_IP}:${PORT}`);
  });
  
  server = httpServer;
}

initializeSocketRoutes(server);
