import usersMod from '../models/usersMod.js';
import bcrypt from 'bcrypt';

export async function registerUser(req, res) {
    const { user_id, full_name, password, role, class_id, teacherCode } = req.body;
    const saltRounds = 10;

    try {
        // בדיקת בטיחות למורה
        if (role === 'teacher' && teacherCode !== process.env.TEACHER_SECRET_CODE) {
            return res.status(403).json({ message: 'קוד אימות מורה שגוי' });
        }

        // בדיקה אם המשתמש כבר רשום
        const existingUser = await usersMod.getUserById(user_id);
        if (existingUser) {
            return res.status(409).json({ message: 'משתמש עם תעודת זהות זו כבר קיים במערכת' });
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
            message: 'הרישום בוצע בהצלחה',
            user: userSafeData 
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'שגיאת שרת פנימית בתהליך הרישום' });
    }
}