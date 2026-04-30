import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Container, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import fetchData from '../../service/FetchData.js';
import { TOKEN_KEY } from '../../constants.js';
import MapPage from '../map/MapPage.jsx';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('users');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [listError, setListError] = useState('');
  const [studentsNote, setStudentsNote] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassNumber, setNewClassNumber] = useState('');
  const [classSubmitError, setClassSubmitError] = useState('');
  const [classSuccess, setClassSuccess] = useState('');
  const [classSubmitting, setClassSubmitting] = useState(false);

  const loadUsers = useCallback(async () => {
    setListError('');
    setUsersLoading(true);
    try {
      const data = await fetchData('users', 'GET');
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setListError(e.message || 'שגיאה בטעינת משתמשות');
    } finally {
      setUsersLoading(false);
    }
  }, []);

  const loadStudents = useCallback(async () => {
    setListError('');
    setStudentsNote('');
    setStudentsLoading(true);
    try {
      const data = await fetchData('users/my-students', 'GET');
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      setStudents([]);
      setStudentsNote(e.message || 'לא ניתן לטעון תלמידות');
    } finally {
      setStudentsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return;
    if (activeView === 'users') loadUsers();
    if (activeView === 'students') loadStudents();
  }, [activeView, loadUsers, loadStudents]);

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    navigate('/login', { replace: true });
  }

  async function handleCreateClass(e) {
    e.preventDefault();
    setClassSubmitError('');
    setClassSuccess('');
    setClassSubmitting(true);
    try {
      await fetchData('classes', 'POST', {
        class_name: newClassName.trim(),
        class_number: newClassNumber.trim()
      });
      setClassSuccess('הכיתה נוספה בהצלחה');
      setNewClassName('');
      setNewClassNumber('');
    } catch (err) {
      setClassSubmitError(err.message || 'שגיאה בהוספת כיתה');
    } finally {
      setClassSubmitting(false);
    }
  }

  const filteredUsers = users.filter((u) => {
    if (roleFilter === 'all') return true;
    return u.role === roleFilter;
  });

  const usersEmpty = !usersLoading && !listError && filteredUsers.length === 0;
  const studentsEmpty = !studentsLoading && !listError && students.length === 0 && !studentsNote;

  function classDisplay(row) {
    if (row.class_name) return row.class_name;
    if (row.class_id != null && row.class_id !== '') return row.class_id;
    return '—';
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 2, sm: 3 },
        px: { xs: 2, sm: 3 },
        boxSizing: 'border-box'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap'
        }}
      >
        <Button variant="outlined" size="small" onClick={handleLogout}>
          התנתקות
        </Button>
      </Box>

      <Typography variant="h4" align="center" color="primary" gutterBottom sx={{ mt: { xs: 5, sm: 4 }, mb: 0 }}>
        מערכת ניהול הטיול
      </Typography>

      <Stack spacing={2} sx={{ mt: 2, width: '100%', alignItems: 'stretch' }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" useFlexGap sx={{ rowGap: 1 }}>
          <Button variant={activeView === 'users' ? 'contained' : 'outlined'} onClick={() => setActiveView('users')}>
            כל המשתמשות
          </Button>
          <Button variant={activeView === 'students' ? 'contained' : 'outlined'} onClick={() => setActiveView('students')}>
            התלמידות שלי
          </Button>
          <Button variant={activeView === 'add-class' ? 'contained' : 'outlined'} onClick={() => setActiveView('add-class')}>
            הוספת כיתה
          </Button>
          <Button variant={activeView === 'map' ? 'contained' : 'outlined'} onClick={() => setActiveView('map')}>
            מפה
          </Button>
        </Stack>

        {activeView === 'users' ? (
          <Paper sx={{ p: 2 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
              <Button size="small" variant={roleFilter === 'all' ? 'contained' : 'outlined'} onClick={() => setRoleFilter('all')}>כללי</Button>
              <Button size="small" variant={roleFilter === 'teacher' ? 'contained' : 'outlined'} onClick={() => setRoleFilter('teacher')}>מורות</Button>
              <Button size="small" variant={roleFilter === 'student' ? 'contained' : 'outlined'} onClick={() => setRoleFilter('student')}>תלמידות</Button>
            </Stack>

            {listError ? <Alert severity="error">{listError}</Alert> : null}
            {usersLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : (
              <TableContainer sx={{ maxWidth: 860, mx: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>שם משתמש</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>תעודת זהות</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>כיתה</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usersEmpty ? (
                      <TableRow><TableCell colSpan={3} align="center">אין נתונים להצגה</TableCell></TableRow>
                    ) : (
                      filteredUsers.map((u) => (
                        <TableRow key={u.user_id}>
                          <TableCell>{u.full_name}</TableCell>
                          <TableCell>{u.user_id}</TableCell>
                          <TableCell>{classDisplay(u)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        ) : null}

        {activeView === 'students' ? (
          <Paper sx={{ p: 2 }}>
            {listError ? <Alert severity="error">{listError}</Alert> : null}
            {studentsNote ? <Alert severity="info">{studentsNote}</Alert> : null}
            {studentsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
            ) : (
              <TableContainer sx={{ maxWidth: 860, mx: 'auto' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>שם משתמש</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>תעודת זהות</TableCell>
                      <TableCell sx={{ color: 'primary.main', fontWeight: 600 }}>כיתה</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {studentsEmpty ? (
                      <TableRow><TableCell colSpan={3} align="center">אין נתונים להצגה</TableCell></TableRow>
                    ) : (
                      students.map((s) => (
                        <TableRow key={s.user_id}>
                          <TableCell>{s.full_name}</TableCell>
                          <TableCell>{s.user_id}</TableCell>
                          <TableCell>{classDisplay(s)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        ) : null}

        {activeView === 'add-class' ? (
          <Paper sx={{ p: 2 }}>
            <Box component="form" onSubmit={handleCreateClass}>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <TextField label="שם כיתה" value={newClassName} onChange={(ev) => setNewClassName(ev.target.value)} required fullWidth />
                <TextField label="מספר כיתה" value={newClassNumber} onChange={(ev) => setNewClassNumber(ev.target.value)} required fullWidth />
                <Button type="submit" variant="contained" disabled={classSubmitting} sx={{ flexShrink: 0 }}>
                  {classSubmitting ? 'שולח...' : 'הוספה'}
                </Button>
              </Stack>
              {classSubmitError ? <Alert severity="error" sx={{ mt: 2 }}>{classSubmitError}</Alert> : null}
              {classSuccess ? <Alert severity="success" sx={{ mt: 2 }}>{classSuccess}</Alert> : null}
            </Box>
          </Paper>
        ) : null}

        {activeView === 'map' ? (
          <Paper sx={{ p: 2 }}>
            <MapPage embedded />
          </Paper>
        ) : null}
      </Stack>
    </Container>
  );
}
