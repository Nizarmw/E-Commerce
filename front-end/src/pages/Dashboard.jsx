import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  useTheme
} from '@mui/material';
import { 
  TrendingUp, 
  People, 
  ShoppingCart, 
  AttachMoney,
  MoreVert,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Sample data - replace with actual API calls in production
const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 5000 },
  { month: 'Apr', revenue: 4500 },
  { month: 'May', revenue: 6000 },
  { month: 'Jun', revenue: 5500 },
];

const salesData = [
  { name: 'Electronics', sales: 4000 },
  { name: 'Clothing', sales: 3000 },
  { name: 'Books', sales: 2000 },
  { name: 'Home', sales: 2780 },
  { name: 'Beauty', sales: 1890 },
  { name: 'Toys', sales: 2390 },
];

const recentOrders = [
  { id: '1', customer: 'John Smith', product: 'Wireless Headphones', amount: 129.99, status: 'Delivered' },
  { id: '2', customer: 'Sarah Johnson', product: 'Smartphone Case', amount: 24.99, status: 'Processing' },
  { id: '3', customer: 'Michael Brown', product: 'Smart Watch', amount: 199.99, status: 'Shipped' },
  { id: '4', customer: 'Emma Davis', product: 'Laptop Backpack', amount: 59.99, status: 'Delivered' },
  { id: '5', customer: 'Robert Wilson', product: 'Bluetooth Speaker', amount: 79.99, status: 'Processing' },
];

// Stats card component
const StatsCard = ({ icon, title, value, change, isPositive }) => {
  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography color="textPrimary" variant="h4">
              {value}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar
              sx={{
                backgroundColor: isPositive ? 'success.main' : 'error.main',
                height: 56,
                width: 56
              }}
            >
              {icon}
            </Avatar>
          </Grid>
        </Grid>
        <Box
          sx={{
            pt: 2,
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {isPositive ? <ArrowUpward color="success" /> : <ArrowDownward color="error" />}
          <Typography
            color={isPositive ? 'success.main' : 'error.main'}
            sx={{
              mr: 1
            }}
            variant="body2"
          >
            {change}
          </Typography>
          <Typography color="textSecondary" variant="caption">
            Since last month
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Overview */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            icon={<AttachMoney />} 
            title="TOTAL REVENUE" 
            value="$21,897" 
            change="12%" 
            isPositive={true} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            icon={<ShoppingCart />} 
            title="TOTAL ORDERS" 
            value="356" 
            change="8%" 
            isPositive={true} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            icon={<People />} 
            title="NEW CUSTOMERS" 
            value="143" 
            change="5%" 
            isPositive={true} 
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard 
            icon={<TrendingUp />} 
            title="CONVERSION RATE" 
            value="2.5%" 
            change="1.2%" 
            isPositive={false} 
          />
        </Grid>
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 340,
              boxShadow: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Revenue Overview
              </Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ height: '100%', pt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke={theme.palette.primary.main} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 340,
              boxShadow: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" component="h2" gutterBottom>
                Sales by Category
              </Typography>
              <IconButton>
                <MoreVert />
              </IconButton>
            </Box>
            <Divider />
            <Box sx={{ height: '100%', pt: 2 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill={theme.palette.secondary.main} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 2
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" component="h2">
                Recent Orders
              </Typography>
              <Typography variant="subtitle1" color="primary" sx={{ cursor: 'pointer' }}>
                View all
              </Typography>
            </Box>
            <Divider />
            <List>
              {recentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem
                    secondaryAction={
                      <Box>
                        <Typography variant="body2" color="textSecondary">
                          ${order.amount}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: order.status === 'Delivered' 
                              ? 'success.main' 
                              : order.status === 'Shipped' 
                              ? 'info.main' 
                              : 'warning.main' 
                          }}
                        >
                          {order.status}
                        </Typography>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: theme.palette.primary.light }}>
                        {order.customer.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={order.customer}
                      secondary={order.product}
                    />
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
