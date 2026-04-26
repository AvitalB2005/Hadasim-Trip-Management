import jwt from 'jsonwebtoken';
export function verifyToken(roles = []) {
  return function (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access token is missing' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          const payload = jwt.decode(token);
          if (!payload) {
            return res.status(403).json({ message: 'Invalid token' });
          }

          const newToken = jwt.sign(
            { id: payload.id, role: payload.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES }
          );

          res.setHeader('x-new-token', newToken);
          req.user = payload;

          if (roles.length && !roles.includes(payload.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient role.' });
          }

          return next();
        } else {
          return res.status(403).json({ message: 'Invalid token' });
        }
      } else {
        req.user = decoded;

        if (roles.length && !roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Access denied. Insufficient role.' });
        }
        return next();
      }
    });
  }
  
}