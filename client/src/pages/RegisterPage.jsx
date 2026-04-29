import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Alert, Box, Button, Container, FormControl, FormControlLabel,
  FormLabel, InputLabel, Link, MenuItem, Paper, Radio, RadioGroup,
  Select, Stack, TextField, Typography
} from '@mui/material';
import fetchData from '../service/FetchData.js';
import { TOKEN_KEY } from '../constants.js';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [classId, setClassId] = useState('');
  const [teacherCode, setTeacherCode] = useState('');
  const [classes, setClasses] = useState([]);
  const [classesError, setClassesError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ולידציה לסיסמה: לפחות 6 תווים, אות אחת ומספר אחד
  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(password);

  // טעינת רשימת כיתות מהשרת
  useEffect(() => {
    async function getClasses() {
      try {
        const data = await fetchData('classes', 'GET');
        setClasses(Array.isArray(data) ? data : []);
      } catch (e) {
        setClassesError(e.message || 'שגיאה בטעינת כיתות');
      }
    }
    getClasses();
  }, []);

  // ניקוי שדות ושגיאות בעת מעבר בין תפקיד תלמידה למורה
  useEffect(() => {
    if (role !== 'teacher') {
      setPassword('');
      setTeacherCode('');
    }
    setSubmitError('');
  }, [role]);

  async function handleSubmit(e) {
    // מניעת רענון הדף
    e.preventDefault();
    setSubmitError('');

    // בדיקת שם מלא (חובה)
    if (!fullName.trim()) {
      setSubmitError('נא להזין שם מלא');
      return;
    }

    // בדיקת תעודת זהות (בדיוק 9 ספרות)
    if (userId.length !== 9) {
      setSubmitError('תעודת זהות חייבת להכיל בדיוק 9 ספרות');
      return;
    }

    // בדיקת בחירת כיתה
    if (!classId) {
      setSubmitError('נא לבחור כיתה מהרשימה');
      return;
    }

    // בדיקות אבטחה למורה בלבד
    if (role === 'teacher') {
      if (!isPasswordValid) {
        setSubmitError('הסיסמה חייבת לכלול לפחות 6 תווים, אות ומספר');
        return;
      }
      if (!teacherCode.trim()) {
        setSubmitError('נא להזין קוד אימות מורה');
        return;
      }
    }

    setSubmitting(true);

    const body = {
      user_id: userId.trim(),
      full_name: fullName.trim(),
      role,
      class_id: Number(classId),
      ...(role === 'teacher' && { password, teacherCode })
    };

    try {
      const data = await fetchData('users/register', 'POST', body);

      if (role === 'student') {
        navigate('/end', {
          replace: true,
          state: { message: data.message || 'נרשמת בהצלחה' }
        });
        return;
      }

      // התחברות אוטומטית למורות כדי לחסוך להן כניסה נוספת
      const loginData = await fetchData('users/login', 'POST', {
        user_id: userId.trim(),
        password
      });
      if (loginData.token) {
        localStorage.setItem(TOKEN_KEY, loginData.token);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // הצגת שגיאות שרת (כמו "משתמש קיים") בפורמט זהה ל-Login
      setSubmitError(err.message || 'שגיאת רשת');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" align="center" color="primary" gutterBottom sx={{ fontWeight: 'bold' }}>
        טופס הרשמה לטיול
      </Typography>

      {/* שגיאה בטעינת הנתונים הראשונית */}
      {classesError ? <Alert severity="warning" sx={{ mb: 2 }}>{classesError}</Alert> : null}

      <Paper sx={{ p: 3, mt: 2, borderRadius: 2 }}>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Stack spacing={2.5}>          
            <TextField
              label="שם מלא"
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              required
              fullWidth
            />
            
            <TextField
              label="תעודת זהות"
              value={userId}
              onChange={(ev) => setUserId(ev.target.value.replace(/\D/g, ''))}
              inputProps={{ maxLength: 9 }}
              required
              fullWidth
            />

            <FormControl fullWidth required disabled={!!classesError}>
              <InputLabel id="class-label">כיתה</InputLabel>
              <Select
                labelId="class-label"
                label="כיתה"
                value={classId}
                onChange={(ev) => setClassId(ev.target.value)}
              >
                <MenuItem value=""><em>בחרי כיתה</em></MenuItem>
                {classes.map((c) => (
                  <MenuItem key={c.class_id} value={String(c.class_id)}>
                    {c.class_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel>תפקיד</FormLabel>
              <RadioGroup row value={role} onChange={(ev) => setRole(ev.target.value)}>
                <FormControlLabel value="student" control={<Radio />} label="תלמידה" />
                <FormControlLabel value="teacher" control={<Radio />} label="מורה" />
              </RadioGroup>
            </FormControl>

            {role === 'teacher' && (
              <Stack spacing={2}>
                <TextField
                  label="סיסמה"
                  type="password"
                  value={password}
                  onChange={(ev) => setPassword(ev.target.value)}
                  required
                  fullWidth
                />
                <TextField
                  label="קוד אימות מורה"
                  type="password"
                  value={teacherCode}
                  onChange={(ev) => setTeacherCode(ev.target.value)}
                  required
                  fullWidth
                />
              </Stack>
            )}

            {submitError ? <Alert severity="error">{submitError}</Alert> : null}

            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              disabled={submitting || !!classesError}
            >
              {submitting ? 'שולח...' : 'הרשמה'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Link component={RouterLink} to="/login" underline="hover" color="primary">
          כבר רשומה? כניסה למערכת הניהול
        </Link>
      </Box>
    </Container>
  );
}