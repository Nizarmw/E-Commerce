import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import PublicLayout from '../../layouts/PublicLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess(true);
    } catch (error) {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Container maxWidth="sm" sx={{ 
        py: 8,
        minHeight: 'calc(100vh - 128px)',
        display: 'flex', 
        alignItems: 'center',
        position: 'relative' 
      }}>
        {loading && <Loading overlay text="Sending reset link..." />}
        <Card variant="elevated" sx={{ width: '100%' }}>
          <Card.Header>
            <Card.Title>Reset Password</Card.Title>
          </Card.Header>
          <Card.Content>
            {success ? (
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body1" color="success.main" gutterBottom>
                  Reset link has been sent to your email.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please check your inbox and follow the instructions.
                </Typography>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  margin="normal"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  error={Boolean(error)}
                  helperText={error}
                  required
                />
              </Box>
            )}
          </Card.Content>
          <Card.Footer>
            {!success && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                onClick={handleSubmit}
                sx={{ mb: 2 }}
              >
                Send Reset Link
              </Button>
            )}
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/login" variant="body2">
                Back to Login
              </Link>
            </Box>
          </Card.Footer>
        </Card>
      </Container>
    </PublicLayout>
  );
};

export default ForgotPassword;
