import locationsMod from '../models/locationsMod.js';
import convertCoordinates from '../utils/convertCoordinates.js';

function toMySqlDatetime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export async function importLocations(req, res) {
  const payload = Array.isArray(req.body) ? req.body : req.body?.records;
  if (!Array.isArray(payload) || payload.length === 0) {
    return res.status(400).json({ message: 'חובה לשלוח מערך רשומות מיקום' });
  }

  const errors = [];
  let saved = 0;

  for (let i = 0; i < payload.length; i += 1) {
    const row = payload[i];
    try {
      const user_id = String(row.ID || '').trim();
      if (!/^\d{9}$/.test(user_id)) {
        throw new Error('ID חייב להכיל 9 ספרות');
      }

      const { latitude, longitude } = convertCoordinates(row.Coordinates);
      const event_time = toMySqlDatetime(row.Time);
      if (!event_time) {
        throw new Error('Time לא בפורמט תאריך תקין');
      }

      await locationsMod.upsertLocation({ user_id, latitude, longitude, event_time });
      saved += 1;
    } catch (err) {
      errors.push({
        index: i,
        id: row?.ID ?? null,
        message: err.message || 'שגיאה לא ידועה'
      });
    }
  }

  return res.status(errors.length ? 207 : 200).json({
    message: errors.length ? 'הייבוא הושלם עם שגיאות חלקיות' : 'הייבוא הושלם בהצלחה',
    total: payload.length,
    saved,
    failed: errors.length,
    errors
  });
}
