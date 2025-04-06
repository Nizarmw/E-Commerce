import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

const UserForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'buyer',
    isActive: true,
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({ 
      ...formData, 
      [field]: event.target.type === 'checkbox' ? event.target.checked : event.target.value 
    });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData.id ? 'Edit User' : 'Create New User'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              error={Boolean(errors.firstName)}
              helperText={errors.firstName}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              error={Boolean(errors.lastName)}
              helperText={errors.lastName}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={handleChange('email')}
              error={Boolean(errors.email)}
              helperText={errors.email}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={handleChange('role')}
              >
                <MenuItem value="buyer">Buyer</MenuItem>
                <MenuItem value="seller">Seller</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleChange('isActive')}
                  color="primary"
                />
              }
              label="Active Account"
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
              >
                {initialData.id ? 'Update User' : 'Create User'}
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
      </form>
    </Paper>
  );
};

export default UserForm;
