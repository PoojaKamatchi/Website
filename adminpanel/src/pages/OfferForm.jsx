import { useState, useEffect } from "react";
import axios from "axios";

export default function OfferForm({ API_URL, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState(null); // <-- preview image
  const [loading, setLoading] = useState(false);

  // Update preview whenever URL or file changes
  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewSrc(reader.result);
      reader.readAsDataURL(imageFile);
    } else if (imageUrl) {
      setPreviewSrc(imageUrl);
    } else {
      setPreviewSrc(null);
    }
  }, [imageFile, imageUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("discount", discount);

      if (imageFile) {
        formData.append("imageFile", imageFile);
      } else if (imageUrl) {
        formData.append("image", imageUrl);
      }

      await axios.post(`${API_URL}/api/offers`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Reset form
      setTitle("");
      setDescription("");
      setDiscount("");
      setImageUrl("");
      setImageFile(null);
      setPreviewSrc(null);

      onSuccess();
    } catch (err) {
      console.error("Error adding offer:", err);
      alert("Failed to add offer. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-2xl shadow-xl space-y-5 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Add New Offer
      </h2>

      <input
        type="text"
        placeholder="Offer Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <input
        type="number"
        placeholder="Discount %"
        value={discount}
        onChange={(e) => setDiscount(e.target.value)}
        required
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <input
        type="text"
        placeholder="Image URL (optional)"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
      />

      <p className="text-gray-500 text-sm text-center">OR upload an image:</p>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="w-full"
      />

      {/* Preview */}
      {previewSrc && (
        <div className="mt-4 text-center">
          <p className="text-gray-700 mb-2 font-medium">Preview:</p>
          <img
            src={previewSrc}
            alt="Preview"
            className="mx-auto w-48 h-48 object-cover rounded-xl shadow-md"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-3 rounded-xl w-full transition duration-300"
      >
        {loading ? "Adding..." : "Add Offer"}
      </button>
    </form>
  );
}
