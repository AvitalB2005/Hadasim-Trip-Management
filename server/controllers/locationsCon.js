import locationsMod from '../models/locationsMod.js';
import { convertCoordinates } from '../utils/convertCoordinates.js';

export async function importLocations(req, res) {
  const { ID, Coordinates, Time } = req.body;
  // שליפת המפתח מהכותרות (Headers)
  const apiKey = req.headers['x-api-key']; 

  try {
      // בדיקה: האם המפתח שהגיע תואם למפתח הסודי שלנו?
      if (apiKey !== process.env.DEVICE_SECRET_KEY) {
          return res.status(401).json({ message: 'גישה למכשיר לא מורשית' });
      }
      if (!ID || !Coordinates || !Time) {
          return res.status(400).json({ message: 'נתוני מיקום חסרים' });
      }
      const { latitude, longitude } = convertCoordinates(Coordinates);
      const dateObj = new Date(Time);//המרה לאוביקט זמן
      const mysqlTime = dateObj.toISOString().slice(0, 19).replace('T', ' ');//המרה לפורמט של MySQL

      const updatedLocation = await locationsMod.upsertLocation(ID, latitude, longitude, mysqlTime);

      res.status(201).json({ message: 'Location updated', location: updatedLocation });
  } catch (error) {
      console.error('Update Location Error:', error);
      res.status(500).json({ message: 'שגיאה בעדכון מיקום', error });
  }
}

export async function getAllStudentLocations(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'גישה מורשית למורות בלבד' });
        }

        if (!req.user.class_id) {
            return res.status(400).json({ message: 'למורה לא משויכת כיתה' });
        }

        const rows = await locationsMod.getLocationsForTeacher(req.user.class_id, req.user.id);
        const teacherLocation = rows.find((row) => String(row.user_id) === String(req.user.id)) || null;
        const students = rows.filter((row) => row.role === 'student');

        res.json({
            teacherLocation,
            students
        });
    } catch (error) {
        console.error('Get Locations Error:', error);
        res.status(500).json({ message: 'שגיאה בשליפת מיקומים', error });
    }
}