import pool from '../database/db.js';

async function getAllClasses() {
  const sql = 'SELECT class_id, class_name FROM Classes ORDER BY class_name';
  const [rows] = await pool.query(sql);
  return rows;
}

async function getClassByName(className) {
  const sql = 'SELECT class_id, class_name FROM Classes WHERE class_name = ?';
  const [rows] = await pool.query(sql, [className]);
  return rows[0];
}

async function addClass(className) {
  const sql = 'INSERT INTO Classes (class_name) VALUES (?)';
  const [result] = await pool.query(sql, [className]);
  return { class_id: result.insertId, class_name: className };
}

export default {
  getAllClasses,
  getClassByName,
  addClass
};
