import { useState, useEffect } from "react";
import {
  FaImage,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

export default function Gallery({ photos = [] }) {
  const normalizedPhotos = photos.map((photo) =>
    typeof photo === "string" ? { src: photo, caption: "" } : photo
  );

  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openListModal = () => setIsListModalOpen(true);
  const closeListModal = () => setIsListModalOpen(false);

  const openImageViewer = (index) => {
    setCurrentIndex(index);
    setIsImageViewerOpen(true);
  };
  const closeImageViewer = () => setIsImageViewerOpen(false);

  const showNext = () =>
    setCurrentIndex((prev) => (prev + 1) % normalizedPhotos.length);
  const showPrev = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? normalizedPhotos.length - 1 : prev - 1
    );

  const previewCount = Math.min(normalizedPhotos.length, 3);
  const previewPhotos = normalizedPhotos.slice(0, previewCount);
  const remainingCount = normalizedPhotos.length - 3;

  let containerClasses = "";
  if (previewCount === 1) {
    containerClasses = "w-full max-w-3xl mx-auto";
  } else if (previewCount === 2) {
    containerClasses =
      "flex flex-col md:flex-row gap-2.5 w-full max-w-4xl mx-auto";
  } else if (previewCount === 3) {
    containerClasses =
      "grid grid-cols-1 gap-2.5 w-full max-w-5xl mx-auto md:grid-cols-[2fr_1fr] md:grid-rows-2 md:max-h-[600px]";
  }

  useEffect(() => {
    if (isListModalOpen || isImageViewerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isListModalOpen, isImageViewerOpen]);

  useEffect(() => {
    if (!isImageViewerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        showPrev();
      } else if (e.key === "ArrowRight") {
        showNext();
      } else if (e.key === "Escape") {
        closeImageViewer();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isImageViewerOpen]);

  return (
    <div className="bg-white py-5 px-1">
      {/* Mobile View */}
      <div className="block md:hidden">
        <div
          className="relative overflow-hidden rounded-lg cursor-pointer"
          onClick={() => openListModal()}
        >
          <img
            src={photos[0]}
            alt="Main Image"
            className="w-full h-100 object-cover"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              openListModal();
            }}
            className="absolute left-4 bottom-4 bg-white text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100 transition-all duration-200"
          >
            <FaImage /> View Photos
          </button>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:flex justify-center">
        <div className={`w-full max-w-7xl max-h-4xl px-4 ${containerClasses}`}>
          {previewPhotos.map((photo, idx) => {
            const spanClass =
              previewCount === 3 && idx === 0 ? "md:row-span-2" : "";
            const isLastPreview = idx === 2 && remainingCount > 0;

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-lg cursor-pointer ${spanClass}`}
                onClick={() => openListModal()}
              >
                <img
                  src={photo.src}
                  alt={`Preview ${idx + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* +X more overlay */}
                {isLastPreview && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-none flex items-center justify-center text-white text-3xl font-semibold rounded-md">
                    +{remainingCount}
                  </div>
                )}

                {/* View Photos Button on First Image */}
                {idx === 0 && normalizedPhotos.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openListModal();
                    }}
                    className="absolute left-5 bottom-5 bg-white text-gray-700 px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-100 transition-all duration-200"
                  >
                    <FaImage /> View Photos
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal 1: White Fullscreen Vertical Gallery */}
      {isListModalOpen && (
        <div className="fixed inset-0 z-[9999] bg-white overflow-y-scroll py-10 px-5">
          <button
            onClick={closeListModal}
            className="fixed top-4 right-4 bg-black text-white p-3 rounded-full text-xl shadow-lg z-[9999]"
          >
            <FaTimes />
          </button>

          <div className="max-w-4xl mx-auto flex flex-col gap-6 pt-12 pb-8">
            {normalizedPhotos.map((photo, index) => (
              <img
                key={index}
                src={photo.src}
                alt={`Image ${index + 1}`}
                className="rounded-lg cursor-pointer shadow-sm transition hover:shadow-md"
                onClick={() => openImageViewer(index)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal 2: Black Fullscreen Single Image Viewer */}
      {isImageViewerOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center px-2">
          <button
            onClick={closeImageViewer}
            className="absolute top-4 right-4 text-white text-3xl p-2 rounded-full hover:bg-white/10 transition"
          >
            <FaTimes />
          </button>

          <button
            onClick={showPrev}
            className="absolute left-4 text-white text-3xl p-2 rounded-full hover:bg-white/10 transition"
          >
            <FaChevronLeft />
          </button>

          <img
            src={normalizedPhotos[currentIndex].src}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-[90%] max-h-[85vh] object-contain rounded-md shadow-md"
          />

          <button
            onClick={showNext}
            className="absolute right-4 text-white text-3xl p-2 rounded-full hover:bg-white/10 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}
