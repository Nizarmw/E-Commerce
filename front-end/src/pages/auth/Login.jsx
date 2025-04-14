import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
  Typography,
  Link,
  Divider,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import PublicLayout from "../../layouts/PublicLayout";
import api from "../../services/api";

const Login = () => {
  const [values, setValues] = useState({
    usernameOrEmail: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    // Clear error when user types
    if (errors[prop]) {
      setErrors({ ...errors, [prop]: "" });
    }
    // Clear any general error message
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleCheckbox = (event) => {
    setValues({ ...values, rememberMe: event.target.checked });
  };

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.usernameOrEmail) {
      newErrors.usernameOrEmail = "Username or Email is required";
    } else if (
      values.usernameOrEmail.includes("@") && 
      !/\S+@\S+\.\S+/.test(values.usernameOrEmail)
    ) {
      // Only validate as email if it contains an @ symbol
      newErrors.usernameOrEmail = "Email is invalid";
    }
    
    if (!values.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveAuthData = (userData, token) => {
    // Store authentication data in localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", {
        username_or_email: values.usernameOrEmail,
        password: values.password,
      });
      
      // Check if login was successful and user data exists
      if (response.data && response.data.message === "Login successful") {
        if (response.data.user) {
          // Save auth data and token if available
          saveAuthData(
            response.data.user, 
            response.data.token || null
          );
          
          // Navigate based on user role
          const { role } = response.data.user;
          
          if (role === "admin") {
            navigate("/dashboard");
          } else if (role === "seller") {
            navigate("/dashboard/seller");
          } else {
            navigate("/");
          }
        } else {
          setErrorMessage("Login successful but user data is missing");
          navigate("/");
        }
      } else {
        setErrorMessage(response.data?.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed. Please check your credentials or try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Container
        maxWidth="sm"
        sx={{
          py: 8,
          minHeight: "calc(100vh - 128px)",
          display: "flex",
          alignItems: "center",
          position: "relative",
        }}
      >
        {loading && <Loading overlay text="Signing in..." />}
        <Card variant="elevated" sx={{ width: "100%" }}>
          <Card.Header>
            <Card.Title>Login</Card.Title>
          </Card.Header>
          <Card.Content>
            {errorMessage && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errorMessage}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Username or Email"
                margin="normal"
                required
                value={values.usernameOrEmail}
                onChange={handleChange("usernameOrEmail")}
                error={Boolean(errors.usernameOrEmail)}
                helperText={errors.usernameOrEmail}
              />
              <TextField
                fullWidth
                label="Password"
                type={values.showPassword ? "text" : "password"}
                margin="normal"
                required
                value={values.password}
                onChange={handleChange("password")}
                error={Boolean(errors.password)}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={togglePasswordVisibility}
                        edge="end"
                      >
                        {values.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    checked={values.rememberMe}
                    onChange={handleCheckbox}
                  />
                }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ mr: 2 }}
              >
                Forgot password?
              </Link>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              <Link component={RouterLink} to="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Card.Content>
        </Card>
      </Container>
    </PublicLayout>
  );
};

export default Login;
