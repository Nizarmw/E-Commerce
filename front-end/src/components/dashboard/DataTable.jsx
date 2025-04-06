import React, { useState, useRef } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import { FilterList, Search } from '@mui/icons-material';

const DataTable = ({ 
  columns, 
  data, 
  defaultSort = 'id',
  defaultOrder = 'asc',
  onRowClick,
  title = 'Data Table' 
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState(defaultSort);
  const [order, setOrder] = useState(defaultOrder);
  const [filterText, setFilterText] = useState('');
  const tableRef = useRef(null);

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleKeyNav = (e, rowId) => {
    const rows = tableRef.current.querySelectorAll('[role="row"]');
    const currentIndex = Array.from(rows).findIndex(row => row.getAttribute('data-row-id') === rowId);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < rows.length - 1) {
          rows[currentIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          rows[currentIndex - 1].focus();
        }
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onRowClick?.(rowId);
        break;
      default:
        break;
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const sortedData = filteredData.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper 
      sx={{ width: '100%', mb: 2 }}
      role="region"
      aria-label={title}
    >
      <Box 
        sx={{ p: 2 }} 
        role="search"
        aria-label="Table search and filters"
      >
        <TextField
          size="small"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            'aria-label': 'Search table content',
          }}
        />
        <Box id="search-description" sx={{ mt: 1 }} aria-live="polite">
          {filterText && `Found ${filteredData.length} results for "${filterText}"`}
        </Box>
      </Box>

      <TableContainer ref={tableRef}>
        <Table 
          aria-label={title}
          role="grid"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  sortDirection={orderBy === column.id ? order : false}
                  aria-sort={orderBy === column.id 
                    ? order === 'asc' ? 'ascending' : 'descending'
                    : 'none'
                  }
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                    aria-label={`Sort by ${column.label}`}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow
                hover
                key={row.id}
                onClick={() => onRowClick?.(row)}
                onKeyDown={(e) => handleKeyNav(e, row.id)}
                tabIndex={0}
                role="row"
                data-row-id={row.id}
                aria-rowindex={index + 1}
                sx={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:focus': {
                    outline: '2px solid primary.main',
                    outlineOffset: '-2px',
                  }
                }}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={column.id}
                    role="gridcell"
                    aria-label={`${column.label}: ${row[column.id]}`}
                  >
                    {column.format ? column.format(row[column.id]) : row[column.id]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        aria-label="Table pagination"
      />
    </Paper>
  );
};

export default DataTable;
