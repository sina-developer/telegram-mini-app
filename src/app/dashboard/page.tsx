import { Container, Box } from '@mui/material';
import PostsList from '@/components/dashboard/posts/PostsList';

export default function DashboardPage() {
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <PostsList />
      </Box>
    </Container>
  );
}
