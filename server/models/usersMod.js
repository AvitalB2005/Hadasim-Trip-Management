import pool from '../database/db.js';

async function getUserById(user_id) {
  try {
    const sql = 'SELECT user_id, full_name, role, class_id FROM users WHERE user_id = ?';
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
    return { user_id, full_name, role, class_id };
  } catch (error) {
    throw error;
  }
}
async function getUserForLogin(user_id) {
  try {
    const sql = 'SELECT user_id, full_name, password, role, class_id FROM Users WHERE user_id = ?';
    const [rows] = await pool.query(sql, [user_id]);
    return rows[0];
  } catch (error) {
    throw error;
  }
}

async function getAllUsers() {
  try {
    const sql = `
      SELECT u.user_id, u.full_name, u.role, u.class_id, c.class_name AS class_name
      FROM Users u
      LEFT JOIN Classes c ON c.class_id = u.class_id
      ORDER BY u.full_name
    `;
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getStudentsByClass(class_id) {
  try {
    const sql = `
      SELECT u.user_id, u.full_name, u.role, u.class_id, c.class_name AS class_name
      FROM Users u
      LEFT JOIN Classes c ON c.class_id = u.class_id
      WHERE u.role = 'student' AND u.class_id = ?
      ORDER BY u.full_name
    `;
    const [rows] = await pool.query(sql, [class_id]);
    return rows;
  } catch (error) {
    throw error;
  }
}

export default {
  registerUser,
  getUserById,
  getUserForLogin,
  getAllUsers,
  getStudentsByClass
};