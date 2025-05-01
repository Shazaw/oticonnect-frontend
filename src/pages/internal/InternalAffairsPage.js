import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const InternalAffairsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reports, setReports] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/internal-affairs/reports`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setReports(response.data);
      } catch (error) {
        setError('Failed to fetch reports');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const reportData = {
        ...data,
        divisionId: user.mainDivision.id,
        userId: user.id,
        status: 'pending',
      };

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/internal-affairs/reports`,
        reportData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccess('Report submitted successfully');
      reset();
      // Refresh reports
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/internal-affairs/reports`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setReports(response.data);
    } catch (error) {
      setError('Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Internal Affairs Report
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  label="Report Type"
                  {...register('type', { required: 'Report type is required' })}
                  error={!!errors.type}
                >
                  <MenuItem value="meeting">Division Meeting</MenuItem>
                  <MenuItem value="practice">Practice Session</MenuItem>
                  <MenuItem value="competition">Competition</MenuItem>
                  <MenuItem value="event">Special Event</MenuItem>
                  <MenuItem value="task">Task Update</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                {...register('title', { required: 'Title is required' })}
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register('description', { required: 'Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                {...register('date', { required: 'Date is required' })}
                error={!!errors.date}
                helperText={errors.date?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  {...register('progress', { required: 'Status is required' })}
                  error={!!errors.progress}
                >
                  <MenuItem value="planned">Planned</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                Submit Report
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Typography variant="h5" gutterBottom>
        Recent Reports
      </Typography>

      <Grid container spacing={3}>
        {reports.map((report) => (
          <Grid item xs={12} md={6} key={report.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {report.title}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {new Date(report.date).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" paragraph>
                  {report.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Chip
                    label={report.type}
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={report.progress}
                    color={
                      report.progress === 'completed'
                        ? 'success'
                        : report.progress === 'ongoing'
                        ? 'warning'
                        : 'default'
                    }
                  />
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default InternalAffairsPage; 