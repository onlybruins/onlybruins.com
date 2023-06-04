/* drop the schema if it already exists (make it anew) */
DROP SCHEMA IF EXISTS onlybruins CASCADE;

CREATE SCHEMA onlybruins;

/* all of our tables are in the 'onlybruins' schema, which means
 * that normally we would have to qualify all our tables like so:
 *
 *   CREATE TABLE onlybruins.users (...)
 *
 * however we add 'onlybruins' to the search_path, so that an ident
 * like 'users' will be searched through and found under the
 * 'onlybruins' schema. search_path is sorta like $PATH in the shell,
 * and 'public' is the default schema.

 * From PostgreSQL docs:
 *   The first schema in the search path that exists is
 *   the default location for creating new objects.
 */
SET search_path TO onlybruins,public;

CREATE TABLE users (
  id            serial primary key UNIQUE,
  username      varchar(80) UNIQUE NOT NULL,
  email         varchar(80) UNIQUE,
  name          varchar(80),
  password_hash varchar(80),
  balance       int,
  streak_cnt    int
);

CREATE TABLE subscriptions (
  follower_id int NOT NULL references users(id),
  creator_id  int NOT NULL references users(id),
  UNIQUE(follower_id, creator_id),
  CHECK(follower_id != creator_id)
);

CREATE TABLE posts (
  post_id         serial primary key UNIQUE,
  poster_id       int references users(id),
  image_id        uuid,
  image_extension varchar(5),
  timestamp       timestamptz default (now() at time zone 'utc')
);

CREATE TABLE logins (
  timestamp timestamp,
  user_id   int references users(id)
);

CREATE TABLE tips (
  timestamp timestamptz NOT NULL default (now() at time zone 'utc'),
  tipper_id int NOT NULL references users(id),
  receiver_id int NOT NULL references users(id),
  post_id int NOT NULL references posts(post_id),
  amount int NOT NULL CHECK (amount > 0),
  UNIQUE(tipper_id, receiver_id, post_id),
  CHECK(tipper_id != receiver_id)
);
