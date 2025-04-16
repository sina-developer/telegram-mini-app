'use client';

import {
  Paper,
  Box,
  List,
  ListItem,
  CircularProgress,
  Typography,
} from '@mui/material';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Post } from '@/types';
import { PostCard } from './PostCard';
import { PostsHeader } from './PostsHeader';
import { useAdmin } from '@/hooks';

export default function PostsList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { isAdmin } = useAdmin();
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchPosts = async (pageNumber: number) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?page=${pageNumber}&limit=10`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await response.json();

      if (pageNumber === 1) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setHasMore(data.pagination.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  if (error && posts.length === 0) {
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

      <Box ref={loaderRef} display="flex" justifyContent="center" my={3}>
        {loading && <CircularProgress />}
        {!hasMore && posts.length > 0 && (
          <Typography color="textSecondary">No more posts to load</Typography>
        )}
      </Box>
    </Paper>
  );
}
