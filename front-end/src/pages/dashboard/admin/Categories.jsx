import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "../../../layouts/DashboardLayout";
import api from "../../../services/api";

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errorDialog, setErrorDialog] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories/");
      setCategories(res.data);
    } catch (err) {
      setError("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setName("");
    setErrorDialog(null);
    setOpenDialog(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setName(category.name);
    setErrorDialog(null);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        setError("Failed to delete category");
      }
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorDialog("Category name is required");
      return;
    }

    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, { name });
      } else {
        await api.post("/categories/", { name });
      }
      setOpenDialog(false);
      fetchCategories();
    } catch (err) {
      setError("Failed to save category");
    }
  };

  const columns = [
    { field: "name", headerName: "Category Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => handleDelete(params.row.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
          <Typography variant="h4">Categories</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Category
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <DataGrid
            rows={categories}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            loading={loading}
            autoHeight
            getRowId={(row) => row.id}
          />
        </Card>

        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {selectedCategory ? "Edit Category" : "Add New Category"}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              {errorDialog && <Alert severity="error">{errorDialog}</Alert>}
              <TextField
                required
                fullWidth
                label="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained">
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default CategoriesPage;
