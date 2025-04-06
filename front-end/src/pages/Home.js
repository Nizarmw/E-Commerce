import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + "/products/") // Mengambil data produk dari backend
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Daftar Produk</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        {products.map((product) => (
          <Link key={product.id} to={`/product/${product.id}`}>
            <div className="border p-4 rounded-lg hover:shadow-md">
              <h2 className="font-semibold">{product.name}</h2>
              <p>Rp {product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
