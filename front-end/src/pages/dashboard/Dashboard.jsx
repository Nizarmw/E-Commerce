import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from '@mui/material';
import {
  ShoppingCart,
  People,
  AttachMoney,
  Inventory,
  MoreVert,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { DashboardLayout } from '../../layouts';

// Mock data - replace with actual API calls
const salesData = [
  { month: 'Jan', sales: 4000 },
  { month: 'Feb', sales: 3000 },
  { month: 'Mar', sales: 5000 },
  { month: 'Apr', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'Jun', sales: 2390 },
];

const orderData = [
  { date: '1/6', orders: 24 },
  { date: '2/6', orders: 35 },
  { date: '3/6', orders: 28 },
  { date: '4/6', orders: 42 },
  { date: '5/6', orders: 31 },
  { date: '6/6', orders: 38 },
];

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: 2,
            p: 1,
            mr: 2,
          }}
        >
          {icon}
        </Box>
        <IconButton size="small">
          <MoreVert />
        </IconButton>
      </Box>
      <Typography variant="h4" sx={{ mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 4 }}>
          Dashboard
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value="1,284"
              icon={<ShoppingCart sx={{ color: 'primary.main' }} />}
              color="#1A237E"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value="856"
              icon={<People sx={{ color: 'secondary.main' }} />}
              color="#FFCA28"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Revenue"
              value="Rp 45.6M"
              icon={<AttachMoney sx={{ color: 'success.main' }} />}
              color="#4CAF50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Products"
              value="384"
              icon={<Inventory sx={{ color: 'error.main' }} />}
              color="#F44336"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sales Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sales" fill="#1A237E" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Orders
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="orders" stroke="#FFCA28" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;
