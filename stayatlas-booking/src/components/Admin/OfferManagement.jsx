import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ClipboardCopy } from "lucide-react";

const gradientOptions = [
  "from-blue-400 to-blue-600",
  "from-red-400 to-yellow-500",
  "from-green-400 to-emerald-600",
  "from-purple-400 to-pink-600",
  "from-orange-400 to-red-600",
  "from-teal-400 to-cyan-600",
];

const iconOptions = [
  { label: "Plane", value: "plane" },
  { label: "Wallet", value: "wallet" },
  { label: "Location", value: "location" },
  { label: "Calendar", value: "calendar" },
];

const initialFormState = {
  title: "",
  subtitle: "",
  description: "",
  validTill: "",
  code: "",
  discount: "",
  type: "all",
  gradient: gradientOptions[0],
  icon: "plane",
};

const OfferManagement = () => {
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState(initialFormState);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const fetchOffers = async () => {
    try {
      const res = await axios.get("/v1/offers");
      setOffers(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch offers");
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/v1/offers/${editingId}`, form);
        toast.success("Offer updated!");
      } else {
        await axios.post("/v1/offers", form);
        toast.success("Offer created!");
      }
      setForm(initialFormState);
      setIsEditing(false);
      setEditingId(null);
      fetchOffers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save offer");
    }
  };

  const handleEdit = (offer) => {
    setForm({
      title: offer.title,
      subtitle: offer.subtitle,
      description: offer.description,
      validTill: offer.validTill.slice(0, 10),
      code: offer.code,
      discount: offer.discount,
      type: offer.type,
      gradient: offer.gradient,
      icon: offer.icon,
    });
    setIsEditing(true);
    setEditingId(offer._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await axios.delete(`/v1/offers/${id}`);
        toast.success("Offer deleted!");
        fetchOffers();
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete offer");
      }
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-2xl md:text-4xl font-extrabold text-green-700 tracking-tight">
          Offer Management
        </h1>
      </div>

      <h2 className="text-2xl font-bold mb-6"> Create Offers</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-md mb-10"
      >
        {[
          { label: "Title", name: "title" },
          { label: "Subtitle", name: "subtitle" },
          { label: "Description", name: "description" },
          { label: "Code (UNIQUE)", name: "code" },
          { label: "Discount", name: "discount" },
          { label: "Valid Till", name: "validTill", type: "date" },
        ].map(({ label, name, type = "text" }) => (
          <div key={name}>
            <label className="block font-medium">{label}</label>
            <input
              type={type}
              name={name}
              value={form[name]}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded mt-1"
              required={name !== "subtitle"}
            />
          </div>
        ))}

        <div>
          <label className="block font-medium">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="all">All</option>
            <option value="wallet">Wallet</option>
            <option value="stay">Stay</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Gradient</label>
          <select
            name="gradient"
            value={form.gradient}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            {gradientOptions.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-medium">Icon</label>
          <select
            name="icon"
            value={form.icon}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            {iconOptions.map((icon) => (
              <option key={icon.value} value={icon.value}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-full">
          <button
            type="submit"
            className={`${
              isEditing
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white px-6 py-2 rounded transition`}
          >
            {isEditing ? "Update Offer" : "Create Offer"}
          </button>
        </div>
      </form>

      {/* EXISTING OFFERS */}
      <div>
        <h3 className="text-xl font-semibold mb-4">📋 Existing Offers</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.slice(0, visibleCount).map((offer) => (
            <div
              key={offer._id}
              className={`rounded-2xl text-white bg-gradient-to-r ${offer.gradient} p-5 relative shadow-md`}
            >
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                <span className="bg-black px-3 py-1 text-sm rounded-full text-white font-semibold">
                  {offer.discount}
                </span>
              </div>

              <h4 className="text-lg font-bold mt-4">{offer.title}</h4>
              <p className="text-sm opacity-90">{offer.subtitle}</p>
              <p className="text-sm mt-1">{offer.description}</p>
              <p className="text-xs mt-1">
                Valid Till: {new Date(offer.validTill).toLocaleDateString()}
              </p>

              <div className="flex justify-between items-center bg-black p-2 mt-4 rounded-xl">
                <span className="text-white px-2 py-1 border border-dashed rounded font-mono text-sm">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleCopy(offer.code)}
                  className="bg-white text-black px-3 py-1 rounded flex items-center gap-1 text-sm"
                >
                  <ClipboardCopy size={16} /> Copy
                </button>
              </div>

              {/* Edit/Delete for admin */}
              <div className="absolute top-2 left-2 flex gap-2">
                <button
                  onClick={() => handleEdit(offer)}
                  className="bg-white text-blue-600 px-2 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(offer._id)}
                  className="bg-white text-red-600 px-2 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Show More / Show Less */}
        {offers.length > 6 && (
          <div className="text-center mt-6">
            <button
              onClick={() =>
                setVisibleCount(visibleCount === 6 ? offers.length : 6)
              }
              className="text-blue-600 font-semibold underline"
            >
              {visibleCount === 6 ? "Show More" : "Show Less"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferManagement;
