import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Collapse,
  StepIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

// Sample cart items from previous page
const cartItems = [
  {
    id: 1,
    name: 'Wireless Noise-Cancelling Headphones XM5',
    price: 349.99,
    quantity: 1,
  },
  {
    id: 2,
    name: 'Wireless Earbuds Pro',
    price: 179.99,
    quantity: 1,
  },
];

// Styled components
const OrderSummaryItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const steps = ['Shipping', 'Payment', 'Review Order'];
const stepIcons = [<LocalShippingIcon />, <PaymentIcon />, <ReceiptIcon />];

// Shipping method options
const shippingMethods = [
  { id: 'standard', label: 'Standard Shipping (3-5 business days)', price: 0 },
  { id: 'express', label: 'Express Shipping (2-3 business days)', price: 9.99 },
  { id: 'overnight', label: 'Overnight Shipping (1 business day)', price: 19.99 },
];

// Payment method options
const paymentMethods = [
  { id: 'creditCard', label: 'Credit Card' },
  { id: 'paypal', label: 'PayPal' },
];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Form state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    email: '',
    saveAddress: false,
    shippingMethod: 'standard',
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'creditCard',
    saveCard: false,
  });

  // Form validation
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingForm()) {
      return;
    }
    
    if (activeStep === 1 && !validatePaymentForm()) {
      return;
    }
    
    if (activeStep === steps.length - 1) {
      handlePlaceOrder();
      return;
    }
    
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateShippingForm = () => {
    const newErrors = {};
    const requiredFields = ['firstName', 'lastName', 'address1', 'city', 'state', 'zipCode', 'phone', 'email'];
    
    requiredFields.forEach(field => {
      if (!shippingInfo[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Validate email format
    if (shippingInfo.email && !/^\S+@\S+\.\S+$/.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate phone format (simple validation)
    if (shippingInfo.phone && !/^\d{10}$/.test(shippingInfo.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    if (paymentInfo.paymentMethod === 'paypal') {
      return true; // Skip validation for PayPal
    }
    
    const newErrors = {};
    
    if (!paymentInfo.cardName.trim()) {
      newErrors.cardName = 'Please enter the name on card';
    }
    
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Please enter card number';
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'Please enter expiry date';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please use format MM/YY';
    }
    
    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'Please enter CVV';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'CVV should be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setOrderPlaced(true);
      // Redirect to confirmation page
      window.location.href = '/order-confirmation';
    }, 2000);
  };

  const handleShippingChange = (event) => {
    const { name, value, checked, type } = event.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handlePaymentChange = (event) => {
    const { name, value, checked, type } = event.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const getShippingCost = () => {
    const method = shippingMethods.find(m => m.id === shippingInfo.shippingMethod);
    return method ? method.price : 0;
  };
  const shippingCost = getShippingCost();
  const tax = subtotal * 0.07;
  const total = subtotal + shippingCost + tax;

  const renderShippingForm = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="firstName"
          name="firstName"
          label="First Name"
          fullWidth
          variant="outlined"
          value={shippingInfo.firstName}
          onChange={handleShippingChange}
          error={!!errors.firstName}
          helperText={errors.firstName}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="lastName"
          name="lastName"
          label="Last Name"
          fullWidth
          variant="outlined"
          value={shippingInfo.lastName}
          onChange={handleShippingChange}
          error={!!errors.lastName}
          helperText={errors.lastName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          id="address1"
          name="address1"
          label="Address Line 1"
          fullWidth
          variant="outlined"
          value={shippingInfo.address1}
          onChange={handleShippingChange}
          error={!!errors.address1}
          helperText={errors.address1}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="address2"
          name="address2"
          label="Address Line 2 (Optional)"
          fullWidth
          variant="outlined"
          value={shippingInfo.address2}
          onChange={handleShippingChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="city"
          name="city"
          label="City"
          fullWidth
          variant="outlined"
          value={shippingInfo.city}
          onChange={handleShippingChange}
          error={!!errors.city}
          helperText={errors.city}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="state"
          name="state"
          label="State/Province/Region"
          fullWidth
          variant="outlined"
          value={shippingInfo.state}
          onChange={handleShippingChange}
          error={!!errors.state}
          helperText={errors.state}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="zipCode"
          name="zipCode"
          label="Zip / Postal Code"
          fullWidth
          variant="outlined"
          value={shippingInfo.zipCode}
          onChange={handleShippingChange}
          error={!!errors.zipCode}
          helperText={errors.zipCode}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="country"
          name="country"
          label="Country"
          fullWidth
          variant="outlined"
          value={shippingInfo.country}
          onChange={handleShippingChange}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="phone"
          name="phone"
          label="Phone Number"
          fullWidth
          variant="outlined"
          value={shippingInfo.phone}
          onChange={handleShippingChange}
          error={!!errors.phone}
          helperText={errors.phone}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          required
          id="email"
          name="email"
          label="Email Address"
          fullWidth
          variant="outlined"
          value={shippingInfo.email}
          onChange={handleShippingChange}
          error={!!errors.email}
          helperText={errors.email}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              name="saveAddress"
              checked={shippingInfo.saveAddress}
              onChange={handleShippingChange}
            />
          }
          label="Save this address for future orders"
        />
      </Grid>

      <Grid item xs={12}>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>
          Shipping Method
        </Typography>
        <FormControl component="fieldset">
          <RadioGroup
            name="shippingMethod"
            value={shippingInfo.shippingMethod}
            onChange={handleShippingChange}
          >
            {shippingMethods.map((method) => (
              <FormControlLabel
                key={method.id}
                value={method.id}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="body1">{method.label}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {method.price === 0 ? 'Free' : `$${method.price.toFixed(2)}`}
                    </Typography>
                  </Box>
                }
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Grid>
    </Grid>
  );

  const renderPaymentForm = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <RadioGroup
          name="paymentMethod"
          value={paymentInfo.paymentMethod}
          onChange={handlePaymentChange}
        >
          <Paper variant="outlined" sx={{ mb: 2, p: 2 }}>
            <FormControlLabel
              value="creditCard"
              control={<Radio />}
              label={<Typography variant="body1">Credit Card</Typography>}
            />
            <Collapse in={paymentInfo.paymentMethod === 'creditCard'}>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardName"
                      name="cardName"
                      label="Name on Card"
                      fullWidth
                      variant="outlined"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      error={!!errors.cardName}
                      helperText={errors.cardName}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      id="cardNumber"
                      name="cardNumber"
                      label="Card Number"
                      fullWidth
                      variant="outlined"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      error={!!errors.cardNumber}
                      helperText={errors.cardNumber}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="expiryDate"
                      name="expiryDate"
                      label="Expiry Date"
                      fullWidth
                      variant="outlined"
                      placeholder="MM/YY"
                      value={paymentInfo.expiryDate}
                      onChange={handlePaymentChange}
                      error={!!errors.expiryDate}
                      helperText={errors.expiryDate}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="cvv"
                      name="cvv"
                      label="CVV"
                      fullWidth
                      variant="outlined"
                      value={paymentInfo.cvv}
                      onChange={handlePaymentChange}
                      error={!!errors.cvv}
                      helperText={errors.cvv}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          name="saveCard"
                          checked={paymentInfo.saveCard}
                          onChange={handlePaymentChange}
                        />
                      }
                      label="Save this card for future purchases"
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <FormControlLabel
              value="paypal"
              control={<Radio />}
              label={<Typography variant="body1">PayPal</Typography>}
            />
            <Collapse in={paymentInfo.paymentMethod === 'paypal'}>
              <Box sx={{ mt: 2 }}>
                <Alert severity="info">
                  You will be redirected to PayPal to complete your payment after
                  placing your order.
                </Alert>
              </Box>
            </Collapse>
          </Paper>
        </RadioGroup>
      </FormControl>

      <Typography variant="h6" gutterBottom>
        Billing Address
      </Typography>
      <FormControlLabel
        control={<Checkbox defaultChecked color="primary" />}
        label="Same as shipping address"
      />
    </Box>
  );

  const renderOrderReview = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">
            {shippingInfo.firstName} {shippingInfo.lastName}
          </Typography>
          <Typography variant="body1">
            {shippingInfo.address1}
          </Typography>
          {shippingInfo.address2 && (
            <Typography variant="body1">
              {shippingInfo.address2}
            </Typography>
          )}
          <Typography variant="body1">
            {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
          </Typography>
          <Typography variant="body1">
            {shippingInfo.country}
          </Typography>
          <Typography variant="body1">
            Phone: {shippingInfo.phone}
          </Typography>
          <Typography variant="body1">
            Email: {shippingInfo.email}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body1">
            <strong>Shipping Method:</strong>{' '}
            {shippingMethods.find(m => m.id === shippingInfo.shippingMethod)?.label}
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Payment Information
        </Typography>
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Typography variant="body1">
            <strong>Payment Method:</strong>{' '}
            {paymentMethods.find(m => m.id === paymentInfo.paymentMethod)?.label}
          </Typography>
          {paymentInfo.paymentMethod === 'creditCard' && (
            <>
              <Typography variant="body1">
                {paymentInfo.cardName}
              </Typography>
              <Typography variant="body1">
                **** **** **** {paymentInfo.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="body1">
                Expires: {paymentInfo.expiryDate}
              </Typography>
            </>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Order Items
        </Typography>
        <Paper variant="outlined" sx={{ mb: 3 }}>
          <List disablePadding>
            {cartItems.map((item) => (
              <OrderSummaryItem key={item.id}>
                <ListItemText
                  primary={item.name}
                  secondary={`Quantity: ${item.quantity}`}
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                />
                <Typography variant="body1">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </OrderSummaryItem>
            ))}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderOrderReview();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5, pt: 3 }}>
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel 
                StepIconComponent={(props) => (
                  <StepIcon {...props}>
                    {stepIcons[index]}
                  </StepIcon>
                )}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {getStepContent(activeStep)}
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>
                <List disablePadding>
                  {cartItems.map((item) => (
                    <OrderSummaryItem key={item.id}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Qty: ${item.quantity}`}
                      />
                      <Typography variant="body2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </OrderSummaryItem>
                  ))}
                  <OrderSummaryItem>
                    <ListItemText primary="Subtotal" />
                    <Typography variant="body1">
                      ${subtotal.toFixed(2)}
                    </Typography>
                  </OrderSummaryItem>
                  <OrderSummaryItem>
                    <ListItemText primary="Shipping" />
                    <Typography variant="body1">
                      {shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}
                    </Typography>
                  </OrderSummaryItem>
                  <OrderSummaryItem>
                    <ListItemText primary="Tax (7%)" />
                    <Typography variant="body1">
                      ${tax.toFixed(2)}
                    </Typography>
                  </OrderSummaryItem>
                  <OrderSummaryItem sx={{ borderBottom: 'none' }}>
                    <ListItemText 
                      primary={<Typography variant="subtitle1" fontWeight="bold">Total</Typography>} 
                    />
                    <Typography variant="subtitle1" fontWeight="bold">
                      ${total.toFixed(2)}
                    </Typography>
                  </OrderSummaryItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            disabled={loading}
            sx={{ minWidth: 120 }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : activeStep === steps.length - 1 ? (
              'Place Order'
            ) : (
              'Next'
            )}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CheckoutPage;
