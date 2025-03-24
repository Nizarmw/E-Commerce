import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Chip,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Delete,
  Edit,
  Visibility,
  Search,
  FilterList
} from '@mui/icons-material';

// Sample data - would come from API in a real app
const orders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    date: '2023-05-10',
    amount: 129.99,
    status: 'Delivered',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    date: '2023-05-09',
    amount: 24.99,
    status: 'Processing',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-003',
    customer: 'Michael Brown',
    date: '2023-05-08',
    amount: 199.99,
    status: 'Shipped',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-004',
    customer: 'Emma Davis',
    date: '2023-05-07',
    amount: 59.99,
    status: 'Delivered',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-005',
    customer: 'Robert Wilson',
    date: '2023-05-06',
    amount: 79.99,
    status: 'Processing',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-006',
    customer: 'Jennifer Taylor',
    date: '2023-05-05',
    amount: 149.99,
    status: 'Cancelled',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'ORD-007',
    customer: 'David Miller',
    date: '2023-05-04',
    amount: 89.99,
    status: 'Delivered',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-008',
    customer: 'Lisa Anderson',
    date: '2023-05-03',
    amount: 44.99,
    status: 'Shipped',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-009',
    customer: 'William Thomas',
    date: '2023-05-02',
    amount: 129.99,
    status: 'Processing',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-010',
    customer: 'Jessica Garcia',
    date: '2023-05-01',
    amount: 69.99,
    status: 'Delivered',
    paymentMethod: 'PayPal'
  }
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'Processing':
      return 'warning';
    case 'Shipped':
      return 'info';
    case 'Cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const Orders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0);
  };

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredOrders.length) : 0;

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Orders
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage and track customer orders
        </Typography>
      </Box>

      <Card>
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search orders"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
            }}
            sx={{ width: { xs: '100%', sm: '300px' } }}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button 
              variant="outlined" 
              startIcon={<FilterList />}
              size="small"
            >
              Filter
            </Button>
            <Button 
              variant="contained" 
              size="small"
            >
              Add Order
            </Button>
          </Box>
        </Box>
        <Divider />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow hover key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>${order.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={order.status} 
                        size="small" 
                        color={getStatusColor(order.status)} 
                      />
                    </TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary">
                        <Visibility fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="secondary">
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
};

export default Orders;
