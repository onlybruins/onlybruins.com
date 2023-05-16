SET search_path TO onlybruins,public;

INSERT INTO users(email, name, password_hash, balance, streak_cnt) VALUES (
  'michaellan202@gmail.com',
  'Michael Lan',
  'mo jamba',
  944447,
  4
);

INSERT INTO users(email, name, password_hash, balance, streak_cnt) VALUES (
  'tombinford@ucla.edu',
  'Tom Binford',
  'bruin bonanza',
  53,
  28
);

INSERT INTO users(email, name, password_hash, balance, streak_cnt) VALUES (
  'naketriskirk03@ucla.edu',
  'Naketris Kirk',
  'bruin baptism',
  100505,
  400
);

SELECT email FROM users;
