// מסך סיום אחרי רישום תלמידה — הודעה מגיעה ב-navigate(..., { state: { message } })
import { useLocation, Link } from 'react-router-dom';

export default function EndPage() {
  const location = useLocation();
  const message = location.state?.message || 'נרשמת בהצלחה';

  return (
    <div className="page">
      <h1>{message}</h1>
      <p>
        <Link to="/register">חזרה להרשמה</Link>
      </p>
    </div>
  );
}
