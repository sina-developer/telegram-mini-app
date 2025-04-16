import { Container, Typography, Paper, Box } from '@mui/material';

export default function AdminDashboardPage() {
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to the admin dashboard! You have access to all
            administrative features.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: Administrator
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
