import React, { useState } from 'react';
import {
  Container,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PublicLayout } from '../../layouts';

const steps = ['Shipping Address', 'Shipping Method', 'Payment', 'Review'];

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Shipping Address
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    phone: '',
    // Shipping Method
    shippingMethod: 'standard',
    // Payment
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // API call would go here
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleNext();
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
  };

  const AddressForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="First Name"
          value={formData.firstName}
          onChange={handleInputChange('firstName')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Last Name"
          value={formData.lastName}
          onChange={handleInputChange('lastName')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Address"
          value={formData.address}
          onChange={handleInputChange('address')}
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="City"
          value={formData.city}
          onChange={handleInputChange('city')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Province"
          value={formData.province}
          onChange={handleInputChange('province')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Postal Code"
          value={formData.postalCode}
          onChange={handleInputChange('postalCode')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          value={formData.phone}
          onChange={handleInputChange('phone')}
        />
      </Grid>
    </Grid>
  );

  const ShippingMethodForm = () => (
    <RadioGroup
      value={formData.shippingMethod}
      onChange={handleInputChange('shippingMethod')}
    >
      <FormControlLabel
        value="standard"
        control={<Radio />}
        label={
          <Box>
            <Typography variant="subtitle1">Standard Shipping</Typography>
            <Typography variant="body2" color="text.secondary">
              2-3 Business Days - Free
            </Typography>
          </Box>
        }
      />
      <FormControlLabel
        value="express"
        control={<Radio />}
        label={
          <Box>
            <Typography variant="subtitle1">Express Shipping</Typography>
            <Typography variant="body2" color="text.secondary">
              1-2 Business Days - Rp 50.000
            </Typography>
          </Box>
        }
      />
    </RadioGroup>
  );

  const PaymentForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Name on Card"
          value={formData.cardName}
          onChange={handleInputChange('cardName')}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Card Number"
          value={formData.cardNumber}
          onChange={handleInputChange('cardNumber')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="Expiry Date"
          placeholder="MM/YY"
          value={formData.expiryDate}
          onChange={handleInputChange('expiryDate')}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          fullWidth
          label="CVV"
          value={formData.cvv}
          onChange={handleInputChange('cvv')}
        />
      </Grid>
    </Grid>
  );

  const ReviewForm = () => (
    <Box>
      <Typography variant="h6" gutterBottom>Order Summary</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Shipping Address</Typography>
          <Typography variant="body2">
            {`${formData.firstName} ${formData.lastName}`}<br />
            {formData.address}<br />
            {`${formData.city}, ${formData.province} ${formData.postalCode}`}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Shipping Method</Typography>
          <Typography variant="body2">
            {formData.shippingMethod === 'standard' ? 'Standard Shipping' : 'Express Shipping'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">Payment Details</Typography>
          <Typography variant="body2">
            Card ending in {formData.cardNumber.slice(-4)}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <AddressForm />;
      case 1:
        return <ShippingMethodForm />;
      case 2:
        return <PaymentForm />;
      case 3:
        return <ReviewForm />;
      default:
        return 'Unknown step';
    }
  };

  return (
    <PublicLayout>
      <Container maxWidth="md" sx={{ my: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Checkout
          </Typography>
          <Stepper activeStep={activeStep} sx={{ py: 3 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === steps.length ? (
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Typography variant="h5" gutterBottom>
                Thank you for your order!
              </Typography>
              <Typography variant="subtitle1">
                Your order number is #2001539. We have emailed your order confirmation.
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mr: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  variant="contained"
                  type={activeStep === steps.length - 1 ? 'submit' : 'button'}
                  onClick={activeStep === steps.length - 1 ? undefined : handleNext}
                  loading={loading}
                >
                  {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
                </LoadingButton>
              </Box>
            </form>
          )}
        </Paper>
      </Container>
    </PublicLayout>
  );
};

export default Checkout;
