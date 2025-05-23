'use client';

import { Container, Paper, Box } from '@mui/material';
import LoginForm from '@/components/login/LoginForm';

export default function LoginPage() {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 260,
          }}
        >
          <LoginForm />
        </Paper>
      </Box>
    </Container>
  );
}
