import express from 'express'
import apiRouter from './api';

const app = express()
const port = 3070

app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.use('/api', apiRouter);

app.listen(port, () => {
  console.log(`OnlyBruins API listening on port ${port}`)
});
