import React from 'react';
import { Upload, Play, X, Clock } from 'lucide-react';

export const ReviewModal = ({
  modalOpen,
  editedVilla,
  closeModal,
  handleInputChange,
  handleAddressChange,
  handleAmenityChange,
  handleAddAmenity,
  handleRemoveAmenity,
  saveChanges,
  handleImageChange,
  handleAddImage,
  handleRemoveImage,
  handleRoomChange,
  handleAddRoom,
  handleRemoveRoom,
  handleRealMomentChange,
  handleAddRealMoment,
  handleRemoveRealMoment,
  // NEW: Video upload props
  handleVideoUpload,
  videoUploads
}) => {
  if (!modalOpen || !editedVilla) return null;

  // Handle video file selection
  const handleVideoFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      handleVideoUpload(file, index);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Review Villa</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Villa Name</label>
                <input
                  type="text"
                  name="villaName"
                  value={editedVilla.villaName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Owner Name</label>
                <input
                  type="text"
                  name="villaOwner"
                  value={editedVilla.villaOwner}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  value={editedVilla.propertyType}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Rooms</label>
                <input
                  type="text"
                  name="numberOfRooms"
                  value={editedVilla.numberOfRooms}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editedVilla.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={editedVilla.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="street"
                placeholder="Street"
                value={editedVilla.address?.street || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="landmark"
                placeholder="Landmark"
                value={editedVilla.address?.landmark || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={editedVilla.address?.city || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                value={editedVilla.address?.state || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={editedVilla.address?.country || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                name="zipcode"
                placeholder="Zipcode"
                value={editedVilla.address?.zipcode || ""}
                onChange={handleAddressChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Weekday Price (₹)</label>
                <input
                  type="number"
                  name="weekdayPrice"
                  value={editedVilla.pricePerNightBoth?.weekday || 0}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Weekend Price (₹)</label>
                <input
                  type="number"
                  name="weekendPrice"
                  value={editedVilla.pricePerNightBoth?.weekend || 0}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night</label>
                <input
                  type="number"
                  name="pricePerNight"
                  value={editedVilla.pricePerNight}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                <input
                  type="number"
                  name="discountPercent"
                  value={editedVilla.discountPercent || 0}
                  onChange={handleInputChange}
                  min="0"
                  max="100"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Promotion Text</label>
                <textarea
                  name="promotionText"
                  value={editedVilla.promotionText || ""}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="isExclusive"
                  checked={editedVilla.isExclusive}
                  onChange={handleInputChange}
                  className="mr-2 w-4 h-4 text-blue-600"
                />
                <span className="text-sm font-medium">Exclusive Villa</span>
              </label>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Amenities</h3>
            {editedVilla.amenities?.map((amenity, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={amenity}
                  onChange={(e) => handleAmenityChange(index, e.target.value)}
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter amenity"
                />
                <button
                  onClick={() => handleRemoveAmenity(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddAmenity}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Amenity
            </button>
          </div>

          {/* Images */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Images</h3>
            {editedVilla.images?.map((image, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="Image URL"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={handleAddImage}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Image
            </button>
          </div>

          {/* Real Moments - Updated for Video File Upload */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Real Moments</h3>
            {editedVilla.realMoments?.map((moment, index) => {
              const uploadKey = `${editedVilla._id}-${index}`;
              const uploadStatus = videoUploads[uploadKey];
              
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Moment Name</label>
                      <input
                        type="text"
                        name="name"
                        value={moment.name}
                        onChange={(e) => handleRealMomentChange(e, index)}
                        placeholder="Enter moment name"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={moment.date}
                        onChange={(e) => handleRealMomentChange(e, index)}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  {/* Video Upload Section */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Video</label>
                    
                    {/* Current Video Preview */}
                    {moment.video && !uploadStatus && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Play className="w-5 h-5 text-blue-600" />
                          <span className="text-sm text-blue-800 font-medium">Current Video</span>
                        </div>
                        <video
                          src={moment.video}
                          controls
                          className="w-full max-w-md h-40 object-cover rounded border"
                        />
                      </div>
                    )}
                    
                    {/* Upload Progress */}
                    {uploadStatus && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex items-center gap-3 mb-2">
                          <Clock className="w-5 h-5 text-yellow-600 animate-spin" />
                          <span className="text-sm text-yellow-800 font-medium">
                            Uploading... {uploadStatus.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-yellow-200 rounded-full h-2">
                          <div 
                            className="bg-yellow-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadStatus.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {/* File Upload Input */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 transition-colors">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label className="cursor-pointer">
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {moment.video ? 'Replace Video' : 'Upload Video'}
                            </span>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(e) => handleVideoFileSelect(e, index)}
                              className="hidden"
                              disabled={uploadStatus?.uploading}
                            />
                            <span className="mt-1 block text-sm text-gray-500">
                              MP4, AVI, MOV up to 100MB
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Upload Instructions */}
                    <div className="mt-2 text-xs text-gray-500">
                      <p>• Supported formats: MP4, AVI, MOV, WMV</p>
                      <p>• Maximum file size: 100MB</p>
                      <p>• Recommended resolution: 1080p or higher</p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => handleRemoveRealMoment(index)}
                      className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition"
                    >
                      <X className="w-4 h-4" />
                      Remove Moment
                    </button>
                  </div>
                </div>
              );
            })}
            
            <button
              onClick={handleAddRealMoment}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              Add Real Moment
            </button>
          </div>

          {/* Rooms */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-700">Rooms</h3>
            {editedVilla.rooms?.map((room, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    value={room.name}
                    onChange={(e) => handleRoomChange(e, index)}
                    placeholder="Room name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="floor"
                    value={room.floor}
                    onChange={(e) => handleRoomChange(e, index)}
                    placeholder="Floor"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="guests"
                    value={room.guests}
                    onChange={(e) => handleRoomChange(e, index)}
                    placeholder="Number of guests"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="equipped"
                    value={room.equipped}
                    onChange={(e) => handleRoomChange(e, index)}
                    placeholder="Equipment"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="bathroom"
                    value={room.bathroom}
                    onChange={(e) => handleRoomChange(e, index)}
                    placeholder="Bathroom details"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    name="bedType"
                    value={room.bedType}
                    onChange={(e) => handleRoomChange(e, index)}
                    placeholder="Bed type"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <input
                  type="url"
                  name="image"
                  value={room.image}
                  onChange={(e) => handleRoomChange(e, index)}
                  placeholder="Room image URL"
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handleRemoveRoom(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded mt-2 hover:bg-red-600 transition"
                >
                  Remove Room
                </button>
              </div>
            ))}
            <button
              onClick={handleAddRoom}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            >
              Add Room
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              onClick={closeModal}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveChanges}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};