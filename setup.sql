CREATE TABLE users (
  id            serial primary key,
  email         varchar(80),
  name          varchar(80),
  password_hash varchar(80),
  balance       int,
  streak_cnt    int
);

CREATE TABLE subscriptions (
  follower_id int references users(id),
  creator_id  int references users(id)
);

CREATE TABLE posts (
  post_id   serial primary key,
  poster_id int references users(id),
  image_id  uuid,
  timestamp timestamp
);

CREATE TABLE logins (
  timestamp timestamp,
  user_id   int references users(id)
);

CREATE TABLE tips (
  timestamp timestamp,
  tipper_id int references users(id),
  receiver_id int references users(id),
  amount int
);
