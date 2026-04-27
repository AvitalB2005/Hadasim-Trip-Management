import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TOKEN_KEY } from '../constants.js';

// דשבורד מוגן: בלי טוקן — מפנים להתחברות מורה.
export default function DashboardPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login', { replace: true });
  }

  return (
    <div className="page">
      <h1>דשבורד מורה</h1>
      <p>כאן יופיעו בהמשך פעולות המורה והמפה.</p>
      <p>
        <button type="button" onClick={handleLogout}>
          התנתקות
        </button>
        {' · '}
        <Link to="/register">הרשמה</Link>
      </p>
    </div>
  );
}
