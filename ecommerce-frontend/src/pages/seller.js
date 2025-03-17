import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";

export default function Seller() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      try {
        // Verify seller role
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8080/api/users/role", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data.role !== "seller" && response.data.role !== "admin") {
          alert("You don't have seller privileges");
          navigate("/");
          return;
        }
        
        // Fetch seller products and categories
        fetchProducts();
        fetchCategories();
      } catch (error) {
        console.error("Error:", error);
        alert("Authentication failed");
        navigate("/login");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8080/api/products/seller", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      
      if (isEditing) {
        // Update existing product
        await axios.put(
          `http://localhost:8080/api/products/${currentProductId}`,
          formData,
          { headers }
        );
        alert("Product updated successfully");
      } else {
        // Create new product
        await axios.post(
          "http://localhost:8080/api/products",
          formData,
          { headers }
        );
        alert("Product created successfully");
      }
      
      // Reset form and refresh products
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        categoryId: "",
      });
      setIsEditing(false);
      setCurrentProductId(null);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product");
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    });
    setIsEditing(true);
    setCurrentProductId(product.id);
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8080/api/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert("Product deleted successfully");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Failed to delete product");
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="bg-gray-50 p-4 border">
            <div className="mb-4">
              <label className="block mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border p-2 w-full"
                rows="3"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Price (Rp)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="border p-2 w-full"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="border p-2 w-full"
                min="0"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Category</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="border p-2 w-full"
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 flex-1"
              >
                {isEditing ? "Update Product" : "Add Product"}
              </button>
              
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      name: "",
                      description: "",
                      price: "",
                      stock: "",
                      categoryId: "",
                    });
                    setIsEditing(false);
                    setCurrentProductId(null);
                  }}
                  className="bg-gray-500 text-white px-4 py-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Products List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Products</h2>
          {products.length === 0 ? (
            <p className="text-gray-500">You don't have any products yet.</p>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 bg-white">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex justify-between text-sm">
                    <span>Price: Rp {product.price.toLocaleString('id-ID')}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="bg-yellow-500 text-white px-3 py-1 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="bg-red-500 text-white px-3 py-1 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
