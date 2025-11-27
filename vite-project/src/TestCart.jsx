import { useEffect, useState } from "react";
import axios from "axios";

export default function TestCart() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p._id}>
          <h2>{p.name}</h2>
          <p>₹{p.price}</p>
          <img src={p.image} alt={p.name} width={150} />
        </div>
      ))}
    </div>
  );
}
