import { Pool, PoolClient } from 'pg';

/* we have a pool of connections to our database, which is
 * abstracted away as a Pool object. when we want to make a query,
 * we first have our pool provide us with a connection via
 *
 *   const client = await pool.connect()
 *
 * Then we can use client.query() (see the node pg docs) and when we
 * are finished, client.release()
 * 
 * The above approach is dangerous since it is a resource leak if you
 * don't call client.release(), even in cases like an exception being thrown.
 * pg can do that for us with pool.query(), the preferred method for one-off
 * queries.
 */
const pool = new Pool({
  database: 'onlybruinsdb'
})

/* we add onlybruins to the search path so we don't need to fully qualify
 * our table names, for instance */
pool.on('connect', (client: PoolClient) => {
  client.query('SET search_path TO onlybruins,public');
});

export const getAssociatedName = async (username: string) => {
  const res = await pool.query('SELECT name from users where username = $1', [username]);
  if (res.rows.length === 0) return undefined;
  return res.rows[0].name;
};

export const getFollowers = async (username: string) => {
  const res = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (res.rows.length === 0)
    return undefined;
  const uid = res.rows[0].id;
  return pool.query(
    `SELECT users.username
    FROM subscriptions
    JOIN users ON subscriptions.follower_id = users.id
    WHERE subscriptions.creator_id = $1`, [uid])
    .then(res => res.rows.map(r => r.username));
};

export const getFollowing = async (username: string) => {
  const res = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
  if (res.rows.length === 0)
    return undefined;
  const uid = res.rows[0].id;
  return await pool.query(
    `SELECT users.username
    FROM subscriptions
    JOIN users ON subscriptions.creator_id = users.id
    WHERE subscriptions.follower_id = $1`, [uid])
    .then(res => res.rows.map(r => r.username));
}

type AddFollowerResult = Promise<'ok' | 'already following' | 'bad username'>;
export const addFollower = async (params: { creator_username: string, follower_username: string }): AddFollowerResult => {
  const res = await pool.query(
    `INSERT INTO subscriptions(follower_id, creator_id)
    VALUES((SELECT id FROM users WHERE username = $1), (SELECT id FROM users WHERE username = $2))
    ON CONFLICT DO NOTHING
    RETURNING *`, [params.follower_username, params.creator_username]);
  if (res.rows.length > 0) {
    return 'ok';
  }
  else {
    const res2 = await pool.query(
      `SELECT 1
      FROM users
      WHERE username = $1 OR username = $2`,
      [params.follower_username, params.creator_username]);
    return res2.rows.length == 2 ? 'already following' : 'bad username';
  }
}

export const removeFollower = async (params: { creator_username: string, follower_username: string }) => {
  const res = await pool.query(
    `DELETE FROM subscriptions
    WHERE follower_id = (SELECT id FROM users WHERE username = $1)
          AND creator_id = (SELECT id FROM users WHERE username = $2)
    `, [params.follower_username, params.creator_username]);
  if (res.rows.length > 0) {
    return true;
  }
  else {
    const res2 = await pool.query(
      `SELECT 1
      FROM users
      WHERE username = $1 OR username = $2`,
      [params.follower_username, params.creator_username]);
    // OK if the users exist (wasn't following to begin with), not OK otherwise
    return res2.rows.length == 2;
  }
}

export const getPosts = async (username: string) => {
  const res = await pool.query('SELECT id, name FROM users WHERE username = $1', [username]);
  if (res.rows.length === 0)
    return undefined;
  const [uid, name] = [res.rows[0].id, res.rows[0].name];
  return await pool.query(
    `SELECT post_id, image_id, image_extension, timestamp
    FROM posts
    WHERE poster_id = $1`, [uid])
    .then(res => res.rows.map(({ post_id, image_id, image_extension, timestamp }) => ({
      post_id,
      username,
      name,
      image_id,
      image_extension,
      timestamp
    })));
}

