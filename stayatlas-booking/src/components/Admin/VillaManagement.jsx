import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "../../utils/axios.js";
import { Search } from "lucide-react";
import { ReviewModal } from "./ReviewModal.jsx";

const VillaManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const isManage = activeTab === 0;
  const [manageVillasData, setManageVillasData] = useState([]);
  const [viewVillasData, setViewVillasData] = useState([]);
  const [isVillaEdited, setIsVillaEdited] = useState(false);
  const [viewVillaTab, setViewVillaTab] = useState("all");
  const [rejectedVillas, setRejectedVillas] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedVillaId, setSelectedVillaId] = useState(null);

  // Video upload states
  const [videoUploads, setVideoUploads] = useState({});

  const handleDelete = async (villaId) => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const res = await axios.delete(`/v1/admin/villas/${villaId}`, {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      console.log("Delete response:", res);
      toast.success("Villa deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  const openRejectModal = (villaId) => {
    setSelectedVillaId(villaId);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    try {
      const adminToken = localStorage.getItem("adminToken");

      const res = await axios.put(
        `/v1/admin/villas/${selectedVillaId}/reject`,
        { reason: rejectionReason },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      const rejectedVilla = res.data?.data;
      toast.success("Villa rejected successfully");

      setViewVillasData((prev) =>
        prev.filter((v) => v._id !== rejectedVilla._id)
      );
      setFilteredViewVillas((prev) =>
        prev.filter((v) => v._id !== rejectedVilla._id)
      );
      setRejectedVillas((prev) => [...prev, rejectedVilla]);

      setShowRejectModal(false);
      setRejectionReason("");
      setSelectedVillaId(null);
    } catch (error) {
      toast.error("Failed to reject villa");
      console.error("Rejection Error:", error);
    }
  };

  const VillaCard = ({ villa, isManage }) => {
    const [expanded, setExpanded] = useState(false);
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {villa.villaName}
            </h2>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {villa.propertyType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Owner</p>
              <p className="font-medium">{villa?.villaOwner}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Contact</p>
              <p className="font-medium">{villa.email}</p>
              <p className="font-medium">{villa.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rooms</p>
              <p className="font-medium">{villa.numberOfRooms}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Max Guests</p>
              <p className="font-medium">{villa.guestCapacity || (villa.numberOfRooms * 2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Villa Type</p>
              <p className="text-md font-semibold">
                {villa.isExclusive ? "Exclusive" : "Explore"}
              </p>
            </div>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center mb-2"
          >
            {expanded ? "Show less" : "Show more"}
            <svg
              className={`w-4 h-4 ml-1 transition-transform ${
                expanded ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expanded && (
            <div className="mt-4 space-y-4 border-t pt-4">
              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Address
                </p>
                <div className="pl-2 border-l-2 border-gray-200">
                  <p>{villa?.address.street}</p>
                  <p>{villa?.address.landmark}</p>
                  <p>
                    {villa?.address.city}, {villa?.address.state}
                  </p>
                  <p>
                    {villa?.address.country}, {villa?.address.zipcode}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {villa.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">
                  Description
                </p>
                <p className="text-gray-700">{villa.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 font-medium mb-1">Photos</p>
                <div className="grid grid-cols-2 gap-2">
                  {villa.images.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`${villa.villaName} photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>

              {/* Real Moments Video Display */}
             {villa.realMoments && villa.realMoments.length > 0 && (
  <div>
    <p className="text-sm text-gray-500 font-medium mb-1">
      Real Moments
    </p>
    <div className="grid grid-cols-1 gap-3">
      {villa.realMoments.map((moment, index) => (
        <div key={index} className="border rounded-lg p-3">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-800">
              {moment.name}
            </h4>
            <span className="text-xs text-gray-500">
              {moment.date}
            </span>
          </div>
          {moment.video && (
            <video
              src={moment.video} // ✅ use 'video' instead of 'videoUrl'
              controls
              playsInline
              preload="metadata"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </div>
      ))}
    </div>
  </div>
)}

            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 flex gap-3">
          <button
            onClick={() => openReviewModal(villa, villa._id)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {isManage ? "Review" : "Edit"}
          </button>

          {!isManage && (
            <>
              <button
                onClick={() => handleDelete(villa._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>

              <button
                onClick={() => openRejectModal(villa._id)}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
              >
                Reject
              </button>
            </>
          )}

          {isManage && (
            <>
              <button
                onClick={() => handleDelete(villa._id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete
              </button>

              <button
                onClick={() => openRejectModal(villa._id)}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [pendingResponse, approvedResponse] = await Promise.all([
          axios.get("/v1/admin/get-all-pending-villa"),
          axios.get("/v1/admin/get-all-approved-villa"),
        ]);

        if (pendingResponse.data.statusCode == 200) {
          const set = Array.isArray(pendingResponse.data.data.villas)
            ? pendingResponse.data.data.villas
            : [];
          setManageVillasData(set);
          setFilteredManageVillas(set);
        } else {
          toast.error("Error fetching pending villas");
          console.error(
            "Error fetching pending villas:",
            pendingResponse.data.message
          );
        }

        if (approvedResponse.data.statusCode == 200) {
          const set = Array.isArray(approvedResponse.data.data.villas)
            ? approvedResponse.data.data.villas
            : [];
          setViewVillasData(set);
          setFilteredViewVillas(set);
        } else {
          toast.error("Error fetching approved villas");
          console.error(
            "Error fetching approved villas:",
            approvedResponse.data.message
          );
        }
      } catch (err) {
        toast.error("Error fetching villa data");
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, [isVillaEdited]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredManageVillas, setFilteredManageVillas] =
    useState(manageVillasData);
  const [filteredViewVillas, setFilteredViewVillas] = useState(viewVillasData);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (activeTab == 0) {
      const filtered = manageVillasData.filter((villa) =>
        villa.phoneNumber.toLowerCase().includes(query)
      );
      setFilteredManageVillas(filtered);
    } else {
      const filtered = viewVillasData.filter(
        (villa) =>
          villa.phoneNumber.toLowerCase().includes(query) ||
          villa.villaOwner.toLowerCase().includes(query) ||
          villa.villaName.toLowerCase().includes(query)
      );
      setFilteredViewVillas(filtered);
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [editedVilla, setEditedVilla] = useState();

  const openReviewModal = (villa, villaId) => {
    setEditedVilla({
      _id: villaId || "",
      villaOwner: villa.villaOwner || "",
      villaName: villa.villaName || "",
      propertyType: villa.propertyType || "",
      numberOfRooms: villa.numberOfRooms || "",
      guestCapacity: villa.guestCapacity || "" (villa.numberOfRooms ? villa.numberOfRooms * 2 : 0), 
      email: villa.email || "",
      phoneNumber: villa.phoneNumber || "",
      address: {
        street: villa.address?.street || "",
        landmark: villa.address?.landmark || "",
        city: villa.address?.city || "",
        state: villa.address?.state || "",
        country: villa.address?.country || "",
        zipcode: villa.address?.zipcode || "",
      },
      amenities: Array.isArray(villa.amenities) ? villa.amenities : [],
      images: Array.isArray(villa.images) ? villa.images : [],
      category: Array.isArray(villa.category) ? villa.category : [],
      availability: Array.isArray(villa.availability) ? villa.availability : [],
      pricePerNightBoth: {
        weekday: villa.pricePerNightBoth?.weekday || 1,
        weekend: villa.pricePerNightBoth?.weekend || 1,
        setBy: "admin",
        currency: "INR",
      },
      discountPercent: villa.discountPercent || 0,
      promotionText: villa.promotionText || "",
      isExclusive: villa.isExclusive || false,
      approvalStatus: villa.approvalStatus || "approved",
      approvalComment: villa.approvalComment || "",
      realMoments: Array.isArray(villa.realMoments) ? villa.realMoments : [],
      rooms: Array.isArray(villa.rooms) ? villa.rooms : [],
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "isExclusive") {
      setEditedVilla((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
      return;
    } else if (name === "weekdayPrice" || name === "weekendPrice") {
      const sanitizedValue = value.replace(/[^0-9]/g, "");
      setEditedVilla((prev) => ({
        ...prev,
        pricePerNightBoth: {
          ...prev.pricePerNightBoth,
          [name === "weekdayPrice" ? "weekday" : "weekend"]: Number(
            sanitizedValue || 0
          ),
        },
      }));
    } else if (name === "guestCapacity") {
      setEditedVilla((prev) => ({
        ...prev,
        [name]: Number(value) || 0,
      }));
    } else {
      setEditedVilla((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setEditedVilla((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleAmenityChange = (index, value) => {
    const updatedAmenities = [...editedVilla.amenities];
    updatedAmenities[index] = value;
    setEditedVilla((prev) => ({
      ...prev,
      amenities: updatedAmenities,
    }));
  };

  const handleAddAmenity = () => {
    setEditedVilla((prev) => ({
      ...prev,
      amenities: [...prev.amenities, ""],
    }));
  };

  const handleRemoveAmenity = (index) => {
    const updatedAmenities = [...editedVilla.amenities];
    updatedAmenities.splice(index, 1);
    setEditedVilla((prev) => ({
      ...prev,
      amenities: updatedAmenities,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...editedVilla.images];
    updatedImages[index] = value;
    setEditedVilla((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleAddImage = () => {
    setEditedVilla((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleRemoveImage = (index) => {
    const updatedImages = editedVilla.images.filter((_, i) => i !== index);
    setEditedVilla((prev) => ({
      ...prev,
      images: updatedImages,
    }));
  };

  const handleRoomChange = (e, index) => {
    const updatedRooms = [...editedVilla.rooms];
    updatedRooms[index][e.target.name] = e.target.value;
    setEditedVilla((prev) => ({
      ...prev,
      rooms: updatedRooms,
    }));
  };

  const handleAddRoom = () => {
    const newRoom = {
      name: "",
      floor: "",
      guests: "",
      equipped: "",
      bathroom: "",
      image: "",
      bedType: "",
    };
    setEditedVilla((prev) => ({
      ...prev,
      rooms: [...(prev.rooms || []), newRoom],
    }));
  };

  const handleRemoveRoom = (index) => {
    const updatedRooms = editedVilla.rooms.filter((_, i) => i !== index);
    setEditedVilla((prev) => ({
      ...prev,
      rooms: updatedRooms,
    }));
  };

  // REAL MOMENTS - Updated for direct video file upload
const handleVideoChange = (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size
    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file");
      return;
    }
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("Video file must be less than 100MB");
      return;
    }

    // Upload the file
    handleVideoUpload(file, index);
  };

  const handleVideoUpload = async (file, index) => {
    const uploadKey = `${editedVilla._id}-${index}`;
    const adminToken = localStorage.getItem("adminToken");

    try {
      // Set uploading state
      setVideoUploads((prev) => ({
        ...prev,
        [uploadKey]: { uploading: true, progress: 0 },
      }));

      const formData = new FormData();
      formData.append("video", file);
      formData.append("villaId", editedVilla._id);
      formData.append("momentIndex", index.toString());

      const response = await axios.post("/v1/admin/upload-real-moment-video", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminToken}`,
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setVideoUploads((prev) => ({
            ...prev,
            [uploadKey]: { uploading: true, progress },
          }));
        },
      });

      const uploadedUrl = response.data.videoUrl || response.data.url;
      if (!uploadedUrl) throw new Error(response.data.message || "Upload failed");

      // Update villa state
      const updatedMoments = [...editedVilla.realMoments];
      updatedMoments[index] = {
        ...updatedMoments[index],
        video: uploadedUrl,
      };

      setEditedVilla((prev) => ({
        ...prev,
        realMoments: updatedMoments,
      }));

      toast.success(response.data.message || "Video uploaded successfully");
    } catch (error) {
      console.error("Video upload error:", error);
      toast.error(error.message || "Failed to upload video");
    } finally {
      // Clear uploading state
      setVideoUploads((prev) => {
        const newState = { ...prev };
        delete newState[uploadKey];
        return newState;
      });
    }
  };

  const handleAddRealMoment = () => {
    const newMoment = { video: "", name: "", date: "" };
    setEditedVilla((prev) => ({
      ...prev,
      realMoments: [...(prev.realMoments || []), newMoment],
    }));
  };

  const handleRemoveRealMoment = (index) => {
    const updated = editedVilla.realMoments.filter((_, i) => i !== index);
    setEditedVilla((prev) => ({
      ...prev,
      realMoments: updated,
    }));
  };

  const saveChanges = async () => {
    try {
      // Validate and sanitize data
      editedVilla.numberOfRooms = String(editedVilla.numberOfRooms);
      editedVilla.discountPercent = Number(editedVilla.discountPercent || 0);
      editedVilla.pricePerNightBoth.weekday = Number(
        editedVilla.pricePerNightBoth.weekday || 1
      );
      editedVilla.pricePerNightBoth.weekend = Number(
        editedVilla.pricePerNightBoth.weekend || 1
      );
      editedVilla.address.street = String(editedVilla.address.street || "");
      editedVilla.address.landmark = String(editedVilla.address.landmark || "");
      editedVilla.address.city = String(editedVilla.address.city || "");
      editedVilla.address.state = String(editedVilla.address.state || "");
      editedVilla.address.country = String(editedVilla.address.country || "");
      editedVilla.address.zipcode = String(editedVilla.address.zipcode || "");
      editedVilla.images = editedVilla.images.map(String);
      editedVilla.amenities = editedVilla.amenities.map(String);
      editedVilla.propertyType = String(editedVilla.propertyType);
      editedVilla.category = editedVilla.category.map(String);
      editedVilla.isExclusive =
        editedVilla.isExclusive === true ||
        editedVilla.isExclusive === "true" ||
        editedVilla.isExclusive === 1;

      editedVilla.rooms = Array.isArray(editedVilla.rooms)
        ? editedVilla.rooms.map((room) => ({
            name: String(room.name || ""),
            floor: String(room.floor || ""),
            guests: String(room.guests || ""),
            equipped: String(room.equipped || ""),
            bathroom: String(room.bathroom || ""),
            image: String(room.image || ""),
            bedType: String(room.bedType || ""),
          }))
        : [];

      editedVilla.realMoments = Array.isArray(editedVilla.realMoments)
        ? editedVilla.realMoments.map((moment) => ({
            video: String(moment.video || ""),
            name: String(moment.name || ""),
            date: String(moment.date || ""),
          }))
        : [];

      if (isManage) {
        editedVilla.approvalStatus = "pending";
      }

      editedVilla.approvalStatus = String(editedVilla.approvalStatus);
      const isPending = editedVilla.approvalStatus === "pending";

      const endpoint = isPending
        ? `/v1/admin/approve-pending-villa/${editedVilla._id}`
        : `/v1/admin/edit-villaById/${editedVilla._id}`;

      const response = await axios.post(endpoint, editedVilla);

      if (response.data.statusCode === 200) {
        toast.success(isPending ? "Villa approved" : "Villa updated");

        if (isPending) {
          setManageVillasData((prev) =>
            prev.filter((v) => v._id !== editedVilla._id)
          );
          setFilteredManageVillas((prev) =>
            prev.filter((v) => v._id !== editedVilla._id)
          );
          setViewVillasData((prev) => [...prev, response.data.data]);
          setFilteredViewVillas((prev) => [...prev, response.data.data]);
        } else {
          setViewVillasData((prev) =>
            prev.map((v) =>
              v._id === editedVilla._id ? response.data.data : v
            )
          );
          setFilteredViewVillas((prev) =>
            prev.map((v) =>
              v._id === editedVilla._id ? response.data.data : v
            )
          );
        }

        setIsVillaEdited(true);
      } else {
        toast.error("Failed to save changes");
      }

      setModalOpen(false);
    } catch (err) {
      toast.error("Error saving changes");
      console.error("Save error:", err);
    }

    setIsVillaEdited(true);
    setModalOpen(false);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const fetchRejectedVillas = async () => {
      try {
        const res = await axios.get("/v1/admin/get-all-rejected-villa");
        const villas = res.data?.data?.villas || [];
        setRejectedVillas(villas);
      } catch (err) {
        console.error("Failed to fetch rejected villas:", err);
      }
    };

    fetchRejectedVillas();
  }, []);

  useEffect(() => {
    if (viewVillaTab === "rejected") {
      setFilteredViewVillas(rejectedVillas);
    } else {
      setFilteredViewVillas(viewVillasData);
    }
  }, [viewVillaTab, viewVillasData, rejectedVillas]);

  const allCount = viewVillasData.length;
  const exclusiveCount = viewVillasData.filter((v) => v.isExclusive).length;
  const exploreCount = viewVillasData.filter(
    (v) => !v.isExclusive && v.approvalStatus === "approved"
  ).length;
  const rejectedCount = rejectedVillas.length;

  const tabTypes = [
    { key: "all", label: "All", count: allCount },
    { key: "exclusive", label: "Exclusive", count: exclusiveCount },
    { key: "explore", label: "Explore", count: exploreCount },
    { key: "rejected", label: "Rejected", count: rejectedCount },
  ];

  return (
    <div className="w-full overflow-hidden min-h-screen bg-gray-100 p-4">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 tracking-tight">
          Villa Management
        </h1>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setActiveTab(0)}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === 0
                ? "bg-blue-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            Manage Villas
          </button>
          <button
            onClick={() => setActiveTab(1)}
            className={`px-4 py-2 rounded-md transition ${
              activeTab === 1
                ? "bg-blue-600 text-white"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          >
            View Villas
          </button>
        </div>
        <div className="flex items-center border border-gray-400 rounded-md px-2 w-1/3 focus-within:border-blue-500 focus-within:border-2">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search by villa name, mobile number or owner name"
            value={searchQuery}
            onChange={handleSearch}
            className="py-2 outline-none w-full"
          />
        </div>
      </div>

      <div className="relative w-full">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${activeTab * 100}%)` }}
        >
          {/* Manage Villas Tab */}
          {manageVillasData.length === 0 && activeTab === 0 ? (
            <div className="flex items-center justify-center min-h-screen bg-gray-100 min-w-full">
              <p className="text-lg text-gray-500">
                No pending villas to manage.
              </p>
            </div>
          ) : (
            <div className="min-w-full grid gap-6">
              {filteredManageVillas.map((villa) => (
                <VillaCard key={villa._id} villa={villa} isManage={true} />
              ))}
            </div>
          )}

          {/* View Villas Tab */}
          {activeTab === 1 && (
            <div className="min-w-full flex flex-col gap-6">
              {/* Sub-tabs */}
              <div className="flex justify-center gap-4 mb-4 flex-wrap">
                {tabTypes.map(({ key, label, count }) => (
                  <button
                    key={key}
                    onClick={() => setViewVillaTab(key)}
                    className={`px-4 py-2 rounded-md transition capitalize ${
                      viewVillaTab === key
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  >
                    {label} ({count})
                  </button>
                ))}
              </div>

              {/* Sub-tab content */}
              <div className="min-w-full grid gap-6">
                {viewVillaTab === "all" &&
                  (filteredViewVillas.length > 0 ? (
                    filteredViewVillas.map((villa) => (
                      <VillaCard
                        key={villa._id}
                        villa={villa}
                        isManage={false}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No villas to show.</p>
                  ))}

                {viewVillaTab === "exclusive" &&
                  (filteredViewVillas.filter((v) => v.isExclusive).length >
                  0 ? (
                    filteredViewVillas
                      .filter((v) => v.isExclusive)
                      .map((villa) => (
                        <VillaCard
                          key={villa._id}
                          villa={villa}
                          isManage={false}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500">No exclusive villas.</p>
                  ))}

                {viewVillaTab === "explore" &&
                  (filteredViewVillas.filter((v) => !v.isExclusive).length >
                  0 ? (
                    filteredViewVillas
                      .filter((v) => !v.isExclusive)
                      .map((villa) => (
                        <VillaCard
                          key={villa._id}
                          villa={villa}
                          isManage={false}
                        />
                      ))
                  ) : (
                    <p className="text-gray-500">No explore villas.</p>
                  ))}

                {viewVillaTab === "rejected" &&
                  (filteredViewVillas.length > 0 ? (
                    filteredViewVillas.map((villa) => (
                      <VillaCard
                        key={villa._id}
                        villa={villa}
                        isManage={false}
                      />
                    ))
                  ) : (
                    <p className="text-gray-500">No rejected villas.</p>
                  ))}
              </div>
            </div>
          )}
        </div>

        {showRejectModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-xl w-[400px]">
              <h2 className="text-xl font-bold mb-4">Reject Villa</h2>
              <textarea
                className="w-full border border-gray-300 p-2 rounded"
                rows="4"
                placeholder="Enter reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
              <div className="flex justify-end mt-4 gap-2">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ReviewModal
        modalOpen={modalOpen}
        editedVilla={editedVilla}
        closeModal={closeModal}
        handleInputChange={handleInputChange}
        handleAddressChange={handleAddressChange}
        handleAmenityChange={handleAmenityChange}
        handleAddAmenity={handleAddAmenity}
        handleRemoveAmenity={handleRemoveAmenity}
        saveChanges={saveChanges}
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        handleRoomChange={handleRoomChange}
        handleAddRoom={handleAddRoom}
        handleRemoveRoom={handleRemoveRoom}
        handleRealMomentChange={handleVideoChange}
        handleAddRealMoment={handleAddRealMoment}
        handleRemoveRealMoment={handleRemoveRealMoment}
        // NEW: Pass video upload functions
        handleVideoUpload={handleVideoUpload}
        videoUploads={videoUploads}
      />
    </div>
  );
};

export default VillaManagement;
