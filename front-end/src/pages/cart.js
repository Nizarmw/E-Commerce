import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadCartFromStorage, fetchCartFromBackend } from "../redux/cartSlice";
import Cart from "../components/Cart";

export default function CartPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    // First load from localStorage to prevent UI flash
    dispatch(loadCartFromStorage());
    
    // Then try to fetch from backend if user is authenticated
    dispatch(fetchCartFromBackend());
  }, [dispatch]);

  return <Cart />;
}
