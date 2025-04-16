import { Container, Box } from '@mui/material';
import NewPostForm from '@/components/dashboard/new-post/NewPostForm';

export default function NewPostPage() {
  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <NewPostForm />
      </Box>
    </Container>
  );
}
