'use client';

import { Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';

interface PostsHeaderProps {
  isAdmin: boolean;
}

export function PostsHeader({ isAdmin }: PostsHeaderProps) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={3}
    >
      <Typography variant="h4" component="h1">
        Posts
      </Typography>
      {isAdmin && (
        <Button
          component={Link}
          href="/dashboard/new-post"
          variant="contained"
          startIcon={<AddIcon />}
          // sx={{ mb: 3 }}
        >
          Create New Post
        </Button>
      )}
    </Box>
  );
}
