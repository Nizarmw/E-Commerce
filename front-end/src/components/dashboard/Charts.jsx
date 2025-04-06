import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Box, Paper, Typography } from '@mui/material';

export const SimpleBarChart = ({ data, title, dataKey, barColor = '#1A237E' }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey={dataKey} fill={barColor} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export const SimpleLineChart = ({ data, title, dataKey, lineColor = '#FFCA28' }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey={dataKey} stroke={lineColor} />
      </LineChart>
    </ResponsiveContainer>
  </Paper>
);

export const SimplePieChart = ({ data, title, colors }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </Paper>
);

export const SimpleAreaChart = ({ data, title, dataKey, areaColor = '#1A237E' }) => (
  <Paper sx={{ p: 3, height: '100%' }}>
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          stroke={areaColor} 
          fill={`${areaColor}20`}
        />
      </AreaChart>
    </ResponsiveContainer>
  </Paper>
);

// Usage example component
const ChartsDashboard = () => {
  const salesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 2000 },
    { name: 'Apr', sales: 2780 },
    { name: 'May', sales: 1890 },
    { name: 'Jun', sales: 2390 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Books', value: 300 },
    { name: 'Home', value: 200 },
  ];

  const chartColors = ['#1A237E', '#FFCA28', '#4CAF50', '#F44336'];

  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'repeat(2, 1fr)' }}>
      <SimpleBarChart
        data={salesData}
        title="Monthly Sales"
        dataKey="sales"
      />
      <SimpleLineChart
        data={salesData}
        title="Sales Trend"
        dataKey="sales"
      />
      <SimplePieChart
        data={categoryData}
        title="Sales by Category"
        colors={chartColors}
      />
      <SimpleAreaChart
        data={salesData}
        title="Revenue Growth"
        dataKey="sales"
      />
    </Box>
  );
};

export default ChartsDashboard;
