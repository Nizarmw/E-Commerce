import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';

// Mock cart data - replace with your actual data
const cartItems = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 129.99,
    quantity: 1
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 199.99,
    quantity: 2
  }
];

const steps = ['Shipping Information', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phoneNumber: '',
    saveInfo: false
  });
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardInfo, setCardInfo] = useState({
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleShippingInfoChange = (e) => {
    const { name, value, checked } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: name === 'saveInfo' ? checked : value
    }));
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleCardInfoChange = (e) => {
    const { name, value } = e.target;
    setCardInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
    } else {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSnackbar({
        open: true,
        message: 'Order placed successfully!',
        severity: 'success'
      });
      
      // After successful order, redirect to confirmation page
      setTimeout(() => {
        navigate('/order-confirmation', { 
          state: { 
            orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000) 
          } 
        });
      }, 1500);
    } catch (error) {
      console.error("Error placing order:", error);
      setSnackbar({
        open: true,
        message: 'Failed to place order. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax example
  };

  const calculateShipping = () => {
    return 12.99; // Fixed shipping cost example
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={shippingInfo.firstName}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={shippingInfo.lastName}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Address"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="City"
                  name="city"
                  value={shippingInfo.city}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="State/Province"
                  name="state"
                  value={shippingInfo.state}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Zip / Postal code"
                  name="zipCode"
                  value={shippingInfo.zipCode}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Country"
                  name="country"
                  value={shippingInfo.country}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={shippingInfo.phoneNumber}
                  onChange={handleShippingInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      color="primary" 
                      name="saveInfo" 
                      checked={shippingInfo.saveInfo}
                      onChange={handleShippingInfoChange}
                    />
                  }
                  label="Save this information for next time"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Payment Method
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup 
                name="paymentMethod" 
                value={paymentMethod} 
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel 
                  value="credit" 
                  control={<Radio color="primary" />} 
                  label="Credit / Debit Card" 
                />
                <FormControlLabel 
                  value="paypal" 
                  control={<Radio color="primary" />} 
                  label="PayPal" 
                />
              </RadioGroup>
            </FormControl>
            
            {paymentMethod === 'credit' && (
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Name on card"
                      name="cardName"
                      value={cardInfo.cardName}
                      onChange={handleCardInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      label="Card number"
                      name="cardNumber"
                      value={cardInfo.cardNumber}
                      onChange={handleCardInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Expiry date (MM/YY)"
                      name="expDate"
                      value={cardInfo.expDate}
                      onChange={handleCardInfoChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="CVV"
                      name="cvv"
                      type="password"
                      value={cardInfo.cvv}
                      onChange={handleCardInfoChange}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {paymentMethod === 'paypal' && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper' }}>
                <Typography variant="body2">
                  You will be redirected to PayPal to complete your purchase securely.
                </Typography>
              </Box>
            )}
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity}`}
                  />
                  <Typography variant="body2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Subtotal" />
                <Typography variant="body1">
                  ${calculateSubtotal().toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Tax" />
                <Typography variant="body1">
                  ${calculateTax().toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Shipping" />
                <Typography variant="body1">
                  ${calculateShipping().toFixed(2)}
                </Typography>
              </ListItem>
              <ListItem sx={{ py: 1, px: 0 }}>
                <ListItemText primary="Total" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ${calculateTotal().toFixed(2)}
                </Typography>
              </ListItem>
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Shipping
                </Typography>
                <Typography gutterBottom>{shippingInfo.firstName} {shippingInfo.lastName}</Typography>
                <Typography gutterBottom>{shippingInfo.address}</Typography>
                <Typography gutterBottom>
                  {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                </Typography>
                <Typography gutterBottom>{shippingInfo.country}</Typography>
                <Typography gutterBottom>{shippingInfo.phoneNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="h6" gutterBottom>
                  Payment Details
                </Typography>
                <Typography gutterBottom>
                  {paymentMethod === 'credit' ? 'Credit Card' : 'PayPal'}
                </Typography>
                {paymentMethod === 'credit' && (
                  <Typography gutterBottom>
                    Card ending with {cardInfo.cardNumber.slice(-4)}
                  </Typography>
                )}
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} sx={{ py: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box sx={{ mt: 2 }}>
          {getStepContent(activeStep)}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              variant="outlined"
              disabled={activeStep === 0 || loading}
            >
              Back
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={loading}
            >
              {activeStep === steps.length - 1 ? (
                loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Place Order'
                )
              ) : (
                'Next'
              )}
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Checkout;
