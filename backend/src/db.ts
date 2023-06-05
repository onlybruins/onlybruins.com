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

export const addFollower = async (params: { creator_username: string, follower_username: string }) => {
  const res = await pool.query(
    `INSERT INTO subscriptions(follower_id, creator_id)
    VALUES((SELECT id FROM users WHERE username = $1), (SELECT id FROM users WHERE username = $2))
    ON CONFLICT DO NOTHING`, [params.follower_username, params.creator_username]);
  if (res.rows.length > 0) {
    // successfully followed
    return true;
  }
  else {
    const res2 = await pool.query(
      `SELECT 1
      FROM users
      WHERE username = $1 OR username = $2`,
      [params.follower_username, params.creator_username]);
    // OK if the users exist (attempted to follow again), not OK otherwise
    return res2.rows.length == 2;
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

export type TipPostResult = Promise<'ok' | 'already tipped' | 'bad username' | 'bad amount' | 'no such post' | 'insufficient funds'>;
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
