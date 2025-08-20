import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ExperienceManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPhotos, setSelectedPhotos] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    rating: 5,
    newImages: [],
    deleteImages: [],
  });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get("/v1/reviews/admin/all");
      setReviews(res.data.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`/v1/reviews/admin/edit/${id}`, { approve: true });
      fetchReviews();
      toast.success("Review approved successfully");
    } catch (error) {
      console.error("Approval failed", error);
      toast.error("Approval failed");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`/v1/reviews/admin/delete/${id}`);
        fetchReviews();
        toast.success("Review deleted successfully");
      } catch (error) {
        console.error("Delete failed", error);
        toast.error("Failed to delete review");
      }
    }
  };

  const handleEdit = (review) => {
    setEditMode(review._id);
    setEditData({
      title: review.title || "",
      description: review.description || "",
      rating: review.rating || 5,
      newImages: [],
      deleteImages: [],
    });
  };

  const handleEditSave = async (id) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("description", editData.description);
      formData.append("rating", editData.rating);
      formData.append("approve", true);

      editData.deleteImages.forEach((url) => {
        formData.append("deleteImages[]", url);
      });

      editData.newImages.forEach((img) => {
        if (img instanceof File) {
          formData.append("experienceImages", img);
        }
      });

      await axios.put(`/v1/reviews/admin/edit/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditMode(null);
      setEditData({
        title: "",
        description: "",
        rating: 5,
        newImages: [],
        deleteImages: [],
      });
      fetchReviews();
      toast.success("Review updated successfully");
    } catch (error) {
      console.error("Edit failed", error);
      toast.error("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setEditData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...files],
    }));
  };

  const toggleDeleteImage = (img) => {
    setEditData((prev) => {
      const updated = prev.deleteImages.includes(img)
        ? prev.deleteImages.filter((i) => i !== img)
        : [...prev.deleteImages, img];
      return { ...prev, deleteImages: updated };
    });
  };

  const openModal = (photos, idx) => {
    setSelectedPhotos(photos);
    setSelectedImageIndex(idx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImageIndex(null);
  };

  const filteredReviews = reviews.filter((r) => {
  const villaName = r.villa?.villaName?.toLowerCase() || "";
  const firstName = r.user?.firstName?.toLowerCase() || "";
  const lastName = r.user?.lastName?.toLowerCase() || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const term = searchTerm.toLowerCase().trim();

  return (
    villaName.includes(term) ||
    firstName.includes(term) ||
    lastName.includes(term) ||
    fullName.includes(term)
  );
});



  return (
    <div className="min-h-screen bg-[#f9f9f9] p-6">
      <div className="mb-8 text-center">
  <h1 className="text-2xl md:text-4xl font-extrabold text-green-700 tracking-tight">
    Experience Management
  </h1>
</div>

      <input
        type="text"
        placeholder="Search by villa or user name..."
        className="w-full max-w-md p-2 border border-gray-300 rounded-lg mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-5">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div
              key={review._id}
              className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 transition hover:shadow-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-800">
                  {review.villa?.villaName || "Villa Name"}
                </h2>
                <span className="text-sm text-gray-600">
                  Rating: {review.rating} ⭐
                </span>
              </div>

              {editMode === review._id ? (
                <div className="space-y-2 mb-3">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    placeholder="Title"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    placeholder="Description"
                    className="w-full p-2 border border-gray-300 rounded"
                  ></textarea>
                  <input
                    type="number"
                    value={editData.rating}
                    onChange={(e) =>
                      setEditData({ ...editData, rating: e.target.value })
                    }
                    max="5"
                    min="1"
                    className="w-20 p-2 border border-gray-300 rounded"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="block text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
                  />

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSave(review._id)}
                      disabled={loading}
                      className="px-4 py-1 cursor-pointer rounded-full bg-green-600 text-white hover:bg-green-700 text-sm disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save"}
                    </button>

                    <button
                      onClick={() => {
                        setEditMode(null);
                        setEditData({
                          title: "",
                          description: "",
                          rating: 5,
                          newImages: [],
                          deleteImages: [],
                        });
                      }}
                      className="px-4 py-1 cursor-pointer rounded-full bg-gray-400 text-white hover:bg-gray-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-md font-semibold mb-1 text-gray-700">
                    {review.title}
                  </h3>
                  <p className="text-gray-700 mb-3">{review.description}</p>
                </>
              )}

              {review.experienceImages?.length > 0 && (
                <div className="flex gap-3 overflow-x-auto mb-4">
                  {review.experienceImages.map((photo, idx) => (
                    <img
                      key={idx}
                      src={photo}
                      alt="villa review"
                      onClick={() => {
                        if (editMode === review._id) toggleDeleteImage(photo);
                        else openModal(review.experienceImages, idx);
                      }}
                      className={`h-24 w-32 object-cover rounded-lg border shadow hover:scale-105 transition duration-200 cursor-pointer ${
                        editData.deleteImages.includes(photo)
                          ? "opacity-30 border-2 border-red-500"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* <p className="text-sm text-gray-500 mb-3">
                Submitted by:{" "}
                <span className="font-medium">
                  {review.user?.firstName || "User"}{" "}
                  {review.user?.lastName || ""}
                </span>
              </p> */}

              <p className="text-sm text-gray-500 mb-3">
                Submitted by:{" "}
                <span className="font-medium">
                  {review.user?.firstName
                    ? review.user.firstName.charAt(0).toUpperCase() +
                      review.user.firstName.slice(1).toLowerCase()
                    : "User"}{" "}
                  {review.user?.lastName
                    ? review.user.lastName.charAt(0).toUpperCase() +
                      review.user.lastName.slice(1).toLowerCase()
                    : ""}
                </span>
              </p>

              <div className="flex gap-3 flex-wrap">
                {!review.status || review.status !== "approved" ? (
                  <button
                    onClick={() => handleApprove(review._id)}
                    className="px-4 py-1 cursor-pointer rounded-full bg-green-600 text-white hover:bg-green-700 text-sm"
                  >
                    Approve
                  </button>
                ) : (
                  <span className="text-green-600 text-sm font-semibold">
                    ✅ Approved
                  </span>
                )}

                <button
                  onClick={() => handleEdit(review)}
                  className="px-4 py-1 rounded-full cursor-pointer bg-yellow-500 text-white hover:bg-yellow-600 text-sm"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(review._id)}
                  className="px-4 py-1 cursor-pointer rounded-full bg-red-600 text-white hover:bg-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No reviews found.</p>
        )}
      </div>

      {isModalOpen && selectedImageIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative bg-white rounded-lg p-4 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-red-600 font-bold text-3xl sm:text-4xl"
              onClick={closeModal}
            >
              &times;
            </button>

            <img
              src={selectedPhotos[selectedImageIndex]}
              alt={`full-${selectedImageIndex}`}
              className="w-full max-h-[80vh] object-contain rounded mb-4"
            />

            <div className="flex flex-wrap gap-3 justify-center">
              {selectedPhotos.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`modal-${index}`}
                  className={`w-24 h-24 object-cover rounded cursor-pointer transition-all duration-200 ${
                    index === selectedImageIndex
                      ? "ring-4 ring-blue-400 scale-105"
                      : ""
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceManagement;
