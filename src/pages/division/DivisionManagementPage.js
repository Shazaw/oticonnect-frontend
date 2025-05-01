import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const DivisionManagementPage = () => {
  const { user } = useAuth();
  const [division, setDivision] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [taskDialog, setTaskDialog] = useState(false);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    const fetchDivisionData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/divisions/${user.mainDivision.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setDivision(response.data);
        setMembers(response.data.members);
      } catch (error) {
        setError('Failed to fetch division data');
      } finally {
        setLoading(false);
      }
    };

    fetchDivisionData();
  }, [user]);

  const handleApproveMember = async (memberId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/divisions/${division.id}/confirm-member`,
        {
          userId: memberId,
          status: 'confirmed',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers(members.map(member =>
        member.id === memberId ? { ...member, divisionStatus: 'confirmed' } : member
      ));
    } catch (error) {
      setError('Failed to approve member');
    }
  };

  const handleRejectMember = async (memberId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/divisions/${division.id}/confirm-member`,
        {
          userId: memberId,
          status: 'rejected',
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setMembers(members.filter(member => member.id !== memberId));
    } catch (error) {
      setError('Failed to reject member');
    }
  };

  const handleAddTask = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/divisions/${division.id}/tasks`,
        {
          title: newTask,
          assignedTo: selectedMember.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewTask('');
      setTaskDialog(false);
      // Refresh division data
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/divisions/${user.mainDivision.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setDivision(response.data);
    } catch (error) {
      setError('Failed to add task');
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

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {division.name} Management
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Division Members
          </Typography>
          <List>
            {members.map((member) => (
              <ListItem key={member.id}>
                <ListItemText
                  primary={member.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {member.email}
                      </Typography>
                      <br />
                      Status: {member.divisionStatus}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  {member.divisionStatus === 'pending' && (
                    <>
                      <Button
                        color="primary"
                        onClick={() => handleApproveMember(member.id)}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        color="error"
                        onClick={() => handleRejectMember(member.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => {
                      setSelectedMember(member);
                      setTaskDialog(true);
                    }}
                  >
                    Assign Task
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Division Tasks
          </Typography>
          <List>
            {division.tasks?.map((task) => (
              <ListItem key={task.id}>
                <ListItemText
                  primary={task.title}
                  secondary={`Assigned to: ${task.assignedTo?.name || 'Unassigned'}`}
                />
                <Chip
                  label={task.status}
                  color={
                    task.status === 'completed'
                      ? 'success'
                      : task.status === 'in_progress'
                      ? 'warning'
                      : 'default'
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Paper>

      <Dialog open={taskDialog} onClose={() => setTaskDialog(false)}>
        <DialogTitle>Assign Task to {selectedMember?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Title"
            fullWidth
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTaskDialog(false)}>Cancel</Button>
          <Button onClick={handleAddTask} color="primary">
            Assign
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DivisionManagementPage; 