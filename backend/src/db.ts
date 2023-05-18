import { Pool, PoolClient } from 'pg';

/* we have a pool of connections to our database, which is
 * abstracted away as a Pool object. when we want to make a query,
 * we first have our pool provide us with a connection via
 *
 *   const client = await pool.connect()
 *
 * Then we can use client.query() (see the node pg docs) and when we
 * are finished, client.release()
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
  const client = await pool.connect()
  const res = await client.query('SELECT name from users where username = $1', [username])
  client.release()
  if (res.rows.length === 0) return undefined;
  return res.rows[0].name
};

export const getFollowers = async (username: string) => {
  const client = await pool.connect();
  const res = await client.query('SELECT id FROM users WHERE username = $1', [username]);
  if (res.rows.length === 0) return undefined;
  const uid = res.rows[0].id;
  const res2 = await client.query(
    `SELECT users.username
    FROM subscriptions
    JOIN users ON subscriptions.follower_id = users.id
    WHERE subscriptions.creator_id = $1`, [uid])
  client.release();
  return res2.rows.map(r => r.username);
};
