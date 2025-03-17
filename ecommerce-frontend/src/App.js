import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Navbar from "./components/Navbar";
import Home from "./pages/home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/cart";
import Checkout from "./pages/checkout";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Dashboard from "./pages/dashboard";
import Seller from "./pages/seller";
import Admin from "./pages/admin";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/seller" element={<Seller />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
