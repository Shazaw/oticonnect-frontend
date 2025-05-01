'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { GoogleLogin } from 'react-google-login';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, googleLogin } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'Login failed');
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    try {
      await googleLogin(response);
      router.push('/profile/setup');
    } catch (error: any) {
      setError(error.message || 'Google login failed');
    }
  };

  const handleGoogleFailure = (error: any) => {
    setError('Google login failed. Please try again.');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Login to OmahTI
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{ mb: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mb: 2 }}
            >
              Login
            </Button>

            <Divider sx={{ my: 2 }}>OR</Divider>

            <GoogleLogin
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
              buttonText="Login with Google"
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              cookiePolicy={'single_host_origin'}
              render={({ onClick, disabled }) => (
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  onClick={onClick}
                  disabled={disabled}
                  sx={{ mb: 2 }}
                >
                  Login with Google
                </Button>
              )}
            />

            <Button
              fullWidth
              variant="text"
              onClick={() => router.push('/register')}
            >
              Don't have an account? Register
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
} 