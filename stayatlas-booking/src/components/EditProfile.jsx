import axios from '../utils/axios';
import { X } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'react-toastify';

const EditProfile = ({setNewProfile,newProfile,setUserProfileEdited,user,setOpenEditProfile}) => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/

    const handleEditProfile = async(e) => {
        e.preventDefault();
        if (newProfile.email!=null && !emailRegex.test(newProfile.email)) {
            toast.error("Please enter a valid email address.");
            return;
        }
        if (newProfile.phone!=null && !phoneRegex.test(newProfile.phone)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }
          const payload = Object.fromEntries(
                Object.entries({
                name: newProfile.name,
                email: newProfile.email,
                phone: newProfile.phone,
                }).filter(([_, value]) => value != null && value !== "")
            );

        try{
            const {data} = await axios.post("/v1/users/profile/edit",payload)
            console.log(data)
            toast.success(data.message)
            setOpenEditProfile(false);
            setUserProfileEdited(true)
        }catch(err){
            toast.error("Unable to edit profile!")
        }
    }

    const handleChange = (e) =>{
        e.preventDefault();
        const {name, value} = e.target;
        // console.log(name,value);

        setNewProfile((prev) => ({
            ...prev,
            [name]:value
        }))
    }

  return (
    <div className="fixed inset-0 bg-transparent backdrop-blur-lg bg-opacity-70 flex justify-center items-center pt-20 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        {/* Close button */}
        <button
            onClick={() => setOpenEditProfile(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
            <X size={20} />
        </button>

        <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>
        <form
            onSubmit={handleEditProfile}
            className="space-y-4"
        >
            {/* Full Name */}
            <div>
            <label className="block text-sm font-medium text-gray-700">
                Full Name
            </label>
            <input
                type="text"
                onChange={(e) => handleChange(e)}
                value={newProfile.name}
                name="name"
                className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
            />
            </div>
            {/* Email */}
            {user.email && <div>
                <label className="block text-sm font-medium text-gray-700">
                    Email Address
                </label>
                <input
                    name='email'
                    type="email"
                    value={newProfile.email}
                    onChange={(e) => handleChange(e)}
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>}
            {/* Phone */}
            {user.userPhone && <div>
                <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                </label>
                <input
                    maxLength={10}
                    name='phone'
                    value={newProfile.phone}
                    onChange={(e) => handleChange(e)}
                    type="tel"
                    className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm"
                />
            </div>}

            <button
                type="submit"
             className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700"
            >
                Save Changes
            </button>
        </form>
        </div>
    </div>
    )
}

export default EditProfile