import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import DashboardLayout from "../../layouts/DashboardLayout";
import { getUserInfo, isAuthenticated } from "../../utils/auth";
import { getUsers, updateUserRole, deactivateUser } from "../../services/users";
import Loading from "../../components/common/Loading";
import api from "../../services/api";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuth = async () => {
    if (!isAuthenticated()) {
      alert("Unauthorized access");
      navigate("/login");
      return;
    }

    const userInfo = getUserInfo();

    if (userInfo?.role !== "admin") {
      alert("Authentication failed");
      navigate("/login");
      return;
    }
  };

  useEffect(() => {
    checkAuth();
  }, [navigate]);

  const checkUserRole = async () => {
    // This would be moved to a proper service layer
    try {
      const response = await getUsers();
      return response.role;
    } catch (error) {
      throw error;
    }
  };

  // const fetchUsers = async () => {
  //   try {
  //     const data = await api.get("");
  //     setUsers(data);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleRoleChange = async (userId, newRole) => {
  //   try {
  //     await updateUserRole(userId, newRole);
  //     fetchUsers();
  //     alert("User role updated successfully");
  //   } catch (error) {
  //     console.error("Error updating user role:", error);
  //     alert("Failed to update user role");
  //   }
  // };

  // const handleDeactivate = async (userId) => {
  //   if (window.confirm("Are you sure you want to deactivate this user?")) {
  //     try {
  //       await deactivateUser(userId);
  //       fetchUsers();
  //       alert("User deactivated successfully");
  //     } catch (error) {
  //       console.error("Error deactivating user:", error);
  //       alert("Failed to deactivate user");
  //     }
  //   }
  // };

  // if (loading) {
  //   return (
  //     <DashboardLayout>
  //       <Box
  //         sx={{
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //           height: "100%",
  //         }}
  //       >
  //         <Loading text="Loading dashboard..." />
  //       </Box>
  //     </DashboardLayout>
  //   );
  // }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Admin Dashboard
        </Typography>

        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2 }}
            fontWeight="medium"
          >
            User Management
          </Typography>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <FormControl size="small" fullWidth>
                        <Select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.id, e.target.value)
                          }
                        >
                          <MenuItem value="buyer">Buyer</MenuItem>
                          <MenuItem value="seller">Seller</MenuItem>
                          <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeactivate(user.id)}
                      >
                        Deactivate
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