export const getPost = async (username: string, post_id: number) => {
  const res = await pool.query(
    `SELECT users.name, posts.image_id, posts.image_extension, posts.timestamp
    FROM posts
    JOIN users
    ON users.id = posts.poster_id
    WHERE users.username = $1 AND posts.post_id = $2`, [username, post_id]);
  if (res.rows.length === 0)
    return undefined;
  const { name, image_id, image_extension, timestamp } = res.rows[0];
  return {
    post_id,
    username,
    name,
    image_id,
    image_extension,
    timestamp
  }
}

export const getFeed = async (username: string) => {
  const res = await pool.query(
    `SELECT users.name, users.username, posts.post_id, posts.poster_id, posts.image_id, posts.image_extension, posts.timestamp
    FROM posts
    JOIN users
    ON users.id = poster_id
    WHERE poster_id IN
    (SELECT creator_id FROM subscriptions
      WHERE follower_id = (SELECT id FROM users WHERE username = $1))`, [username]
  )
  return res.rows
}

export const makePost = async (username: string, image_id: string, image_extension: string) => {
  const res = await pool.query(
    `INSERT INTO posts(poster_id, image_id, image_extension)
    VALUES((SELECT id FROM users WHERE username = $1), $2, $3)
    RETURNING post_id`, [username, image_id, image_extension]);
  if (res.rows.length === 0)
    return undefined;
  return res.rows[0].post_id;
}

export const validateCredentials = async (username: string, hashedPassword: string) => {
  const res = await pool.query(
    `SELECT username FROM users WHERE username = $1 AND password_hash = $2`,
    [username, hashedPassword]);

  if (res.rows.length === 0)
    return false
  return true
}

export const registerUser = async (username: string, hashedPassword: string, name: string, email: string, balance: number) => {
  if (name === '') name = null;
  if (username === '' || email === '') return false;
  try {
    await pool.query(
      `INSERT INTO users (username, email, name, password_hash, balance, streak_cnt) VALUES (
      $1, $2, $3, $4, $5, 0
    )`, [username, email, name, hashedPassword, balance]);
    return true;
  } catch (e) {
    return false;
  }
}

export const getBalance = async (username: string) => {
  const res = await pool.query(`SELECT balance FROM onlybruins.users WHERE username = $1`, [username]);
  if (res.rows.length === 0) {
    return undefined;
  }
  return res.rows[0] as number;
}

export type TipPostResult = Promise<'ok' | 'already tipped' | 'bad username' | 'bad amount' | 'no such post' | 'cannot tip yourself' | 'insufficient funds'>;
export type TipPostParams = { author_username: string, post_id: number, tipper_username: string, amount: number };
export const tipPost = async (params: TipPostParams): TipPostResult => {
  if (params.amount <= 0) {
    return 'bad amount';
  }
  const client = await pool.connect();
  client.query('BEGIN TRANSACTION');
  const postExists = await client.query(
    `SELECT 1
    FROM posts
    WHERE poster_id = (SELECT id FROM users WHERE username = $1)
          AND post_id = $2`
    , [params.author_username, params.post_id])
    .then(res => res.rows.length > 0);
  if (!postExists) {
    client.query('ROLLBACK');
    client.release();
    return 'no such post';
  }
  const tipperExists = await client.query(
    `SELECT 1 FROM users WHERE username = $1`, [params.tipper_username])
    .then(res => res.rows.length > 0);
  if (!tipperExists) {
    client.query('ROLLBACK');
    client.release();
    return 'bad username';
  }
  const senderIsRecipient = await client.query(
    `SELECT 1 FROM users WHERE username = $1 OR username = $2`, [params.tipper_username, params.author_username])
    .then(res => res.rows.length < 2);
  if (senderIsRecipient) {
    client.query('ROLLBACK');
    client.release();
    return 'cannot tip yourself';
  }
  const alreadyExisted = await client.query(
    `SELECT 1
    FROM tips
    WHERE tipper_id = (SELECT id FROM users WHERE username = $1)
          AND receiver_id = (SELECT id FROM users WHERE username = $2)
          AND post_id = $3`, [params.tipper_username, params.author_username, params.post_id])
    .then(res => res.rows.length > 0);
  if (alreadyExisted) {
    client.query('ROLLBACK');
    client.release();
    return 'already tipped';
  }
  const sufficientFunds = await client.query(
    `SELECT balance
    FROM users
    WHERE username = $1`, [params.tipper_username])
    .then(res => res.rows[0].balance >= params.amount);
  if (!sufficientFunds) {
    client.query('ROLLBACK');
    client.release();
    return 'insufficient funds';
  }
  const res1 = await client.query(
    `UPDATE users
    SET balance = balance - $1
    WHERE username = $2
    RETURNING *`, [params.amount, params.tipper_username]);
  if (res1.rows.length !== 1) {
    console.error(`bug: tipPost UPDATE tipper returned ${JSON.stringify(res1)}`);
    console.error(params);
  }
  const res2 = await client.query(
    `UPDATE users
    SET balance = balance + $1
    WHERE username = $2
    RETURNING *`, [params.amount, params.author_username]);
  if (res2.rows.length !== 1) {
    console.error(`bug: tipPost UPDATE author returned ${JSON.stringify(res2)}`);
    console.error(params);
  }
  const res3 = await client.query(
    `INSERT INTO tips(tipper_id, receiver_id, post_id, amount)
    VALUES(
      (SELECT id FROM users WHERE username = $1),
      (SELECT id FROM users WHERE username = $2),
      $3,
      $4)
    RETURNING *`
    , [params.tipper_username, params.author_username, params.post_id, params.amount]);
  if (res3.rows.length !== 1) {
    console.error(`bug: tipPost INSERT returned ${res3.rows.length} rows`);
    console.error(params);
  }
  client.query('COMMIT');
  client.release();
  return 'ok';
}

