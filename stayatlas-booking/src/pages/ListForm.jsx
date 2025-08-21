import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import {
  Loader, Globe, UserCheck, Headset, DollarSign, Wrench,
  TrendingUp, Sliders, MapPin, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Importing background images
import img1 from "../assets/formbg1.jpg";
import img2 from "../assets/formbg2.jpg";
import img3 from "../assets/VILLA12.jpg";

const sliderImages = [img1, img2, img3];

const features = [
  { title: "Property Marketing", description: "Wider reach through expert listings and photos.", icon: <Globe className="w-8 h-8 text-indigo-600" /> },
  { title: "Guest Management", description: "Full guest support from booking to checkout.", icon: <UserCheck className="w-8 h-8 text-green-600" /> },
  { title: "Communication & Support", description: "24/7 assistance for guests and owners.", icon: <Headset className="w-8 h-8 text-yellow-600" /> },
  { title: "Pricing Strategy", description: "Smart pricing to boost bookings and revenue.", icon: <DollarSign className="w-8 h-8 text-red-500" /> },
  { title: "Property Maintenance", description: "Reliable upkeep and quick repairs.", icon: <Wrench className="w-8 h-8 text-blue-600" /> },
  { title: "Revenue Management", description: "Custom strategies to maximize income.", icon: <TrendingUp className="w-8 h-8 text-pink-500" /> },
  { title: "Flexible Management", description: "Support only where you need it.", icon: <Sliders className="w-8 h-8 text-orange-500" /> },
  { title: "Local Experience", description: "Personalized tips and curated experiences.", icon: <MapPin className="w-8 h-8 text-teal-600" /> },
  { title: "Legal Compliance", description: "Guidance to stay fully compliant.", icon: <ShieldCheck className="w-8 h-8 text-purple-600" /> },
];

const initialFormData = {
  villaOwner: "",
  villaName: "",
  email: "",
  phoneNumber: "",
  numberOfRooms: "",
  propertyType: "",
  address: {
    street: "",
    landmark: "",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    zipcode: ""
  },
  amenities: [],
  description: ""
};

export default function PropertyRequestPage() {
  const minPhotos = 3;
  const [formData, setFormData] = useState(initialFormData);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [allAmenities, setAllAmenities] = useState([
    "Air Conditioner", "Private Parking", "Barbeque (Chargeable)", "Microwave",
    "Sofa", "Dining Table", "Flat Screen Tv", "Wardrobe", "Refrigerator", "WiFi"
  ]);
  const [customAmenity, setCustomAmenity] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector(state => state.auth);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const [currentImage, setCurrentImage] = useState(0);

  // Auto slide images
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % sliderImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleFocus = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      e.target.blur();
      toast.error("Please log in to list your property.");
      setShowLoginPrompt(true);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (!isLoggedIn) {
      handleFocus(e);
      return;
    }

    if (type === "checkbox" && name === "amenities") {
      setSelectedAmenities((prev) =>
        checked ? [...prev, value] : prev.filter((item) => item !== value)
      );
      return;
    }

    if (["street", "landmark", "city", "state", "country", "zipcode"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
      return;
    }

    if (type === "file") {
      const fileArray = Array.from(files);
      setImages((prev) => [...prev, ...fileArray]);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomAmenity = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to list your property.");
      return;
    }
    if (customAmenity.trim()) {
      setAllAmenities(prev => [...prev, customAmenity.trim()]);
      setSelectedAmenities((prev) => [...prev, customAmenity.trim()]);
      setCustomAmenity("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      handleFocus(e);
      return;
    }
    if (formData.phoneNumber.length !== 10) {
      toast.error("Please enter a valid phone number!");
      return;
    }
    if (images.length < minPhotos) {
      toast.error(`Please upload at least ${minPhotos} photos.`);
      return;
    }
    if (images.length > 60) {
      toast.error("Maximum 60 images are allowed per villa.");
      return;
    }

    const finalData = { ...formData, amenities: selectedAmenities, images };
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      for (const key in finalData) {
        if (key === "images") {
          finalData[key].forEach((file) => formDataToSend.append(key, file));
        } else if (key === "address") {
          Object.entries(finalData.address).forEach(([k, v]) =>
            formDataToSend.append(`address[${k}]`, v)
          );
        } else if (key === "amenities") {
          finalData[key].forEach((a) => formDataToSend.append(key, a));
        } else {
          formDataToSend.append(key, finalData[key]);
        }
      }

      const response = await axios.post("/v1/villas/create-villa", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
        timeout: 120000,
      });
      if (response.data.statusCode === 201) {
        toast.success("Villa successfully listed for review.");
        setFormData(initialFormData);
        setSelectedAmenities([]);
        setImages([]);
        setCustomAmenity("");
      } else {
        toast.error("Error while submitting the form. Please try again.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Two column layout (image + form) */}
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Image Slider */}
        <div className="hidden md:block w-1/2 relative overflow-hidden">
          {sliderImages.map((img, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
          ))}
          <div className="absolute inset-0 bg-black opacity-20" />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 sm:p-8">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            <h2 className="text-3xl font-semibold text-center mb-8 -mt-8 text-gray-800">
  Property Request Form
</h2>


            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "villaOwner", placeholder: "Villa Owner Name *", type: "text" },
                  { name: "villaName", placeholder: "Villa Name *", type: "text" },
                  { name: "email", placeholder: "Email ID *", type: "email" },
                  { name: "phoneNumber", placeholder: "Mobile Phone *", type: "tel" },
                  { name: "numberOfRooms", placeholder: "Number of Rooms *", type: "number" }
                ].map((field) => (
                  <input
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    required
                    placeholder={field.placeholder}
                    className="w-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-lg p-3 text-gray-800"
                  />
                ))}
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  required
                  className="w-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-lg p-3 text-gray-800"
                >
                  <option value="">Select Property Type *</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["street", "landmark", "city", "state", "country", "zipcode"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      type="text"
                      value={formData.address[field]}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      required
                      placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} *`}
                      className="w-full border border-gray-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 rounded-lg p-3 text-gray-800"
                    />
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Amenities</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allAmenities.map((item) => (
                    <label key={item} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="amenities"
                        value={item}
                        checked={selectedAmenities.includes(item)}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        className="form-checkbox h-5 w-5 text-green-600"
                      />
                      <span className="ml-2 text-gray-800">{item}</span>
                    </label>
                  ))}
                  <div className="col-span-1 sm:col-span-2 flex items-center">
                    <input
                      type="text"
                      value={customAmenity}
                      onChange={(e) => setCustomAmenity(e.target.value)}
                      onFocus={handleFocus}
                      placeholder="Other amenity"
                      className="flex-grow border border-gray-300 rounded-lg p-3 text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                    />
                    <button
                      type="button"
                      onClick={handleCustomAmenity}
                      className="ml-3 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Photos */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Photos <span className="text-sm text-gray-500">(Minimum {minPhotos}, Maximum 60)</span>
                </label>
                <input
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  required
                  onChange={handleChange}
                  onFocus={handleFocus}
                  className="w-full border border-gray-300 rounded-lg p-2 text-gray-800"
                />
                {images.length > 0 && (
                  <div className="mt-2 text-sm text-gray-600">
                    {images.length} photo{images.length > 1 ? "s" : ""} selected
                  </div>
                )}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {images.map((file, idx) => (
                      <img
                        key={idx}
                        src={URL.createObjectURL(file)}
                        alt={`preview-${idx}`}
                        className="h-24 w-full object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  rows={4}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  placeholder="Describe Your Property"
                  className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition duration-200"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <Loader className="animate-spin" />
                  </div>
                ) : (
                  "Send Request"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* What We Offer Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">What We Offer</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 text-center"
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}