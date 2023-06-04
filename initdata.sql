SET search_path TO onlybruins,public;

INSERT INTO users(username, email, name, password_hash, balance, streak_cnt) VALUES (
  'micah',
  'michaellan202@gmail.com',
  'Michael Lan',
  'f64f62a5954569dd1fa24d365ba40c06631186f39a4bbac41c840a3ba876da9c',
  944447,
  4
);

INSERT INTO users(username, email, name, password_hash, balance, streak_cnt) VALUES (
  'T Omegalul M',
  'tombinford@ucla.edu',
  'Tom Binford',
  'd9201d3705a24a4fe403920bb2cf2a4d933676f68f6eff90015a46f9693d2d0d',
  53,
  28
);

INSERT INTO users(username, email, name, password_hash, balance, streak_cnt) VALUES (
  'naketris',
  'naketriskirk03@ucla.edu',
  'Naketris Kirk',
  'bruin baptism',
  100505,
  400
);

INSERT INTO subscriptions (creator_id, follower_id)
SELECT u1.id, u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.username = 'T Omegalul M' AND u2.username != 'T Omegalul M';

INSERT INTO posts(poster_id, image_id, image_extension) VALUES (
  (SELECT id FROM users WHERE username = 'T Omegalul M'), '904c54e5-d2ae-4766-b0bf-c8a77b29b5c5', 'png'
);

SELECT * FROM users;
SELECT * FROM subscriptions;
