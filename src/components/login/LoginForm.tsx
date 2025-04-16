'use client';

import { useRouter } from 'next/navigation';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const success = await login(data);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('root', {
          type: 'manual',
          message: 'Invalid credentials',
        });
      }
    } catch (err: unknown) {
      console.error('Login error:', err);
      setError('root', {
        type: 'manual',
        message:
          err instanceof Error ? err.message : 'An error occurred during login',
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ mt: 1, width: '100%' }}
    >
      <Typography
        component="h1"
        variant="h5"
        sx={{ mb: 3, textAlign: 'center' }}
      >
        Sign In
      </Typography>

      {errors.root && (
        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
          {errors.root.message}
        </Typography>
      )}

      <TextField
        margin="normal"
        fullWidth
        id="email"
        label="Email Address"
        autoComplete="email"
        autoFocus
        error={!!errors.email}
        helperText={errors.email?.message}
        {...register('email')}
      />

      <TextField
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        id="password"
        autoComplete="current-password"
        error={!!errors.password}
        helperText={errors.password?.message}
        {...register('password')}
      />

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={isSubmitting}
        sx={{ mt: 3, mb: 2 }}
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </Box>
  );
}
