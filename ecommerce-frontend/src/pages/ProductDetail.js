import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import { useState, useEffect } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">{product.name}</h1>
      <p>{product.description}</p>
      <p>Rp {product.price}</p>
      <button 
        className="bg-blue-500 text-white px-4 py-2 mt-4"
        onClick={() => dispatch(addToCart(product))}
      >
        Tambah ke Keranjang
      </button>
    </div>
  );
}
