import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { isAuthenticated } from "../utils/auth";

export default function Checkout() {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Silakan login terlebih dahulu untuk checkout");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang belanja kosong");
      navigate("/cart");
    }
  }, [cart, navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:8080/api/orders",
        {
          items: cart.map((item) => ({
            productId: item.id,
            quantity: 1,
            price: item.price,
          })),
          shippingDetails: formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order berhasil dibuat! Nomor order: " + response.data.orderId);
      // TODO: Clear cart after successful order
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout gagal. Coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Alamat</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border p-2 w-full"
                required
                rows="3"
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Kota</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Kode Pos</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block mb-1">Nomor Telepon</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="border p-2 w-full"
                required
              />
            </div>
            
            <button
              type="submit"
              className={`bg-green-500 text-white px-4 py-2 w-full ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Selesaikan Pesanan"}
            </button>
          </form>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
          <div className="bg-gray-50 p-4 border">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2 pb-2 border-b">
                <span>{item.name}</span>
                <span>Rp {item.price.toLocaleString('id-ID')}</span>
              </div>
            ))}
            
            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span>Rp {calculateTotal().toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
