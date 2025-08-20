import React, { useState, useEffect } from "react";
import img1 from "../../assets/formbg1.jpg";
import img2 from "../../assets/formbg2.jpg";
import img3 from "../../assets/VILLA12.jpg";

const images = [img1, img2, img3];

const PropertyRequestForm = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Form Half - Left Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            List Your Property With Us
          </h2>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input type="text" id="firstName" name="firstName" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input type="text" id="lastName" name="lastName" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input type="tel" id="mobile" name="mobile" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Property Location *</label>
              <select id="location" name="location" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Location</option>
                <option value="aurangabad">Aurangabad</option>
                <option value="lonavala">Lonavala</option>
                <option value="karjat">Karjat</option>
                <option value="kasauli">Kasauli</option>
                <option value="ooty">Ooty</option>
                <option value="mussoorie">Mussoorie</option>
                <option value="panchgani">Panchgani</option>
                <option value="udaipur">Udaipur</option>
                <option value="nainital">Nainital</option>
                <option value="goa">Goa</option>
                <option value="alibaug">Alibaug</option>
                <option value="manali">Manali</option>
                <option value="coorg">Coorg</option>
                <option value="nashik">Nashik</option>
                <option value="jaipur">Jaipur</option>
                <option value="alleppey">Alleppey</option>
                <option value="wayanad">Wayanad</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">Property Type *</label>
                <select id="propertyType" name="propertyType" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Type</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label htmlFor="rooms" className="block text-sm font-medium text-gray-700 mb-1">Number of Rooms *</label>
                <select id="rooms" name="rooms" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select Rooms</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5+</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="photos" className="block text-sm font-medium text-gray-700 mb-1">Property Photos</label>
              <input type="file" id="photos" name="photos" accept="image/*" multiple className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Property Description</label>
              <textarea id="description" name="description" rows="4" placeholder="Tell us about your property..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-300 shadow-md hover:shadow-xl">
              Submit Property Details
            </button>
          </form>
        </div>
      </div>

      {/* Slideshow Half - Right Side */}
      <div className="hidden md:block w-1/2 relative overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentImage ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black opacity-20" />
      </div>
    </div>
  );
};

export default PropertyRequestForm;
