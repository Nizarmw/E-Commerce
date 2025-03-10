import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logout berhasil!");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-500 p-4 flex justify-between text-white">
      <Link to="/" className="text-xl font-bold">E-Commerce</Link>
      <div className="flex gap-4">
        <Link to="/cart">🛒 Cart</Link>
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-1">
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
