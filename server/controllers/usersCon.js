import crypto from 'crypto';
import usersMod from '../models/usersMod.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//get user by id
export async function getUserById(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'הגישה נדחתה. נדרשת הרשאת מורה' });
        }

        const user = await usersMod.getUserById(req.params.id);
        if (!user) return res.status(404).json({ message: 'המשתמשת לא נמצאה' });

        res.json(user);
    } catch (error) {
        console.error('Get User By Id Error:', error);
        res.status(500).json({ message: 'שגיאה בשליפת משתמשת', error });
    }
}

//get all users
export async function getAllUser(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'הגישה נדחתה. נדרשת הרשאת מורה' });
        }

        const users = await usersMod.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Get All Users Error:', error);
        res.status(500).json({ message: 'שגיאה בשליפת משתמשות', error });
    }
}

//get students by class
export async function getStudentsByClass(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'הגישה נדחתה. נדרשת הרשאת מורה' });
        }

        if (!req.user.class_id) {
            return res.status(400).json({ message: 'למורה לא משויכת כיתה' });
        }

        const students = await usersMod.getStudentsByClass(req.user.class_id);
        res.json(students);
    } catch (error) {
        console.error('Get Students By Class Error:', error);
        res.status(500).json({ message: 'שגיאה בשליפת תלמידות', error });
    }
}

//login
export async function getUserByUserNamePassword(req, res) {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.status(400).json({ message: 'חובה לשלוח תעודת זהות וסיסמה' });
    }

    try {
        const user = await usersMod.getUserForLogin(user_id);
        if (!user) {
            return res.status(401).json({ message: 'תעודת זהות או סיסמה שגויות' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'תעודת זהות או סיסמה שגויות' });
        }

        if (user.role !== 'teacher') {
            return res.status(403).json({ message: 'הגישה נדחתה. התחברות מותרת למורה בלבד' });
        }

        const tokenPayload = {
            id: user.user_id,
            role: user.role,
            class_id: user.class_id
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        res.json({
            message: 'התחברות בוצעה בהצלחה',
            token,
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                role: user.role,
                class_id: user.class_id
            }
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'שגיאה בתהליך התחברות', error });
    }
}

export async function registerUser(req, res) {
    const { user_id, full_name, password, role, class_id, teacherCode } = req.body;
    const saltRounds = 10;

    try {
        if (role === 'teacher' && teacherCode !== process.env.TEACHER_SECRET_CODE) {
            return res.status(403).json({ message: 'קוד אימות מורה שגוי' });
        }

        const existingUser = await usersMod.getUserById(user_id);
        if (existingUser) {
            return res.status(409).json({ message: 'משתמשת עם תעודת זהות זו כבר קיימת במערכת' });
        }

        let plainPassword = password;
        if (role === 'student') {
            // תלמידות לא משתמשות בסיסמה באפליקציה; העמודה ב־DB נשמרת עם hash לערך אקראי שלא נחשף
            plainPassword = crypto.randomBytes(16).toString('hex');
        } else if (!password || String(password).length < 1) {
            return res.status(400).json({ message: 'חובה לבחור סיסמה למורה' });
        }

        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        const resolvedClassId =
            class_id === undefined || class_id === null || class_id === ''
                ? null
                : Number(class_id);

        const newUser = await usersMod.registerUser({
            user_id,
            full_name,
            password: hashedPassword,
            role,
            class_id: resolvedClassId
        });

        const { password: _, ...userSafeData } = newUser;

        res.status(201).json({
            message: 'הרישום בוצע בהצלחה',
            user: userSafeData
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'שגיאה בתהליך הרישום', error });
    }
}
