// server.js
const express = require('express');
const http = require('http');
const https = require('https');
const path = require('path');
const cors = require('cors');
const { SSL_CERT, SSL_KEY } = require('./config');
const initializeSocketRoutes = require('./routes/socketRoutes');

const app = express();
app.use(cors());

const MY_NETWORK_IP = '192.168.1.248';
const PORT = 8443;

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
  console.log(`Server is running on https://${MY_NETWORK_IP}:${PORT}`);
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize socket routes with HTTPS server
initializeSocketRoutes(httpsServer);
