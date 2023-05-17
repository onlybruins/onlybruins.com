import express from 'express';
import apiRouter from './api';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';

const app = express();

const privateKey = fs.readFileSync('../../privatekey.key', 'utf8');
const certificate = fs.readFileSync('../../certificate.pem', 'utf8');

const credentials = { key: privateKey, cert: certificate };

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.use('/api', apiRouter);

const httpPort = 80
const httpsPort = 443

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(httpPort, () => {
  console.log(`OnlyBruins API listening on port ${httpPort}`)
});

httpsServer.listen(httpsPort, () => {
  console.log(`OnlyBruins API listening on port ${httpsPort}`)
});
