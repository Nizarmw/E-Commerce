import React, { useState } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Typography,
  Link,
  Divider,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Loading from "../../components/common/Loading";
import PublicLayout from "../../layouts/PublicLayout";
import axios from "axios";
import api from "../../services/api"; // Adjust the import path as necessary
import { API_URL } from "../../services/products";

const Register = () => {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer", // Add this
    showPassword: false,
    showConfirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    if (errors[prop]) setErrors({ ...errors, [prop]: "" });
  };

  const togglePasswordVisibility = (field) => () => {
    setValues({ ...values, [field]: !values[field] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!values.fullName) newErrors.fullName = "Full name is required";
    if (!values.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(values.email))
      newErrors.email = "Email is invalid";
    if (!values.password) newErrors.password = "Password is required";
    if (!values.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (values.password !== values.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    } else if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
      setErrors({});

      try {
        // Format data sesuai ekspektasi backend
        const userData = {
          name: values.fullName, // Ubah format nama field
          email: values.email,
          password: values.password,
          role: values.role, // Add this
        };

        console.log("Sending registration data:", userData); // Debug log

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/register`,
          userData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            withCredentials: false,
          }
        );

        // Log response untuk debugging
        console.log("Registration response:", response.data);

        if (response.data) {
          alert("Registration successful! Please log in.");
          navigate("/login");
        } else {
          throw new Error("Invalid response from server");
        }
      } catch (error) {
        console.error("Registration error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          data: error.response?.data,
        });

        // Tampilkan pesan error yang lebih deskriptif
        setErrors({
          form:
            error.response?.data?.error ||
            error.response?.data?.message ||
            "Registration failed. Please check your information and try again.",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const roles = [
    { value: "buyer", label: "Buyer" },
    { value: "seller", label: "Seller" },
  ];

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
        {loading && <Loading overlay text="Creating your account..." />}
        <Card variant="elevated" sx={{ width: "100%" }}>
          <Card.Header>
            <Card.Title>Create Account</Card.Title>
          </Card.Header>
          <Card.Content>
            {errors.form && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.form}
              </Alert>
            )}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                margin="normal"
                required
                value={values.fullName}
                onChange={handleChange("fullName")}
                error={Boolean(errors.fullName)}
                helperText={errors.fullName}
              />
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
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={values.role}
                  onChange={handleChange("role")}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      {role.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
                        onClick={togglePasswordVisibility("showPassword")}
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
              <TextField
                fullWidth
                label="Confirm Password"
                type={values.showConfirmPassword ? "text" : "password"}
                margin="normal"
                required
                value={values.confirmPassword}
                onChange={handleChange("confirmPassword")}
                error={Boolean(errors.confirmPassword)}
                helperText={errors.confirmPassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility(
                          "showConfirmPassword"
                        )}
                        edge="end"
                      >
                        {values.showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              <Link component={RouterLink} to="/login" variant="body2">
                Already have an account? Sign In
              </Link>
            </Box>
          </Card.Footer>
        </Card>
      </Container>
    </PublicLayout>
  );
};

export default Register;
