"use strict";
// import mysql, { Pool, PoolOptions } from 'mysql2/promise';
// import * as config from '../../lib/config';
// // Assuming config has the necessary properties for the database connection
// const poolConfig: PoolOptions = config as PoolOptions;
// // Create MySQL connection pool
// const pool: Pool = mysql.createPool(poolConfig);
// // Export the pool instance
// export { pool };
// pool.getConnection()
//   .then((connection) => {
//     console.log('MySQL connected successfully!');
//     connection.release(); // Release the connection back to the pool
//   })
//   .catch((err) => {
//     console.error(err);
//   });
// // Example async query
// async function query(sql: string, values: any[] = []) {
//   const [rows] = await pool.execute(sql, values);
//   return rows;
// }
// // Export the query function
// export default query;
