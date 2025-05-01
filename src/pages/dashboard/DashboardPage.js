import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Event as EventIcon,
  Group as GroupIcon,
  Room as RoomIcon,
  Feedback as FeedbackIcon,
  Assignment as AssignmentIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  const renderDivisionHeadView = () => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Division Management
        </Typography>
        <List>
          <ListItem button onClick={() => navigate('/divisions/manage')}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Division Members" />
          </ListItem>
          <ListItem button onClick={() => navigate('/divisions/schedule')}>
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Division Schedule" />
          </ListItem>
          <ListItem button onClick={() => navigate('/divisions/progress')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Division Progress" />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );

  const renderEventHeadView = () => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Event Management
        </Typography>
        <List>
          <ListItem button onClick={() => navigate('/events/manage')}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Manage Event" />
          </ListItem>
          <ListItem button onClick={() => navigate('/events/divisions')}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Event Divisions" />
          </ListItem>
          <ListItem button onClick={() => navigate('/events/progress')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Event Progress" />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );

  const renderResourceManagerView = () => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Room Management
        </Typography>
        <List>
          <ListItem button onClick={() => navigate('/rooms/approve')}>
            <ListItemIcon>
              <RoomIcon />
            </ListItemIcon>
            <ListItemText primary="Approve Room Bookings" />
          </ListItem>
          <ListItem button onClick={() => navigate('/rooms/schedule')}>
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Room Schedule" />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );

  const renderHumanDevelopmentView = () => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          OtiBersuara Management
        </Typography>
        <List>
          <ListItem button onClick={() => navigate('/oti-bersuara/review')}>
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
            <ListItemText primary="Review Submissions" />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );

  const renderInternalAffairsView = () => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Internal Affairs
        </Typography>
        <List>
          <ListItem button onClick={() => navigate('/internal/divisions')}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Division Reports" />
          </ListItem>
          <ListItem button onClick={() => navigate('/internal/events')}>
            <ListItemIcon>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary="Event Reports" />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );

  const renderCEOView = () => (
    <Grid item xs={12} md={6}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          CEO Dashboard
        </Typography>
        <List>
          <ListItem button onClick={() => navigate('/ceo/approvals')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Pending Approvals" />
          </ListItem>
          <ListItem button onClick={() => navigate('/ceo/reports')}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            <ListItemText primary="Organization Reports" />
          </ListItem>
        </List>
      </Paper>
    </Grid>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome, {user?.name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Role: {user?.role}
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Common features for all users */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <List>
                <ListItem button onClick={() => navigate('/profile')}>
                  <ListItemIcon>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Profile" />
                </ListItem>
                <ListItem button onClick={() => navigate('/calendar')}>
                  <ListItemIcon>
                    <CalendarIcon />
                  </ListItemIcon>
                  <ListItemText primary="View Calendar" />
                </ListItem>
                <ListItem button onClick={() => navigate('/oti-bersuara')}>
                  <ListItemIcon>
                    <FeedbackIcon />
                  </ListItemIcon>
                  <ListItemText primary="Submit Feedback" />
                </ListItem>
                <ListItem button onClick={() => navigate('/rooms')}>
                  <ListItemIcon>
                    <RoomIcon />
                  </ListItemIcon>
                  <ListItemText primary="Book a Room" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Role-specific views */}
          {hasRole(['head']) && renderDivisionHeadView()}
          {hasRole(['head_coordinator']) && renderEventHeadView()}
          {hasRole(['resource_manager']) && renderResourceManagerView()}
          {hasRole(['human_development']) && renderHumanDevelopmentView()}
          {hasRole(['internal_affairs']) && renderInternalAffairsView()}
          {hasRole(['ceo']) && renderCEOView()}
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardPage; 