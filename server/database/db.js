import mysql from 'mysql2'; 
import dotenv from 'dotenv';
//קורא קובץ .env
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
}).promise();

// Check connection
pool.query('SELECT 1')
  .then(() => {
    console.log('Connected to MySQL database!');
  })
  .catch((err) => {
    console.error('Error connecting to MySQL:', err.message);
  });

export default pool;