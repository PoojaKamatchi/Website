import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePage() {

  // ENV + fallback
  const API =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: { street: "", city: "", state: "", pincode: "" },
  });

  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data || {};

      setUser(data);

      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || {
          street: "",
          city: "",
          state: "",
          pincode: "",
        },
      });

      setLoading(false);
    } catch (err) {
      console.error("Profile fetch error:", err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["street", "city", "state", "pincode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `${API}/api/users/profile`,
        {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditing(false);
      fetchUser();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center p-5 text-blue-600">
        Loading profile...
      </div>
    );

  if (!user)
    return (
      <div className="text-center p-5 text-red-500">
        Failed to load profile
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white shadow-2xl rounded-3xl p-8 border border-gray-100">

      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        My Profile
      </h2>

      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <img
          src={
            user?.profilePic ||
            "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          }
          alt="Avatar"
          className="w-36 h-36 rounded-full border-4 border-blue-400 shadow-lg"
        />
      </div>

      {/* Info */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Name */}
        <div>
          <label className="block font-semibold text-gray-700">Name</label>
          {editing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded-xl p-2 w-full"
            />
          ) : (
            <p className="text-gray-800">{user.name || "Not added"}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold text-gray-700">Phone</label>
          {editing ? (
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="border rounded-xl p-2 w-full"
            />
          ) : (
            <p className="text-gray-800">{user.phone || "Not added"}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold text-gray-700">Email</label>
          <p className="text-gray-800">{user.email}</p>
        </div>

        {/* Address */}
        <div>
          <label className="block font-semibold text-gray-700">Address</label>

          {editing ? (
            <>
              {["street", "city", "state", "pincode"].map((field) => (
                <input
                  key={field}
                  type="text"
                  name={field}
                  value={formData.address[field]}
                  onChange={handleChange}
                  placeholder={field}
                  className="border rounded-xl p-2 w-full mb-2"
                />
              ))}
            </>
          ) : (
            <p className="text-gray-800">
              {user?.address
                ? `${user.address.street || ""}, ${user.address.city || ""}, ${user.address.state || ""} - ${user.address.pincode || ""}`
                : "Not added"}
            </p>
          )}
        </div>

      </div>

      {/* Buttons */}
      <div className="mt-8 flex justify-center gap-5">
        {editing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
            >
              Save
            </button>

            <button
              onClick={() => setEditing(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-xl hover:bg-gray-600"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700"
          >
            Edit Profile
          </button>
        )}
      </div>

    </div>
  );
}
