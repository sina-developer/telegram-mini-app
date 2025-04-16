import { Container, Typography, Paper, Box } from '@mui/material';

export default function DashboardPage() {
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1">
            Welcome to your dashboard! You are successfully logged in.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
