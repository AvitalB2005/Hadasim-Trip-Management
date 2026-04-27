import jwt from 'jsonwebtoken';

// פונקציה לבדיקת הטוקן והרשאות
export function verifyToken(roles = []) {
  return function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'טוקן גישה חסר' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'טוקן לא תקין', error: err });
      }

      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: 'הגישה נדחתה. אין הרשאה מתאימה' });
      }
      next();
    });
  };
}
