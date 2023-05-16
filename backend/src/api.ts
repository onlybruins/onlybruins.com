import express from 'express'
import { faker } from '@faker-js/faker';
import { getAssociatedName } from './db';

const api = express.Router();

class FakePost {
  username: string;
  postDate: Date;
  imageUrl: string;
  tippedAmount?: number;
}

function createRandomFakePost(): FakePost {
  const username = faker.internet.userName();
  const postDate = faker.date.between('2015-01-01T00:00:00.000Z', '2023-05-01T00:00:00.000Z');
  const imageUrl = faker.image.fashion(1280, 720, true);
  const tippedAmount = faker.helpers.arrayElement([undefined, faker.datatype.number(100)])

  return {
    username,
    postDate,
    imageUrl,
    tippedAmount
  };
}

api.get('/fakePosts', (_req, res) => {
  const data = Array.apply(null, Array(20)).map(() => createRandomFakePost());
  res.json(data);
});

api.get('/goofyDB/:email', async (req, res) => {

  // get the :email field in the URL
  const email = req.params.email;
  const dbres = await getAssociatedName(email)
  if (dbres === undefined)
    res.json("No associated user found")
  else
    res.json(dbres)
});

export default api;
