import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getCart, 
  syncCart, 
  addItemToCart, 
  removeItemFromCart,
  updateItemQuantity,
  clearCartItems
} from "../services/cart";
import { isAuthenticated } from "../services/users";

// Async thunk untuk mengambil keranjang dari backend
export const fetchCartFromBackend = createAsyncThunk(
  "cart/fetchFromBackend",
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return [];
      
      const cartData = await getCart();
      return cartData;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Gagal mengambil data keranjang");
    }
  }
);

// Async thunk untuk menyinkronkan keranjang dengan backend
export const syncCartWithBackend = createAsyncThunk(
  "cart/syncWithBackend",
  async (cart, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return cart;
      
      await syncCart(cart);
      return cart;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Gagal menyinkronkan keranjang");
    }
  }
);

// Async thunk untuk menambahkan item ke keranjang di backend
export const addItemToBackend = createAsyncThunk(
  "cart/addItemToBackend",
  async (item, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return item;
      
      const addedItem = await addItemToCart(item);
      return addedItem;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Gagal menambahkan item ke keranjang");
    }
  }
);

// Async thunk untuk menghapus item dari keranjang di backend
export const removeItemFromBackend = createAsyncThunk(
  "cart/removeItemFromBackend",
  async (itemId, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return itemId;
      
      await removeItemFromCart(itemId);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Gagal menghapus item dari keranjang");
    }
  }
);

// Async thunk untuk mengupdate jumlah item di backend
export const updateItemQuantityInBackend = createAsyncThunk(
  "cart/updateItemQuantityInBackend",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return { id, quantity };
      
      await updateItemQuantity(id, quantity);
      return { id, quantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Gagal mengupdate jumlah item");
    }
  }
);

// Async thunk untuk mengosongkan keranjang di backend
export const clearCartInBackend = createAsyncThunk(
  "cart/clearCartInBackend",
  async (_, { rejectWithValue }) => {
    try {
      if (!isAuthenticated()) return;
      
      await clearCartItems();
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Gagal mengosongkan keranjang");
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
      
      // Simpan ke localStorage
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
      // fetchCartFromBackend
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
      
      // syncCartWithBackend
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
      })
      
      // Tambahan untuk async thunk baru
      .addCase(addItemToBackend.fulfilled, (state, action) => {
        // Update state jika diperlukan setelah sukses menambahkan ke backend
      })
      .addCase(removeItemFromBackend.fulfilled, (state, action) => {
        // Update state jika diperlukan setelah sukses menghapus dari backend
      })
      .addCase(updateItemQuantityInBackend.fulfilled, (state, action) => {
        // Update state jika diperlukan setelah sukses mengupdate di backend
      })
      .addCase(clearCartInBackend.fulfilled, (state) => {
        // Update state jika diperlukan setelah sukses mengosongkan keranjang di backend
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
