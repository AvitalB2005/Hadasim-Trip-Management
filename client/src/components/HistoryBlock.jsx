import { useEffect } from 'react';

/**
 * מבטל מעבר אחורה עם חצי הדפדפן: אחרי popstate מחזירים קדימה.
 * לא חוסם יציאה לאתר שביקרו בו לפני הכניסה ל-SPA (אין רשומה קדימה).
 */
export default function HistoryBlock() {
  useEffect(() => {
    const onPopState = () => {
      window.history.go(1);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  return null;
}
