import { Link as RouterLink } from 'react-router-dom';
import { Button, Container, Paper, Stack, Typography } from '@mui/material';

export default function EndPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" align="center">
            {'ההרשמה הושלמה בהצלחה'}
          </Typography>
          <Button component={RouterLink} to="/register" variant="outlined">
            חזרה להרשמה
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
