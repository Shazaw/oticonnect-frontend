import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const ProfileSetupPage = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [divisions, setDivisions] = useState([]);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/divisions`);
        setDivisions(response.data);
      } catch (error) {
        setError('Failed to fetch divisions');
      }
    };
    fetchDivisions();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await updateProfile({
        name: data.name,
        mainDivision: data.mainDivision,
        managerialDivision: data.managerialDivision,
      });
      navigate('/dashboard');
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const mainDivision = watch('mainDivision');

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Complete Your Profile
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Name"
              defaultValue={user?.name}
              {...register('name', { required: 'Name is required' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Main Division</InputLabel>
              <Select
                label="Main Division"
                {...register('mainDivision', { required: 'Main division is required' })}
                error={!!errors.mainDivision}
              >
                {divisions
                  .filter((d) => d.type === 'main')
                  .map((division) => (
                    <MenuItem key={division.id} value={division.id}>
                      {division.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Managerial Division (Optional)</InputLabel>
              <Select
                label="Managerial Division"
                {...register('managerialDivision')}
              >
                <MenuItem value="">None</MenuItem>
                {divisions
                  .filter((d) => d.type === 'managerial')
                  .map((division) => (
                    <MenuItem key={division.id} value={division.id}>
                      {division.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Complete Profile'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProfileSetupPage; 