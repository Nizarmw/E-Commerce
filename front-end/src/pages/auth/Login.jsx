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
import Card from "../../components/common/Card"; // Fix the import path
import Loading from "../../components/common/Loading";
import PublicLayout from "../../layouts/PublicLayout";
import axios from "axios";
import api from "../../services/api"; // Adjust the import path as necessary
import { API_URL } from "../../services/products";

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (errors[prop]) {
      setErrors({ ...errors, [prop]: "" });
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
    if (!values.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!values.password) {
      newErrors.password = "Password is required";
    }
    // else if (values.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          username_or_email: values.email,
          password: values.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          withCredentials: false, // Ubah ke false untuk menghindari CORS credentials issue
        }
      );

      if (response.data && response.data.token) {
        localStorage.setItem("token", response.data.token);

        // Simpan info user
        const userInfo = {
          name: response.data.user?.name || response.data.user?.full_name,
          email: response.data.user?.email,
          role: response.data.user?.role || "buyer",
        };
        setUserInfo(userInfo);

        if (userInfo.role === "admin") {
          navigate("/dashboard");
        } else if (userInfo.role === "seller") {
          navigate("/dashboard/seller");
        } else {
          navigate("/");
        }
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
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
          py: 8, // Add padding top and bottom
          minHeight: "calc(100vh - 128px)", // Account for header & footer
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
                label="Email"
                margin="normal"
                required
                value={values.email}
                onChange={handleChange("email")}
                error={Boolean(errors.email)}
                helperText={errors.email}
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
                        {values.showPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    value="remember"
                    color="primary"
                    checked={values.rememberMe}
                    onChange={handleCheckbox}
                  />
                }
                label="Remember me"
              />
            </Box>
          </Card.Content>
          <Card.Footer>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
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
          </Card.Footer>
        </Card>
      </Container>
    </PublicLayout>
  );
};

export default Login;
