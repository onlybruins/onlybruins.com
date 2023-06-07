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
  'c7d53ee64d57e783b539c09923069280b95a212a36e84b308e15ad6f09a6fd6e',
  100505,
  400
);

INSERT INTO subscriptions (creator_id, follower_id)
SELECT u1.id, u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.username = 'T Omegalul M' AND u2.username != 'T Omegalul M';

INSERT INTO subscriptions (creator_id, follower_id)
SELECT u1.id, u2.id
FROM users u1
CROSS JOIN users u2
WHERE u1.username = 'micah' AND u2.username = 'naketris';

SELECT * FROM users;
SELECT * FROM subscriptions;
