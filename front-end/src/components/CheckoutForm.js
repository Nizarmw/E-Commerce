import { useState } from "react";

const CheckoutForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block mb-1">Nama Lengkap</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Alamat</label>
        <textarea
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="input-field"
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
          className="input-field"
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
          className="input-field"
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
          className="input-field"
          required
        />
      </div>
      
      <button
        type="submit"
        className={`btn btn-primary w-full ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={loading}
      >
        {loading ? "Memproses..." : "Selesaikan Pesanan"}
      </button>
    </form>
  );
};

export default CheckoutForm;
