'use client';

import {
  Paper,
  Box,
  List,
  ListItem,
  CircularProgress,
  Pagination,
  Typography,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { PaginationData, Post } from '@/types';
import { PostCard } from './PostCard';
import { PostsHeader } from './PostsHeader';
import { useAdmin } from '@/hooks';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const { isAdmin } = useAdmin();
  const [paginationData, setPaginationData] = useState<PaginationData | null>(
    null
  );

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?page=${page}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();
      setPosts(data.posts);
      setPaginationData(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" my={2}>
        {error}
      </Typography>
    );
  }

  return (
    <Paper sx={{ p: 4 }}>
      <PostsHeader isAdmin={isAdmin} />

      <List sx={{ display: 'grid', gap: 2 }}>
        {posts.map((post) => (
          <ListItem key={post.id} sx={{ display: 'block', p: 0 }}>
            <PostCard post={post} />
          </ListItem>
        ))}
      </List>

      {paginationData && paginationData.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={paginationData.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
}
