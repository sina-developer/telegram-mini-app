'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  List,
  ListItem,
  CircularProgress,
  Pagination,
  Button,
  Chip,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { useAdmin } from '@/lib/auth';

enum PostCategory {
  TECHNOLOGY = 'Technology',
  LIFESTYLE = 'Lifestyle',
  TRAVEL = 'Travel',
  FOOD = 'Food',
  OTHER = 'Other',
}

interface Post {
  id: string;
  title: string;
  description: string;
  category: PostCategory;
  imageUrl?: string;
  createdAt: Date;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

interface PostFormData {
  title: string;
  description: string;
  category: PostCategory;
  imageUrl: string;
}

const initialFormData: PostFormData = {
  title: '',
  description: '',
  category: PostCategory.OTHER,
  imageUrl: '',
};

export default function DashboardPage() {
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

  const getCategoryColor = (category: PostCategory) => {
    const colors: Record<
      PostCategory,
      | 'default'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning'
    > = {
      [PostCategory.TECHNOLOGY]: 'primary',
      [PostCategory.LIFESTYLE]: 'secondary',
      [PostCategory.TRAVEL]: 'success',
      [PostCategory.FOOD]: 'error',
      [PostCategory.OTHER]: 'default',
    };
    return colors[category];
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
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
                sx={{ mb: 3 }}
              >
                Create New Post
              </Button>
            )}
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" my={2}>
              {error}
            </Typography>
          ) : (
            <>
              <List sx={{ display: 'grid', gap: 2 }}>
                {posts.map((post) => (
                  <ListItem key={post.id} sx={{ display: 'block', p: 0 }}>
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
                          paragraph
                          sx={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {post.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Posted on:{' '}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Typography>
                      </CardContent>
                    </Card>
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
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
