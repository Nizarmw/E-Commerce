import React, { useEffect, useState } from "react";
import PublicLayout from "../../layouts/PublicLayout";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Paper,
  Stack,
} from "@mui/material";
import api from "../../services/api";
import { use } from "react";
import { getUserInfo, isAuthenticated } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const userInfo = getUserInfo();
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please login to view your profile");
      navigate("/login", { state: { from: "/profile" } });
      return;
    }
  }, [navigate]);

  const getUser = async () => {
    try {
      const user = await api.get("/profile");

      console.log(user.data);
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <PublicLayout>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Stack direction="column" alignItems="center" spacing={2}>
            <Avatar sx={{ width: 100, height: 100, fontSize: 36 }}>
              {getInitials(userInfo?.name)}
            </Avatar>

            <Typography variant="h5" fontWeight={600}>
              Hello, {userInfo?.name || "Anonymous User"}
            </Typography>

            <Typography variant="body1" color="text.secondary">
              {userInfo?.email || "Email not provided"}
            </Typography>
          </Stack>
        </Paper>
      </Container>
    </PublicLayout>
  );
};

export default Profile;
