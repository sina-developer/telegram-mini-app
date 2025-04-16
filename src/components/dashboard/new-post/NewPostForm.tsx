'use client';

import {
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FORM_CATEGORIES, FORM_IMAGE } from '@/constants/form.constants';
import { FormCategory } from '@/types';
import { postSchema, PostFormData } from '@/schemas';
import ImagePreview from './ImagePreview';

export default function NewPostForm() {
  const router = useRouter();
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    control,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      imageUrl: '',
      imageFile: undefined,
      title: '',
      description: '',
      category: 'technology',
    },
  });

  const watchImageUrl = watch('imageUrl');
  const watchImageFile = watch('imageFile');

  useEffect(() => {
    if (useImageUrl && watchImageUrl) {
      setPreviewUrl(watchImageUrl);
    } else if (!useImageUrl && watchImageFile instanceof File) {
      const fileUrl = URL.createObjectURL(watchImageFile);
      setPreviewUrl(fileUrl);
      return () => URL.revokeObjectURL(fileUrl);
    } else {
      setPreviewUrl('');
    }
  }, [watchImageUrl, watchImageFile, useImageUrl]);

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async (data: PostFormData) => {
    try {
      const postData = {
        title: data.title,
        description: data.description,
        category: data.category,
        imageUrl: useImageUrl ? data.imageUrl : undefined,
      };

      if (!useImageUrl && data.imageFile) {
        const formData = new FormData();
        formData.append('file', data.imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const { imageUrl } = await uploadResponse.json();
        postData.imageUrl = imageUrl;
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.errors?.join(', ') || 'Failed to create post');
      }

      reset();
      setPreviewUrl('');
      setSnackbar({
        open: true,
        message: 'Post created successfully!',
        severity: 'success',
      });

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error creating post:', error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error ? error.message : 'Failed to create post',
        severity: 'error',
      });
    }
  };

  const handleImageSwitch = () => {
    setUseImageUrl(!useImageUrl);
    setPreviewUrl('');
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Post
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Switch checked={useImageUrl} onChange={handleImageSwitch} />
          }
          label={useImageUrl ? 'Using Image URL' : 'Using Image Upload'}
          sx={{ mb: 2 }}
        />

        {previewUrl && <ImagePreview url={previewUrl} />}

        {useImageUrl ? (
          <TextField
            fullWidth
            label="Image URL"
            margin="normal"
            error={!!errors.imageUrl}
            helperText={errors.imageUrl?.message}
            {...register('imageUrl')}
          />
        ) : (
          <Controller
            name="imageFile"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <Box>
                <input
                  type="file"
                  accept={FORM_IMAGE.ACCEPTED_TYPES.join(',')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    onChange(file);
                  }}
                  style={{ display: 'none' }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button variant="outlined" component="span" fullWidth>
                    Choose Image
                  </Button>
                </label>
                {errors.imageFile && (
                  <Typography
                    color="error"
                    variant="caption"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    {errors.imageFile.message?.toString()}
                  </Typography>
                )}
                {value && (
                  <Typography
                    variant="caption"
                    sx={{ mt: 1, display: 'block' }}
                  >
                    Selected file: {value.name}
                  </Typography>
                )}
              </Box>
            )}
          />
        )}

        <TextField
          fullWidth
          label="Title"
          margin="normal"
          error={!!errors.title}
          helperText={errors.title?.message}
          {...register('title')}
        />

        <TextField
          fullWidth
          label="Description"
          margin="normal"
          multiline
          rows={4}
          error={!!errors.description}
          helperText={errors.description?.message}
          {...register('description')}
        />

        <TextField
          select
          fullWidth
          label="Category"
          margin="normal"
          error={!!errors.category}
          helperText={errors.category?.message}
          {...register('category')}
        >
          {FORM_CATEGORIES.map((category: FormCategory) => (
            <MenuItem key={category.value} value={category.value}>
              {category.label}
            </MenuItem>
          ))}
        </TextField>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{ mt: 3, mb: 2 }}
        >
          {isSubmitting ? 'Creating Post...' : 'Create Post'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
