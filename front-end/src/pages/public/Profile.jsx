import React, { useEffect, useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Stack,
  TextField,
  Button,
  Alert,
} from "@mui/material";
import api from "../../services/api";
import { getUserInfo, isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please login to view your profile");
      navigate("/login", { state: { from: "/profile" } });
      return;
    }

    const getUser = async () => {
      try {
        const response = await api.get("/profile");
        setUser(response.data);
        setFormData({
          name: response.data.name || "",
          email: response.data.email || "",
        });
      } catch (error) {
        console.error("Error getting user info:", error);
      }
    };

    getUser();
  }, [navigate]);

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/profile", formData);
      setUser(res.data);
      setSuccessMessage("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <PublicLayout>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stack direction="column" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 100, height: 100, fontSize: 36 }}>
              {getInitials(user.name || "Anonymous User")}
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              Hello, {user.name || "Anonymous User"}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {user.email || "Email not provided"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
  Role: {user.role || "Not defined"}
</Typography>

          </Stack>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
            {successMessage && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {successMessage}
              </Alert>
            )}

            <TextField
              fullWidth
              name="name"
              label="Full Name"
              value={formData.name}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Save Changes
            </Button>
          </Box>
        </Paper>
      </Container>
    </PublicLayout>
  );
};

export default Profile;
