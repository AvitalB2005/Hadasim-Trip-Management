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

export async function createClass(req, res) {
  const { class_name, className, class_number, classNumber } = req.body;
  const normalizedName = (class_name ?? className ?? '').toString().trim();
  const normalizedNumber = (class_number ?? classNumber ?? '').toString().trim();
  const fullClassName = normalizedName && normalizedNumber
    ? `${normalizedName}-${normalizedNumber}`
    : `${normalizedName}${normalizedNumber}`.trim();

  if (!fullClassName) {
    return res.status(400).json({ message: 'חובה לשלוח שם כיתה ומספר כיתה' });
  }

  try {
    const existing = await classesMod.getClassByName(fullClassName);
    if (existing) {
      return res.status(409).json({ message: 'כיתה כזו כבר קיימת במערכת', classItem: existing });
    }

    const classItem = await classesMod.addClass(fullClassName);
    return res.status(201).json({
      message: 'הכיתה נוספה בהצלחה',
      classItem
    });
  } catch (error) {
    console.error('Create Class Error:', error);
    return res.status(500).json({ message: 'שגיאה בהוספת כיתה', error });
  }
}
