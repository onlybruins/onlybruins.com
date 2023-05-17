SET search_path TO onlybruins,public;

INSERT INTO users(username, email, name, password_hash, balance, streak_cnt) VALUES (
  'micah',
  'michaellan202@gmail.com',
  'Michael Lan',
  'mo jamba',
  944447,
  4
);

INSERT INTO users(username, email, name, password_hash, balance, streak_cnt) VALUES (
  'T Omegalul M',
  'tombinford@ucla.edu',
  'Tom Binford',
  'bruin bonanza',
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

SELECT * FROM users;
