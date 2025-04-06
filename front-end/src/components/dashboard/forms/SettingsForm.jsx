import React, { useState } from 'react';
import {
  Paper,
  Grid,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Button,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const SettingsForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [settings, setSettings] = useState({
    siteName: 'E-Commerce App',
    supportEmail: 'support@example.com',
    defaultCurrency: 'IDR',
    orderPrefix: 'ORD',
    enableNotifications: true,
    emailNotifications: true,
    pushNotifications: false,
    maintenanceMode: false,
    ...initialData
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings({ ...settings, [field]: value });
    if (success) setSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await onSubmit?.(settings);
      setSuccess(true);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            General Settings
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Site Name"
                value={settings.siteName}
                onChange={handleChange('siteName')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Support Email"
                type="email"
                value={settings.supportEmail}
                onChange={handleChange('supportEmail')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Default Currency</InputLabel>
                <Select
                  value={settings.defaultCurrency}
                  label="Default Currency"
                  onChange={handleChange('defaultCurrency')}
                >
                  <MenuItem value="IDR">Indonesian Rupiah (IDR)</MenuItem>
                  <MenuItem value="USD">US Dollar (USD)</MenuItem>
                  <MenuItem value="EUR">Euro (EUR)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Order Prefix"
                value={settings.orderPrefix}
                onChange={handleChange('orderPrefix')}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Notifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableNotifications}
                    onChange={handleChange('enableNotifications')}
                  />
                }
                label="Enable Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleChange('emailNotifications')}
                    disabled={!settings.enableNotifications}
                  />
                }
                label="Email Notifications"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={handleChange('pushNotifications')}
                    disabled={!settings.enableNotifications}
                  />
                }
                label="Push Notifications"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            System
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.maintenanceMode}
                    onChange={handleChange('maintenanceMode')}
                  />
                }
                label="Maintenance Mode"
              />
            </Grid>
          </Grid>
        </Grid>

        {/* Form Actions */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
            >
              Save Settings
            </LoadingButton>
            <Button
              variant="outlined"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SettingsForm;
