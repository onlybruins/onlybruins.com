import { Pool } from 'pg';

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
  database: 'onlybruins-local'
})

/* we add onlybruins to the search path so we don't need to fully qualify
 * our table names, for instance */
pool.on('connect', (client) => {
  client.query('SET search_path TO onlybruins,public');
});

export const getAssociatedName = async (email: string) => {
  const client = await pool.connect()
  const res = await client.query('SELECT name from users where email = $1', [email])
  client.release()
  if (res.rows.length === 0) return undefined;
  return res.rows[0].name
};
