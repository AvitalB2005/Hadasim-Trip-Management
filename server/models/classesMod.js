import pool from '../database/db.js';

async function getAllClasses() {
  const sql = 'SELECT class_id, class_name FROM Classes ORDER BY class_name';
  const [rows] = await pool.query(sql);
  return rows;
}

export default {
  getAllClasses
};
