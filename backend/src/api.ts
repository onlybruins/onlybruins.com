import express from 'express'
import { faker } from '@faker-js/faker';
import { getAssociatedName, getFollowers, getFollowing, addFollower, removeFollower, getPosts, getPost, makePost } from './db';
import multer from 'multer';
import { UgcStorage, RequestWithUUID, supportedMimeTypeToFileExtension } from './image-handling';
import { v4 as uuidv4 } from 'uuid';

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

api.get('/users/:username/name', async (req, res) => {
  const username = req.params.username;
  const dbres = await getAssociatedName(username)
  if (dbres === undefined)
    res.json("No associated user found")
  else
    res.json(dbres)
});

api.get('/users/:username/followers', async (req, res) => {
  const username = req.params.username;
  const dbres = await getFollowers(username)
  if (dbres === undefined)
    res.json("No associated user found")
  else
    res.json(dbres)
});

api.get('/users/:username/following', async (req, res) => {
  const dbres = await getFollowing(req.params.username);
  if (dbres === undefined)
    res.json("No associated user found");
  else
    res.json(dbres);
});

api.put('/users/:username/following/:creator_username', async (req, res) => {
  const dbres = await addFollower({ creator_username: req.params.creator_username, follower_username: req.params.username });
  console.log(`${req.params.username} following ${req.params.creator_username}: ${dbres}`);
  res.status(dbres ? 200 : 400).send();
});

api.delete('/users/:username/following/:creator_username', async (req, res) => {
  const dbres = await removeFollower({ creator_username: req.params.creator_username, follower_username: req.params.username });
  console.log(`${req.params.username} unfollowing ${req.params.creator_username}: ${dbres}`);
  res.status(dbres ? 200 : 400).send();
});

api.get('/users/:username/posts', async (req, res) => {
  const dbres = await getPosts(req.params.username);
  if (dbres === undefined)
    res.status(404).send();
  else
    res.json(dbres.map(post => ({
      post_endpoint: encodeURI(`${req.baseUrl}/users/${req.params.username}/posts/${post.post_id}`),
      poster_name: post.name,
      poster_username: post.username,
      image_endpoint: encodeURI(`/images/${post.image_id}.${post.image_extension}`),
      timestamp: post.timestamp
    })));
});

api.get('/users/:username/posts/:postid(\\d+)', async (req, res) => {
  const post = await getPost(req.params.username, parseInt(req.params.postid));
  if (post === undefined)
    res.status(404).send();
  else
    res.json({
      post_endpoint: encodeURI(`${req.baseUrl}/users/${req.params.username}/posts/${post.post_id}`),
      poster_name: post.name,
      poster_username: req.params.username,
      image_endpoint: encodeURI(`/images/${post.image_id}.${post.image_extension}`),
      timestamp: post.timestamp
    });
});

const ugcUpload = multer({
  storage: UgcStorage,
  fileFilter: (req, file, callback) => callback(null, file.mimetype in supportedMimeTypeToFileExtension)
}).single('postImage');
api.post('/users/:username/posts', async (req: RequestWithUUID, res) => {
  req.image_uuid = uuidv4();
  ugcUpload(req, res, async (err) => {
    if (err) {
      console.error(err);
      res.status(500).send();
      return;
    }
    if (!req.file) {
      res.status(400).send();
      return;
    }
    const dbres = await makePost(req.params.username, req.image_uuid, supportedMimeTypeToFileExtension[req.file.mimetype]);
    if (dbres === undefined)
      res.status(404).send();
    else {
      const post_endpoint = encodeURI(`${req.baseUrl}/users/${req.params.username}/posts/${dbres}`);
      console.log(`New post from ${req.params.username}: ${post_endpoint}`);
      res.json({ post_endpoint });
    }
  });
});

export default api;
