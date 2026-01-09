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

  // Preview image when file or URL changes
  useEffect(() => {
    if (imageFile) setPreview(URL.createObjectURL(imageFile));
    else if (imageUrl) setPreview(imageUrl);
    else setPreview(null);
  }, [imageFile, imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !discount) {
      alert("Title and discount are required!");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("discount", Number(discount)); // convert to number
    if (imageFile) data.append("imageFile", imageFile); // matches multer
    else if (imageUrl) data.append("image", imageUrl);

    try {
      await axios.post(`${API_URL}/api/offers`, data);
      onSuccess(); // refresh offers
      // reset form
      setTitle("");
      setDescription("");
      setDiscount("");
      setImageUrl("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to add offer");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-xl shadow max-w-xl mx-auto"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Offer title"
        className="border p-2 w-full mb-3"
        required
      />
      <input
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        placeholder="Discount %"
        className="border p-2 w-full mb-3"
        type="number"
        required
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="border p-2 w-full mb-3"
      />
      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files[0])}
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="h-40 mx-auto mt-3 rounded object-cover"
        />
      )}
      <button className="bg-blue-600 text-white w-full py-2 mt-4 rounded">
        Add Offer
      </button>
    </form>
  );
}
