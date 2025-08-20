import React, { useState } from 'react';

const EditModal = ({ hotelData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ...hotelData,
    imagePreview: hotelData.image, // for previewing existing or new image
    imageFile: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: ['price', 'beds', 'baths', 'guests', 'rating'].includes(name)
        ? Number(value)
        : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // If you need to send this via API, create FormData
    const updatedData = {
      ...formData,
      image: formData.imageFile || formData.imagePreview,
    };

    onSave(updatedData);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white p-8 rounded-lg w-[400px] shadow-lg'>

        <div className='flex justify-end'>
          <button
            onClick={onClose}
            className='text-gray-700 text-xl font-bold hover:text-red-500'
          >
            ×
          </button>
        </div>

        <h2 className='text-xl font-semibold mb-4'>Edit Hotel Details</h2>

        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium'>Name</label>
            <input
              type='text'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='input'
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Location</label>
            <input
              type='text'
              name='location'
              value={formData.location}
              onChange={handleChange}
              className='input'
            />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium'>Beds</label>
              <input
                type='number'
                name='beds'
                value={formData.beds}
                onChange={handleChange}
                className='input'
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>Baths</label>
              <input
                type='number'
                name='baths'
                value={formData.baths}
                onChange={handleChange}
                className='input'
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>Guests</label>
              <input
                type='number'
                name='guests'
                value={formData.guests}
                onChange={handleChange}
                className='input'
              />
            </div>
            <div>
              <label className='block text-sm font-medium'>Price</label>
              <input
                type='number'
                name='price'
                value={formData.price}
                onChange={handleChange}
                className='input'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium'>Rating</label>
            <input
              type='number'
              step='0.1'
              name='rating'
              value={formData.rating}
              onChange={handleChange}
              className='input'
            />
          </div>

          <div>
            <label className='block text-sm font-medium'>Upload Image</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageChange}
              className='input'
            />
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt='Preview'
                className='mt-2 w-full h-40 object-cover rounded'
              />
            )}
          </div>

          <button
            type='submit'
            className='bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition'
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditModal;