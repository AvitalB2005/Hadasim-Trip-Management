import jwt from 'jsonwebtoken';

// פונקציה לבדיקת הטוקן והרשאות
export function verifyToken(roles = []) {
  return function (req, res, next) {
    // לוקחים את הטוקן מה-headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // אם אין טוקן בכלל - מחזירים שגיאה
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    // אימות של הטוקן מול המפתח הסודי
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // שומרים את פרטי המשתמש מהטוקן לשימוש בהמשך (id, role, class)
      req.user = decoded;

      // בודקים אם למשתמש יש את התפקיד המתאים לגשת לנתיב הזה
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'Access denied. Insufficient role.' });
      }
      next();
    });
  };
}