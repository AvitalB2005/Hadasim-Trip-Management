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

        const locations = await locationsMod.getAllLocations();
        console.log("!!! מה שהשרת קיבל מה-DB:", locations);
        res.json(locations);
    } catch (error) {
        console.error('Get Locations Error:', error);
        res.status(500).json({ message: 'שגיאה בשליפת מיקומים', error });
    }
}