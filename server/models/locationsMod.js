import pool from '../database/db.js';

async function upsertLocation({ user_id, latitude, longitude, event_time }) {
  const sql = `INSERT INTO Locations (user_id, latitude, longitude, event_time)VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      latitude = VALUES(latitude),
      longitude = VALUES(longitude),
      event_time = VALUES(event_time)
  `;
  await pool.query(sql, [user_id, latitude, longitude, event_time]);
}

export default {
  upsertLocation
};
