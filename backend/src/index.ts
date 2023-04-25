import express from 'express'
import { faker } from '@faker-js/faker';

const app = express()
const port = 3070

class FakePost {
  username: string;
  postDate: Date;
  imageUrl: string;
  tippedAmount?: number;
}

function createRandomFakePost(): FakePost {
  const username = faker.internet.userName();
  const postDate = faker.date.between('2015-01-01T00:00:00.000Z', '2023-05-01T00:00:00.000Z');
  const imageUrl = faker.image.fashion();
  const tippedAmount = faker.helpers.arrayElement([undefined, faker.datatype.number(100)])

  return {
    username,
    postDate,
    imageUrl,
    tippedAmount
  };
}

const post = createRandomFakePost();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/fakePosts', (req, res) => {
  const data = Array.apply(null, Array(20)).map(() => createRandomFakePost());
  res.json(data)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
