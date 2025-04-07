import React, { useState } from 'react';
import { Box, Typography, Alert } from '@mui/material';
import DashboardLayout from '../../layouts/DashboardLayout';
import SettingsForm from '../../components/dashboard/forms/SettingsForm';

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (settings) => {
    setLoading(true);
    setError(null);
    try {
      // TODO: Implement API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess(true);
    } catch (err) {
      setError('Failed to save settings. Please try again.');
      console.error('Settings save error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Settings
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Settings updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <SettingsForm 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Box>
    </DashboardLayout>
  );
};

export default Settings;