export const getTipAmount = async (params: { author_username: string, tipper_username: string, post_id: number }) => {
  /* TODO: order by consistent */
  const res = await pool.query(
    `SELECT amount
    FROM tips
    WHERE receiver_id = (SELECT id FROM users WHERE username = $1)
          AND post_id = $2
          AND tipper_id = (SELECT id FROM users WHERE username = $3)`
    , [params.author_username, params.post_id, params.tipper_username]);
  if (res.rows.length === 0) {
    return undefined;
  }
  return res.rows[0];
}

export type Notification = {
  timestamp: string,
  message: string,
}

export const pollNotificationsOf = async (username: string): Promise<Notification[] | undefined> => {
  const userExists = await pool.query(
    `SELECT 1 FROM users WHERE username = $1`
    , [username])
    .then(res => res.rows.length > 0);
  if (!userExists) {
    return undefined;
  }
  const res = await pool.query(
    `WITH user_ AS (
      SELECT id, last_checked_notifications
      FROM users
      WHERE username = $1
    )
    SELECT timestamp, message, kind
    FROM notifications, user_
    WHERE notified_user_id = user_.id
          AND (user_.last_checked_notifications IS NULL
               OR user_.last_checked_notifications < timestamp)`
    , [username]);
  // TODO: fix race condition that could cause a notification made at this point to be missed
  await pool.query(
    `UPDATE users
    SET last_checked_notifications = now() at time zone 'utc'
    WHERE username = $1`
    , [username]);
  return res.rows;
}

export const addNotification = async (username: string, kind: 'money' | 'info', message: string) => {
  const res = await pool.query(
    `INSERT INTO notifications(notified_user_id, message, kind)
    VALUES((SELECT id FROM users WHERE username = $1), $2, $3)
    ON CONFLICT DO NOTHING
    RETURNING *`
    , [username, message, kind]);
    if (res.rows.length === 1) {
      return true;
    }
    return false;
}

export const searchResults = async (query: string, user: string) => {
  const likeParam = `%${query.replace('\\', '\\\\').replace('%', '\\%').replace('_', '\\_')}%`;
  const res = await pool.query(
    `WITH searching_user AS (SELECT id FROM users WHERE username = $2)
     SELECT username, EXISTS(SELECT 1 FROM subscriptions, searching_user WHERE creator_id = users.id AND follower_id = searching_user.id)
     AS is_following FROM users WHERE username LIKE $1 AND username != $2`, [likeParam, user]);
  return res.rows
}
