import { useSelector, useDispatch } from "react-redux";
import { removeFromCart } from "../redux/cartSlice";

export default function Cart() {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Keranjang Belanja</h1>
      {cart.length === 0 ? (
        <p>Keranjang kosong</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="border p-4 my-2 flex justify-between">
            <p>{item.name} - Rp {item.price}</p>
            <button
              className="bg-red-500 text-white px-2"
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Hapus
            </button>
          </div>
        ))
      )}
    </div>
  );
}
