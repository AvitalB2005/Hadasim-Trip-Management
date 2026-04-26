import pool from '../database/db.js';

async function getUserById(user_id) {
  try {
    const sql = 'SELECT * FROM Users WHERE user_id = ?';
    const [rows] = await pool.query(sql, [user_id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function registerUser(body) {
  const { user_id, full_name, password, role, class_id } = body;
  try {
    const sql = 'INSERT INTO Users (user_id, full_name, password, role, class_id) VALUES (?, ?, ?, ?, ?)';
    await pool.query(sql, [user_id, full_name, password, role, class_id]);
    return getUserById(user_id); 
  } catch (error) {
    throw error;
  }
}


