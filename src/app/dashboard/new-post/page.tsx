'use client';

import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import Image from 'next/image';

const categories = [
  { value: 'technology', label: 'Technology' },
  { value: 'lifestyle', label: 'Lifestyle' },
  { value: 'business', label: 'Business' },
  { value: 'health', label: 'Health' },
] as const;

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
];

const postSchema = z.object({
  imageUrl: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  imageFile: z
    .any()
    .refine((file) => !file || file instanceof File, 'Invalid file')
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'Max file size is 5MB'
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported'
    )
    .optional(),
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),
  category: z.enum(['technology', 'lifestyle', 'business', 'health'], {
    required_error: 'Please select a category',
  }),
});

type PostFormData = z.infer<typeof postSchema>;

function ImagePreview({ url }: { url: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        position: 'relative',
        mb: 3,
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: 'grey.100',
        '&::before': {
          content: '""',
          display: 'block',
          paddingTop: '56.25%', // 16:9 aspect ratio
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {isLoading && <CircularProgress />}
        {error ? (
          <Typography color="error">Failed to load image</Typography>
        ) : (
          <Image
            src={url}
            alt="Preview"
            fill
            style={{ objectFit: 'cover' }}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setError(true);
              setIsLoading(false);
            }}
            unoptimized
            sizes="(max-width: 768px) 100vw, 768px"
          />
        )}
      </Box>
    </Box>
  );
}

export default function NewPostPage() {
  const [useImageUrl, setUseImageUrl] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');

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

  const onSubmit = async (data: PostFormData) => {
    try {
      console.log('Form data:', data);

      reset();
      setPreviewUrl('');

      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    }
  };

  const handleImageSwitch = () => {
    setUseImageUrl(!useImageUrl);
    setPreviewUrl('');
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Create New Post
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 3 }}
          >
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
                      accept={ACCEPTED_IMAGE_TYPES.join(',')}
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
              {categories.map((category) => (
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
        </Paper>
      </Box>
    </Container>
  );
}
