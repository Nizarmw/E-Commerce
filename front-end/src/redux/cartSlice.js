import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";

// Async thunk for fetching cart from backend
export const fetchCartFromBackend = createAsyncThunk(
  "cart/fetchFromBackend",
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return [];
      
      const token = localStorage.getItem("token");
      const response = await axios.get(process.env.REACT_APP_API_URL + "/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to fetch cart");
    }
  }
);

// Async thunk for syncing cart with backend
export const syncCartWithBackend = createAsyncThunk(
  "cart/syncWithBackend",
  async (cart, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return cart;
      
      const token = localStorage.getItem("token");
      await axios.post(
        process.env.REACT_APP_API_URL + "/api/cart/sync",
        { items: cart },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Failed to sync cart");
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find((i) => i.id === item.id);
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((i) => i.id === id);
      if (item) {
        item.quantity = quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    loadCartFromStorage: (state) => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        state.items = JSON.parse(savedCart);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartFromBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartFromBackend.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
        localStorage.setItem("cart", JSON.stringify(state.items));
      })
      .addCase(fetchCartFromBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(syncCartWithBackend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(syncCartWithBackend.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(syncCartWithBackend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity, 
  clearCart,
  loadCartFromStorage
} = cartSlice.actions;
export default cartSlice.reducer;
