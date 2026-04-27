import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import fetchData from '../service/FetchData.js';
import { TOKEN_KEY } from '../constants.js';

// התחברות מורה בלבד (השרת דוחה תלמידה). אחרי הצלחה — שמירת JWT ומעבר לדשבורד.
export default function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await fetchData('users/login', 'POST', {
        user_id: userId.trim(),
        password
      });
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
      }
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'שגיאת התחברות');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h1>כניסת מורות למערכת הניהול</h1>
      <p>
        <Link to="/register">חזרה להרשמה</Link>
      </p>

      <form onSubmit={handleSubmit} className="register-form">
        <label>
          תעודת זהות (מורה)
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
          סיסמה
          <input
            type="password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'מתחברת...' : 'כניסה'}
        </button>
      </form>
    </div>
  );
}
