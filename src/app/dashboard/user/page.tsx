import { Container, Typography, Paper, Box } from '@mui/material';

export default function UserDashboardPage() {
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            User Dashboard
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to your dashboard! You have access to user-level features.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Role: User
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
