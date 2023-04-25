import express from 'express';
import apiRouter from './api';
import path from 'path';

const app = express()
const port = 3070

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../frontend/build', 'index.html'));
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`OnlyBruins API listening on port ${port}`)
});
