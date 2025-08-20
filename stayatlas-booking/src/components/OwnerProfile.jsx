import { useEffect, useState } from 'react';
import { User, Home, Phone, Mail, Calendar, MapPin, Settings, ChevronDown, ChevronUp, Menu, X, Edit, Trash, Plus, Users, FileText, Star, DollarSign, Clock, AlertTriangle, Loader, Eye, EyeClosed } from 'lucide-react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import EditProfile from './EditProfile';


export default function VillaOwnerProfile() {
    const user = useSelector((state)=>state.auth)    
     const [activeTab, setActiveTab] = useState('dashboard');
    const [expandedVilla, setExpandedVilla] = useState(null);
    const [propertyStatus, setPropertyStatus] = useState('all');
    const [villas, setVillas] = useState(null)
    const [villaBookings, setVillaBookings] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [openEditProfile, setOpenEditProfile] = useState(false);
    const [ownerProfileEdited, setOwnerProfileEdited] = useState(false);

    const [newProfile, setNewProfile] = useState({
        name: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(), 
        email: user?.email || '',
        phone: user?.phoneNumber || '' 
    });
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [resetPassword, setResetPassword] = useState({
        currentPassword: "",
        newPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(()=>{
        async function fetchData() {
            setIsLoading(true)
            try{
                const [villas, bookings] = await Promise.all([
                    axios.get('/v1/villas/my-villas'),
                    axios.get('/v1/bookings/villaowner')
                ])
                if(villas.data.statusCode === 200){
                    setVillas(villas.data.data)
                }else{
                    toast.error("Error in fetching villas")
                }

                if(bookings.data.statusCode === 200){
                    setVillaBookings(bookings.data.data)
                }else{
                    toast.error("Error in fetching bookings")
                }
                
                
            }catch(err){
                console.log("Error:",err)
                toast.error("Error in fetching villa owner, Please try again later!")
            }
            setIsLoading(false)
        }
        fetchData()
    },[])



    

    const toggleVillaDetails = (villaId) => {
        if (expandedVilla === villaId) {
            setExpandedVilla(null);
        } else {
            setExpandedVilla(villaId);
        }
    };

    const handleChangePassword = (e) => {
        const { name, value } = e.target;
        setResetPassword((prev) => ({ ...prev, [name]: value }));
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            if (!resetPassword.currentPassword || !resetPassword.newPassword) {
                toast.error("Please fill in both fields.");
                return;
            }
            if (resetPassword.currentPassword === resetPassword.newPassword) {
                toast.error("New password cannot be the same as current password.");
                return;
            }
            if (resetPassword.newPassword.length < 5) {
                toast.error("New password must be at least 5 characters long.");
                return;
            }
            const response = await axios.post("/v1/users/changePassword", {
                oldPassword: resetPassword.currentPassword,
                newPassword: resetPassword.newPassword,
            });
            toast.success("Password changed successfully");
            setShowChangePassword(false);
            setResetPassword({ currentPassword: "", newPassword: "" });
        } catch (error) {
            toast.error("Failed to change password. Please try again.");
        }
    };

    if(isLoading){
        return <div className="h-screen text-2xl flex justify-center items-center text-red-800">
           <Loader className='animate-spin'/>
        </div>
    }

    // Check if villas is null or empty before accessing .length
    if(!villas || villas.length === 0){
        return  <div className="h-screen text-2xl flex justify-center items-center text-red-800">
            No villa to fetch!
        </div>
    }

    const totalVillas = villas.length;
    const activeVillas = villas.filter(villa => villa.approvalStatus === 'approved').length;
    const pendingVillas = villas.filter(villa => villa.approvalStatus === 'pending').length;
    const rejectedVillas = villas.filter(villa => villa.approvalStatus === 'rejected').length;
    // Safely access villaBookings length
    const totalBookings = villaBookings?.length || 0;
    const upcomingBookings = villaBookings?.reduce((acc, villa) => acc + (villa.upcomingBookings || 0), 0) || 0;

    const filteredVillas = propertyStatus === 'all'
        ? villas
        : villas.filter(villa => villa.approvalStatus.toLowerCase() === propertyStatus);


    return (
        <div className="bg-gray-50 min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/4">
                        <div className="bg-white rounded-lg shadow p-6 mb-6">
                            <div className="flex flex-col items-center">
                                {/* Safely access user properties for image src */}
                                <img
                                    src={`https://api.dicebear.com/5.x/initials/svg/seed=${user?.firstName || 'User'}`}
                                    alt={user?.firstName || 'User'}
                                    className="w-32 h-32 rounded-full object-cover mb-4"
                                />
                                {/* Safely access user properties for display */}
                                <h2 className="text-xl font-bold">{`${user?.firstName?.charAt(0)?.toUpperCase() + user?.firstName?.slice(1) || ''} ${user?.lastName ? user?.lastName.charAt(0)?.toUpperCase() + user?.lastName?.slice(1) : ''}`}</h2>
                                {user?.email && <p className="text-gray-600">{user.email}</p>}
                                <span className="mt-2 px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Verified
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div
                                className={`flex items-center p-4 cursor-pointer ${activeTab === 'dashboard' ? 'bg-teal-50 border-l-4 border-teal-600' : ''}`}
                                onClick={() => setActiveTab('dashboard')}
                            >
                                <Home className="text-teal-600 mr-3" size={20} />
                                <span className={activeTab === 'dashboard' ? 'font-medium text-teal-600' : 'text-gray-700'}>
                                    Dashboard
                                </span>
                            </div>

                            <div
                                className={`flex items-center p-4 cursor-pointer ${activeTab === 'properties' ? 'bg-teal-50 border-l-4 border-teal-600' : ''}`}
                                onClick={() => setActiveTab('properties')}
                            >
                                <Home className="text-teal-600 mr-3" size={20} />
                                <span className={activeTab === 'properties' ? 'font-medium text-teal-600' : 'text-gray-700'}>
                                    My Properties
                                </span>
                            </div>

                            <div
                                className={`flex items-center p-4 cursor-pointer ${activeTab === 'bookings' ? 'bg-teal-50 border-l-4 border-teal-600' : ''}`}
                                onClick={() => setActiveTab('bookings')}
                            >
                                <Calendar className="text-teal-600 mr-3" size={20} />
                                <span className={activeTab === 'bookings' ? 'font-medium text-teal-600' : 'text-gray-700'}>
                                    Bookings
                                </span>
                            </div>

                            <div
                                className={`flex items-center p-4 cursor-pointer ${activeTab === 'profile' ? 'bg-teal-50 border-l-4 border-teal-600' : ''}`}
                                onClick={() => setActiveTab('profile')}
                            >
                                <User className="text-teal-600 mr-3" size={20} />
                                <span className={activeTab === 'profile' ? 'font-medium text-teal-600' : 'text-gray-700'}>
                                    Profile
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-3/4">
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-xl font-bold mb-6">Dashboard</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-blue-700 font-medium">Total Properties</h4>
                                                <Home className="text-blue-500" size={20} />
                                            </div>
                                            <p className="text-2xl font-bold text-blue-800">{villas.length}</p>
                                            <p className="text-sm text-blue-600">{activeVillas} active listings</p>
                                        </div>

                                        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-purple-700 font-medium">Pending Review</h4>
                                                <Clock className="text-purple-500" size={20} />
                                            </div>
                                            <p className="text-2xl font-bold text-purple-800">{pendingVillas}</p>
                                            <p className="text-sm text-purple-600">Awaiting approval</p>
                                        </div>

                                        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="text-green-700 font-medium">Total Bookings</h4>
                                                <Calendar className="text-green-500" size={20} />
                                            </div>
                                            <p className="text-2xl font-bold text-green-800">{totalBookings}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'properties' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                        <h3 className="text-xl font-bold">My Properties</h3>
                                        <button onClick={() => navigate("/list")} className="cursor-pointer mt-4 md:mt-0 flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
                                            <Plus size={18} className="mr-2" />
                                            Add New Property
                                        </button>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <button
                                            onClick={() => setPropertyStatus('all')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${propertyStatus === 'all' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            All ({totalVillas})
                                        </button>
                                        <button
                                            onClick={() => setPropertyStatus('approved')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${propertyStatus === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            Approved ({activeVillas})
                                        </button>
                                        <button
                                            onClick={() => setPropertyStatus('pending')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${propertyStatus === 'pending' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            Pending Review ({pendingVillas})
                                        </button>
                                        <button
                                            onClick={() => setPropertyStatus('rejected')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium ${propertyStatus === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                        >
                                            Rejected ({rejectedVillas})
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        {console.log(filteredVillas)}
                                        {filteredVillas.map((villa) => (
                                            <div key={villa._id} className={`border rounded-lg overflow-hidden bg-white ${villa.approvalStatus === 'pending' ? 'border-l-4 border-l-purple-500' :
                                                villa.approvalStatus === 'rejected' ? 'border-l-4 border-l-red-500' :
                                                    'border-l-4 border-l-green-500'
                                                }`}>
                                                <div className="p-6">
                                                    <div className="flex flex-col md:flex-row">
                                                        <div className="md:w-1/3 mb-4 md:mb-0">
                                                            <img
                                                                src={villa.images[0]}
                                                                alt={villa.villaName}
                                                                className="w-full h-48 object-cover rounded-lg"
                                                            />
                                                        </div>

                                                        <div className="md:w-2/3 md:pl-6">
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                                                                <h4 className="text-lg font-bold mb-2 md:mb-0">{villa.villaName}</h4>
                                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                                                                        ${villa.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' :
                                                                        villa.approvalStatus === 'pending' ? 'bg-purple-100 text-purple-800' :
                                                                            'bg-red-100 text-red-800'}`}>
                                                                    {villa.approvalStatus.charAt(0).toUpperCase() + villa.approvalStatus.slice(1)}
                                                                </span>
                                                            </div>

                                                            <div className="mb-3">
                                                                <div className="flex items-start mb-1">
                                                                    <MapPin className="text-gray-500 mr-2 mt-1" size={16} />
                                                                    <p className="text-gray-700">
                                                                        {villa.address.street}, {villa.address.landmark}, {villa.address.city}, {villa.address.state}
                                                                    </p>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <Home className="text-gray-500 mr-2" size={16} />
                                                                    <p className="text-gray-700">
                                                                        {villa.propertyType.charAt(0).toUpperCase() + villa.propertyType.slice(1)} • {villa.numberOfRooms} Rooms • Max {villa.numberOfRooms*2} Guests
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {villa.amenities.slice(0, 3).map((amenity, index) => (
                                                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                                                        {amenity}
                                                                    </span>
                                                                ))}
                                                                {villa.amenities.length > 3 && (
                                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                                                        +{villa.amenities.length - 3} more
                                                                    </span>
                                                                )}
                                                            </div>

                                                            {villa.approvalStatus === 'approved' && (
                                                                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                                                                    <div className="text-center p-2 bg-gray-50 rounded">
                                                                        <p className="text-sm text-gray-600">Price/Night</p>
                                                                        <p className="font-medium">{villa.pricePerNight}</p>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {villa.approvalStatus === 'pending' && (
                                                                <div className="mt-4 p-3 bg-purple-50 rounded-lg border border-purple-100">
                                                                    <div className="flex items-start">
                                                                        <Clock className="text-purple-500 mr-2 mt-1" size={18} />
                                                                        <div>
                                                                            <p className="font-medium text-purple-700">Awaiting Admin Review</p>
                                                                            <p className="text-sm text-purple-600">Submitted on: {villa.submittedDate}</p>
                                                                            <p className="text-sm text-gray-600 mt-1">{villa.adminFeedback}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {villa.approvalStatus === 'rejected' && (
                                                                <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                                                    <div className="flex items-start">
                                                                        <AlertTriangle className="text-red-500 mr-2 mt-1" size={18} />
                                                                        <div>
                                                                            <p className="font-medium text-red-700">Property Rejected</p>
                                                                            <p className="text-sm text-red-600">Rejected on: {villa.rejectionDate}</p>
                                                                            <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Feedback:</span> {villa.adminFeedback}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                                                        <div className="flex space-x-3">
                                                        </div>

                                                        <button
                                                            className="flex items-center text-teal-600 hover:text-teal-800"
                                                            onClick={() => toggleVillaDetails(villa._id)}
                                                        >
                                                            {expandedVilla === villa._id ? (
                                                                <>Less Details <ChevronUp size={18} className="ml-1" /></>
                                                            ) : (
                                                                <>More Details <ChevronDown size={18} className="ml-1" /></>
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {expandedVilla === villa._id && (
                                                    <div className="bg-gray-50 p-6 border-t">
                                                        {villa.status === 'Active' && villa.recentBookings && villa.recentBookings.length > 0 && (
                                                            <>
                                                                <h5 className="font-medium mb-4">Recent Bookings</h5>
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full divide-y divide-gray-200">
                                                                        <thead className="bg-gray-100">
                                                                            <tr>
                                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                                                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="bg-white divide-y divide-gray-200">
                                                                            {villa.recentBookings.map((booking, index) => (
                                                                                <tr key={index}>
                                                                                    <td className="px-4 py-3 text-sm text-gray-900">{booking.guestName}</td>
                                                                                    <td className="px-4 py-3 text-sm text-gray-900">{booking.checkIn} to {booking.checkOut}</td>
                                                                                    <td className="px-4 py-3 text-sm text-gray-900">{booking.guests}</td>
                                                                                    <td className="px-4 py-3 text-sm text-gray-900">{booking.amount}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className={villa.recentBookings && villa.recentBookings.length > 0 ? "mt-6" : ""}>
                                                            <h5 className="font-medium mb-3">Property Description</h5>
                                                            <p className="text-gray-700">{villa.description}</p>
                                                        </div>

                                                        <div className="mt-6">
                                                            <h5 className="font-medium mb-3">All Amenities</h5>
                                                            <div className="flex flex-wrap gap-2">
                                                                {villa.amenities.map((amenity, index) => (
                                                                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                                                        {amenity}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {villa.approvalStatus === 'rejected' && ( // Corrected from villa.status
                                                            <div className="mt-6">
                                                                <h5 className="font-medium mb-3 text-red-700">Admin Feedback Details</h5>
                                                                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                                                    <p className="text-gray-700">{villa.adminFeedback}</p>
                                                                    <div className="mt-4">
                                                                        <h6 className="font-medium text-gray-700">Required Actions:</h6>
                                                                        <ul className="list-disc pl-5 mt-2 text-gray-700">
                                                                            <li>Update bathroom facilities to meet luxury standards</li>
                                                                            <li>Arrange for professional photography</li>
                                                                            <li>Review pricing strategy</li>
                                                                        </ul>
                                                                    </div>
                                                                    <button className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700">
                                                                        Resubmit with Changes
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold mb-6 pb-2 border-b flex items-center justify-between">
                                    Owner Information
                                    <button
                                        onClick={() => setOpenEditProfile(true)}
                                        className="flex items-center bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 text-sm font-semibold"
                                    >
                                        <Edit size={16} className="mr-2" /> Edit Profile
                                    </button>
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                            <div className="flex items-center">
                                                <User className="text-gray-500 mr-2" size={18} />
                                                {/* Safely access user properties */}
                                                <p className="text-gray-900">{`${user?.firstName?.charAt(0)?.toUpperCase() + user?.firstName?.slice(1) || ''} ${user?.lastName ? user?.lastName.charAt(0)?.toUpperCase() + user?.lastName?.slice(1) : ''}`}</p>
                                            </div>
                                        </div>
                                        {user?.email && <div> {/* Safely check user.email */}
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <div className="flex items-center">
                                                <Mail className="text-gray-500 mr-2" size={18} />
                                                <p className="text-gray-900">{user.email}</p>
                                            </div>
                                        </div>}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <div className="flex items-center">
                                                <Phone className="text-gray-500 mr-2" size={18} />
                                                <p className="text-gray-900">{user?.phoneNumber || 'N/A'}</p> {/* Safely access and provide default */}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                                            {/* Only show change password if authProvider is 'local' or not googleId */}
                                            {user?.authProvider === 'local' && !showChangePassword && (
                                                <button
                                                    onClick={() => setShowChangePassword(true)}
                                                    className="border border-gray-300 rounded px-4 py-2 text-sm font-medium hover:bg-gray-100"
                                                >
                                                    Change
                                                </button>
                                            )}
                                            {user?.authProvider === 'local' && showChangePassword && ( // Only show form if authProvider is 'local'
                                                <form onSubmit={handleResetPassword} className="space-y-2">
                                                    <div className="w-full relative">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                                                            placeholder="Current Password"
                                                            value={resetPassword.currentPassword}
                                                            name="currentPassword"
                                                            onChange={handleChangePassword}
                                                        />
                                                        <div
                                                            className="absolute right-3 top-2 cursor-pointer"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <Eye /> : <EyeClosed />}
                                                        </div>
                                                    </div>
                                                    <div className="relative w-full">
                                                        <input
                                                            type={showPassword ? "text" : "password"}
                                                            className="w-full p-2 pr-10 border border-gray-300 rounded-md"
                                                            placeholder="New Password"
                                                            value={resetPassword.newPassword}
                                                            name="newPassword"
                                                            onChange={handleChangePassword}
                                                        />
                                                        <div
                                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                                                            onClick={() => setShowPassword(!showPassword)}
                                                        >
                                                            {showPassword ? <Eye /> : <EyeClosed />}
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="submit"
                                                        className="w-full bg-gray-800 text-white py-2 rounded-md hover:bg-gray-700"
                                                    >
                                                        Change
                                                    </button>
                                                </form>
                                            )}
                                            {user?.authProvider === 'google' && ( // Display message for Google users
                                                <p className="text-sm text-gray-500 mt-2">
                                                    Password managed by Google.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {openEditProfile && (
                                    <EditProfile
                                        setNewProfile={setNewProfile}
                                        newProfile={newProfile}
                                        setUserProfileEdited={setOwnerProfileEdited}
                                        setOpenEditProfile={setOpenEditProfile}
                                        user={user}
                                    />
                                )}
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-xl font-bold mb-6">Bookings</h3>

                                {!villaBookings?.length === 0 ? <div className='flex justify-center items-center text-gray-400'>No Bookings Found</div> :  <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {
                                                villaBookings?.map((booking, index) => (
                                                    <tr key={`${booking._id}-${index}`}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{booking.villa.villaName}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{`${booking.user?.firstName?.charAt(0)?.toUpperCase() + booking.user?.firstName?.slice(1) || ''} ${booking.user?.lastName?.charAt(0)?.toUpperCase() + booking.user?.lastName?.slice(1) || ''}`}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{new Date(booking.checkOut).toLocaleDateString()}</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{booking.guests.adults + booking.guests.children + booking.guests.pets }</td>
                                                        <td className="px-4 py-3 text-sm text-gray-900">{booking.totalAmount.$numberDecimal}</td>
                                                        <td className="px-4 py-3 text-sm">
                                                            <span className={`px-2 py-1 text-xs rounded-full  ${booking.status === "Confirmed" ? "text-green-800 bg-green-100" : booking.status === "Cancelled" ? "text-white bg-red-600" : booking.status === "Pending"  ?  "text-gray-500 bg-gray-300 ": "bg-blue-400"}`}>
                                                                {booking.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                </div>}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
