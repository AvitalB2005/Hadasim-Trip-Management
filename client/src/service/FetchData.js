// שכבת API אחידה: כתובת בסיס, כותרת Authorization אם יש טוקן, טיפול בשגיאות JSON מהשרת
import { TOKEN_KEY } from '../constants.js';

const baseUrl = () => import.meta.env.VITE_API_URL || 'http://localhost:5000';

function errorMessageFromBody(data) {
  if (data?.message) return data.message;
  if (typeof data?.error === 'string') return data.error;
  if (data?.error?.message) return data.error.message;
  return 'שגיאה לא ידועה';
}

/**
 * @param {string} navigateString - נתיב אחרי /api/ (למשל 'classes', 'users/login')
 * @param {string} [methodType='GET']
 * @param {object|null} [dataContent=null] - גוף JSON ל־POST/PUT וכו'
 */
async function fetchData(navigateString, methodType = 'GET', dataContent = null) {
  const token = localStorage.getItem(TOKEN_KEY);

  const options = {
    method: methodType,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  };

  if (dataContent !== null && methodType !== 'GET') {
    options.body = JSON.stringify(dataContent);
  }

  const url = `${baseUrl()}/api/${navigateString.replace(/^\//, '')}`;
  const response = await fetch(url, options);//שליחה לשרת

  const data = await response.json();//קבלת מידע מהשרת

  if (!response.ok) {
    throw new Error(errorMessageFromBody(data));
  }

  return data;
}

export default fetchData;
