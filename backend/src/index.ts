import express from 'express';
import apiRouter from './api';
import path from 'path';
import https from 'https';
import http from 'http';
var fs = require('fs');

const app = express();

var privateKey = fs.readFileSync('../../privatekey.key', 'utf8');
var certificate = fs.readFileSync('../../certificate.pem', 'utf8');

var credentials = { key: privateKey, cert: certificate };

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.use('/api', apiRouter);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(8080, () => {
  console.log(`OnlyBruins API listening on port ${8080}`)
});

httpsServer.listen(8443, () => {
  console.log(`OnlyBruins API listening on port ${8443}`)
});
