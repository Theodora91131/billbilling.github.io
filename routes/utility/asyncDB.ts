import mysql from 'mysql2/promise';

// Azure MySQL connection config
const config = {
  host: 'myway.mysql.database.azure.com',
  user: 'ntou',
  password: '01157CSEwork',
  database: 'account',
  port: 3306,
  ssl: {
    rejectUnauthorized: false
  }
};

// Create MySQL connection pool
const pool = mysql.createPool(config); 
pool.getConnection()
  .then((connection) => {
    console.log('MySQL connected successfully!');
    connection.release(); // Release the connection back to the pool
  })
  .catch((err) => {
    console.error(err);
  });
// Example async query
async function query(sql: string, values: any[] = []) {
  const [rows] = await pool.execute(sql, values);
  return rows;
}

// Export the query function
export { query };
