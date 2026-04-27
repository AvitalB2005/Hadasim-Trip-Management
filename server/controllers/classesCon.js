import classesMod from '../models/classesMod.js';

export async function getAllClasses(req, res) {
  try {
    const classes = await classesMod.getAllClasses();
    res.json(classes);
  } catch (error) {
    console.error('Get All Classes Error:', error);
    res.status(500).json({ message: 'שגיאה בשליפת כיתות', error });
  }
}
