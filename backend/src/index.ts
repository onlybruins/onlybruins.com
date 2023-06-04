import express from 'express';
import apiRouter from './api';
import path from 'path';
import https from 'https';
import http from 'http';
import fs from 'fs';

/* To give multer destinations for images, create subdirectories with all 2-letter alphanumeric values. */
const alphanumeric = "abcdefghijklmnopqrstuvwxyz0123456789";
const ugcDir = path.resolve(__dirname, '../../ugc-images');
for (let i = 0; i < alphanumeric.length; i++) {
  for (let j = 0; j < alphanumeric.length; j++) {
    try {
      fs.mkdirSync(path.join(ugcDir, alphanumeric[i] + alphanumeric[j]));
    }
    catch(e) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }
}

const app = express();

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/images/:image_id_dot_extension', (req, res) => {
  const a = req.params.image_id_dot_extension;
  const [first_two, rest] = [a.substring(0, 2), a.substring(2)];
  const p = path.resolve(__dirname, '../../ugc-images', `${first_two}/${rest}`);
  res.sendFile(p);
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.use('/api', apiRouter);

let httpPort = 80;
let httpsPort = 443;

if (process.env.NODE_ENV !== 'production') {
  httpPort += 8000;
  httpsPort += 8000;
}

const httpServer = http.createServer(app);
httpServer.listen(httpPort, () => {
  console.log(`OnlyBruins API listening on port ${httpPort}`)
});

try {
  const privateKey = fs.readFileSync(process.env['HOME'] + '/privatekey.key', 'utf8');
  const certificate = fs.readFileSync(process.env['HOME'] + '/certificate.pem', 'utf8');
  const credentials = { key: privateKey, cert: certificate };
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(httpsPort, () => {
    console.log(`OnlyBruins API listening on port ${httpsPort}`)
  });
} catch (err) {
  if (err.code === 'ENOENT') {
    console.log("certificate not found, this is fine if you're on localhost");
    console.log("but note that you must use the HTTP server");
  } else {
    throw err;
  }
}
