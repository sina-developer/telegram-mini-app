'use client';

import {
  Typography,
  Chip,
  Card,
  CardContent,
  CardMedia,
  Box,
} from '@mui/material';
import { Post } from '@/types';
import { getCategoryColor } from '@/utils/category.utils';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card>
      {post.imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={post.imageUrl}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography
            variant="h6"
            component="h2"
            sx={{ wordBreak: 'break-word' }}
          >
            {post.title}
          </Typography>
          <Chip
            label={post.category}
            color={getCategoryColor(post.category)}
            size="small"
            sx={{ ml: 2, flexShrink: 0 }}
          />
        </Box>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {post.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Posted on: {new Date(post.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}
