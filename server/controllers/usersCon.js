import usersMod from '../models/usersMod.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//get user by id
export async function getUserById(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teacher role is required' });
        }

        // שליפה של משתמשת ספציפית לפי ת"ז מהנתיב
        const user = await usersMod.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Get User By Id Error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching user' });
    }
}
//get all users
export async function getAllUser(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teacher role is required' });
        }

        const users = await usersMod.getAllUsers();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Get All Users Error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching users' });
    }
}
//get students by class
export async function getStudentsByClass(req, res) {
    try {
        if (req.user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teacher role is required' });
        }

        if (!req.user.class_id) {
            return res.status(400).json({ message: 'Teacher is not assigned to any class' });
        }

        // שולף רק תלמידות של הכיתה של המורה המחוברת
        const students = await usersMod.getStudentsByClass(req.user.class_id);
        return res.status(200).json(students);
    } catch (error) {
        console.error('Get Students By Class Error:', error);
        return res.status(500).json({ message: 'Internal server error while fetching students' });
    }
}
//login
export async function getUserByUserNamePassword(req, res) {
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.status(400).json({ message: 'user_id and password are required' });
    }

    try {
        const user = await usersMod.getUserForLogin(user_id);
        if (!user) {
            return res.status(401).json({ message: 'Invalid user ID or password' });
        }
//משווה את הסיסמא שהוקלדה מול מסד הנתונים
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid user ID or password' });
        }
        // לפי הדרישות רק מורה יכולה להתחבר למערכת
        if (user.role !== 'teacher') {
            return res.status(403).json({ message: 'Access denied. Teacher login only' });
        }

        const tokenPayload = {
            id: user.user_id,
            role: user.role,
            class_id: user.class_id
        };
//חתימת מפתח סודי
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES
        });

        return res.status(200).json({
            message: 'Login successful',
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
        return res.status(500).json({ message: 'Internal server error during login' });
    }
}

export async function registerUser(req, res) {
    const { user_id, full_name, password, role, class_id, teacherCode } = req.body;
    const saltRounds = 10;

    try {
        // בדיקת בטיחות למורה
        if (role === 'teacher' && teacherCode !== process.env.TEACHER_SECRET_CODE) {
            return res.status(403).json({ message: 'Invalid teacher verification code' });
        }

        // בדיקה אם המשתמש כבר רשום
        const existingUser = await usersMod.getUserById(user_id);
        if (existingUser) {
            return res.status(409).json({ message: 'A user with this ID already exists' });
        }

        // הצפנת הסיסמה (Hashing)
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // שמירה בבסיס הנתונים
        const newUser = await usersMod.registerUser({
            user_id,
            full_name,
            password: hashedPassword, // שמירת סיסמא מוצפנת
            role,
            class_id
        });

       const { password: _, ...userSafeData } = newUser;

        // שליחת הודעת הצלחה (201) עם הנתונים המוגנים בלבד
        // עכשיו ה-React מקבל את ה-user_id, השם והתפקיד, אבל לא את ה-Hash של הסיסמה
        res.status(201).json({
            message: 'Registration completed successfully',
            user: userSafeData 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Internal server error during registration' });
    }
}