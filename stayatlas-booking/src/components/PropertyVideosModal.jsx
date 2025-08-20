import React, { useEffect } from "react";

export default function PropertyVideosModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const videos = [
    "/videos/villa1video.mp4",
    "/videos/villa2video.mp4",
    "/videos/villa3video.mp4",
    "/videos/villa4video.mp4",
  ];

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[9999] bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center"
    >
      <div className="bg-white w-full h-full overflow-y-auto relative p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-4xl z-10"
        >
          &times;
        </button>
        <h2 className="text-2xl font-semibold mb-6">Property Videos</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
          {videos.map((src, index) => (
            <video
              key={index}
              src={src}
              controls
              className="w-full h-[600px] object-contain rounded-xl shadow-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
