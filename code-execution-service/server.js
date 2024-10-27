// server.js
const express = require('express');
const bodyParser = require('body-parser');
const { runCodeInDocker, runCodeInVm2 } = require('./sandbox');
const executeRoute = require('./routes/execute');

const app = express();
app.use(bodyParser.json());

app.use('/api/codex', executeRoute);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Code execution sandbox running, health check at http://localhost:${PORT}/api/codex`);
});
