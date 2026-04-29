import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';
import fetchData from '../service/FetchData.js';
import { TOKEN_KEY } from '../constants.js';

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
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" align="center" color="primary" gutterBottom>
        כניסת מורות למערכת הניהול
      </Typography>

      <Paper sx={{ p: 2, mt: 2 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="תעודת זהות (מורה)"
              value={userId}
              onChange={(ev) => setUserId(ev.target.value.replace(/\D/g, ''))}
              inputProps={{ maxLength: 9 }}
              required
              fullWidth
            />
            <TextField
              label="סיסמה"
              type="password"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
              fullWidth
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'מתחברת...' : 'כניסה'}
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Button variant="outlined" component={RouterLink} to="/register">
          חזרה להרשמה
        </Button>
      </Box>
    </Container>
  );
}
