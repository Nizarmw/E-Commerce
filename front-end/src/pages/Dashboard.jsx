import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  useTheme
} from '@mui/material';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const theme = useTheme();

  // Sample data for charts
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Home', value: 300 },
    { name: 'Books', value: 200 },
  ];

  // Sample recent orders data
  const recentOrders = [
    { id: 1, customer: 'John Doe', product: 'Wireless Headphones', status: 'Delivered', amount: 129.99 },
    { id: 2, customer: 'Jane Smith', product: 'Smartphone X12', status: 'Processing', amount: 899.99 },
    { id: 3, customer: 'Robert Johnson', product: 'Laptop Pro', status: 'Shipped', amount: 1299.99 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      
      {/* Summary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { title: 'Total Sales', value: '$24,560', color: '#3f51b5' },
          { title: 'Total Orders', value: '1,245', color: '#f44336' },
          { title: 'New Customers', value: '356', color: '#4caf50' },
          { title: 'Product Views', value: '12,932', color: '#ff9800' }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ bgcolor: item.color, color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>{item.title}</Typography>
                <Typography variant="h4">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Sales Trend Chart */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales Trend</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Category Distribution */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Sales by Category</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Recent Orders */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            <List>
              {recentOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <ListItem
                    secondaryAction={
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1 
                      }}>
                        <Typography variant="body2">
                          ${order.amount}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: order.status === 'Delivered' ? 'green' : 
                                  (order.status === 'Processing' ? 'orange' : 'blue')
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