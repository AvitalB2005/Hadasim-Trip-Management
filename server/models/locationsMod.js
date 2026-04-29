import pool from '../database/db.js';

async function upsertLocation(user_id, lat, lng, event_time) {
  try {
    const sql = `
      INSERT INTO Locations (user_id, latitude, longitude, event_time)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        latitude = VALUES(latitude), 
        longitude = VALUES(longitude), 
        event_time = VALUES(event_time)
    `;
    const [result] = await pool.query(sql, [user_id, lat, lng, event_time]);
    return { user_id, latitude: lat, longitude: lng, event_time };
  } catch (error) {
    throw error;
  }
}

async function getAllLocations() {
  try {
    const sql = `
      SELECT 
       l.user_id, 
       l.latitude, 
       l.longitude, 
       l.event_time, 
       u.full_name, 
       u.role, 
       u.class_id 
     FROM Locations l
  JOIN Users u ON l.user_id = u.user_id
`;
    const [rows] = await pool.query(sql);
    return rows;
  } catch (error) {
    throw error;
  }
}

export default {
  upsertLocation,
  getAllLocations
};