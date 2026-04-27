# מפת קבצים בצד לקוח (הסבר לעצמי)

## נקודת כניסה

- **`main.jsx`** — מרנדר את React ל־DOM, עוטף ב־`BrowserRouter` כדי שניווט יעבוד בכל האפליקציה.

## ניווט ועמודים

- **`App.jsx`** — רק הגדרת נתיבים; אין UI כאן.
- **`pages/RegisterPage.jsx`** — טופס הרשמה; טוען כיתות; שולח register; תלמידה → `/end`; מורה → login → דשבורד.
- **`pages/LoginPage.jsx`** — התחברות מורה בלבד; שומר טוקן; מעבר לדשבורד.
- **`pages/EndPage.jsx`** — הודעה אחרי רישום תלמידה (`location.state.message`).
- **`pages/DashboardPage.jsx`** — מוגן: בלי טוקן → `/login`; כפתור התנתקות.

## שירותים וקבועים

- **`service/FetchData.js`** — פונקציה אחת לכל `fetch` ל־API: כתובת בסיס מ־`.env`, הוספת Bearer אם יש טוקן, זריקת שגיאה עם הודעה אם לא `ok`.
- **`constants.js`** — `TOKEN_KEY` — שם המפתח ב־localStorage (מקום אחד לשינוי עתידי).

## עיצוב

- **`App.css`** — עיצוב טפסים בסיסי.
- **`index.css`** — ברירת מחדל גלובלית מ־Vite.

## סביבה

- **`.env.example`** — `VITE_API_URL` (כתובת השרת). להעתיק ל־`.env` מקומי.
