// דף הרשמה: טעינת כיתות (GET ציבורי), שליחת register, תלמידה→/end, מורה→login+שמירת טוקן→/dashboard
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchData('classes', 'GET');
        if (!cancelled) setClasses(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setClassesError(e.message || 'שגיאה בטעינת כיתות');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    const body = {
      user_id: userId.trim(),
      full_name: fullName.trim(),
      password,
      role,
      class_id: classId === '' ? null : Number(classId)
    };
    if (role === 'teacher') {
      body.teacherCode = teacherCode;
    }

    try {
      const data = await fetchData('users/register', 'POST', body);

      if (role === 'student') {
        navigate('/end', {
          replace: true,
          state: { message: data.message || 'נרשמת בהצלחה' }
        });
        return;
      }

      const loginData = await fetchData('users/login', 'POST', {
        user_id: userId.trim(),
        password
      });

      if (loginData.token) {
        localStorage.setItem(TOKEN_KEY, loginData.token);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'שגיאת רשת');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page register-page">
      <h1>הרשמה</h1>
      <p className="register-links">
        <Link to="/login">כבר רשומה? כניסת מורות למערכת הניהול</Link>
      </p>

      {classesError ? <p className="form-error">{classesError}</p> : null}

      <form onSubmit={handleSubmit} className="register-form">
        <label>
          תעודת זהות (9 ספרות)
          <input
            type="text"
            inputMode="numeric"
            maxLength={9}
            value={userId}
            onChange={(ev) => setUserId(ev.target.value.replace(/\D/g, ''))}
            required
          />
        </label>

        <label>
          שם מלא
          <input
            type="text"
            value={fullName}
            onChange={(ev) => setFullName(ev.target.value)}
            required
          />
        </label>

        <label>
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </label>

        <label>
          כיתה
          <select
            value={classId}
            onChange={(ev) => setClassId(ev.target.value)}
            required
          >
            <option value="">בחרי כיתה</option>
            {classes.map((c) => (
              <option key={c.class_id} value={c.class_id}>
                {c.class_name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="role-fieldset">
          <legend>תפקיד</legend>
          <label className="inline">
            <input
              type="radio"
              name="role"
              value="student"
              checked={role === 'student'}
              onChange={() => setRole('student')}
            />
            תלמידה
          </label>
          <label className="inline">
            <input
              type="radio"
              name="role"
              value="teacher"
              checked={role === 'teacher'}
              onChange={() => setRole('teacher')}
            />
            מורה
          </label>
        </fieldset>

        {role === 'teacher' ? (
          <label>
            קוד אימות מורה
            <input
              type="password"
              value={teacherCode}
              onChange={(ev) => setTeacherCode(ev.target.value)}
              required
            />
          </label>
        ) : null}

        {submitError ? <p className="form-error">{submitError}</p> : null}

        <button type="submit" disabled={submitting || !!classesError}>
          {submitting ? 'שולח...' : 'הרשמה'}
        </button>
      </form>
    </div>
  );
}
