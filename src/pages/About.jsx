// src/pages/About.jsx - FINAL DYNAMIC CONTENT VERSION

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, CircularProgress, Alert, Divider, List, ListItem, ListItemText } from '@mui/material';
import { Info, ContactMail, Code, LocationOn, Phone as PhoneIcon } from '@mui/icons-material'; // Import Phone and Location icons
import api from '../api';

const About = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Use the correct API path /accounts/about/
        const response = await api.get('/accounts/about/'); 
        setAboutData(response.data);
      } catch (err) {
        console.error('Failed to fetch about data:', err);
        setError('Failed to load company information from the server.');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !aboutData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || "Could not load data. Check backend connection."}</Alert>
      </Container>
    );
  }
  
  // Destructure new fields from API response
  const { 
    app, 
    about, 
    contact_email, 
    contact_number, // NEW
    headquarters_address, // NEW
    feature_flags 
  } = aboutData;

  // Helper to safely display version, as it was not present in the new backend snippet
  const version = aboutData.version || 'N/A';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
        About {app}
      </Typography>
      
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        
        {/* Mission/Description Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info /> Description
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body1" paragraph>
            {about}
          </Typography>
        </Box>
        
        {/* Contact Details Section (Enhanced) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactMail /> Contact Details
          </Typography>
          <Divider sx={{ my: 1 }} />
          <List dense>
            <ListItem><ListItemText primary={`Email: ${contact_email}`} /></ListItem>
            {/* Display Contact Number */}
            <ListItem>
                <ListItemText primary={`Phone: ${contact_number}`} 
                    primaryTypographyProps={{ sx: { display: 'flex', alignItems: 'center', gap: 1 }, 
                    // Secondary icon visual if needed: startIcon={<PhoneIcon />} 
                }} />
            </ListItem>
            <ListItem><ListItemText primary={`Version: ${version}`} /></ListItem>
          </List>
        </Box>
        
        {/* Headquarters Address Section (NEW) */}
        {headquarters_address && (
            <Box sx={{ mb: 4 }}>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn /> Headquarters
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">
                    {headquarters_address.street}
                </Typography>
                <Typography variant="body1">
                    {headquarters_address.city}, {headquarters_address.state} - {headquarters_address.pincode}
                </Typography>
            </Box>
        )}


        {/* Coming Soon/Features Section (Uses the feature_flags field) */}
        {feature_flags && (
             <Box>
                <Typography variant="h6" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Code /> Feature Flags (Status)
                </Typography>
                <Divider sx={{ my: 1 }} />
                <List dense>
                    {Object.entries(feature_flags).map(([feature, isEnabled]) => (
                        <ListItem key={feature}>
                            <ListItemText 
                                primary={feature.replace(/_/g, ' ').toUpperCase()} 
                                secondary={isEnabled ? 'Enabled (Coming Soon)' : 'Disabled'}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        )}
        
      </Paper>
    </Container>
  );
};

export default About;