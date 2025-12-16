import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function OfferForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (imageFile) setPreview(URL.createObjectURL(imageFile));
    else if (imageUrl) setPreview(imageUrl);
    else setPreview(null);
  }, [imageFile, imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("discount", discount);

    if (imageFile) data.append("image", imageFile);
    else if (imageUrl) data.append("image", imageUrl);

    await axios.post(`${API_URL}/api/offers`, data);
    onSuccess();
    setTitle("");
    setDescription("");
    setDiscount("");
    setImageUrl("");
    setImageFile(null);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Offer title"
        className="border p-2 w-full mb-2"
      />
      <input
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        placeholder="Discount %"
        className="border p-2 w-full mb-2"
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="border p-2 w-full mb-2"
      />
      <input type="file" onChange={(e) => setImageFile(e.target.files[0])} />
      {preview && <img src={preview} className="h-40 mt-2" />}
      <button className="bg-blue-600 text-white px-4 py-2 mt-3 rounded">
        Add Offer
      </button>
    </form>
  );
}
