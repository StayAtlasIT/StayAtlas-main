import React, { useEffect } from "react";

export default function PropertyBrochureModal({ isOpen, onClose, pdfUrl, title = "StayAtlas Villa Brochure" }) {
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

  return (
    <div
      onClick={handleOutsideClick}
      className="fixed inset-0 z-[9999] bg-black bg-opacity-60 backdrop-blur-md flex items-center justify-center px-4"
    >
      <div className="bg-white w-full max-w-5xl h-[90vh] overflow-hidden rounded-lg p-6 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-4xl"
        >
          &times;
        </button>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-2xl font-bold truncate pr-4">{title}</h2>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            Open in new tab
          </a>
        </div>

        <div className="w-full h-[calc(90vh-80px)]">
          <iframe
            title="Property Brochure"
            src={pdfUrl}
            className="w-full h-full rounded-md border"
          />
        </div>
      </div>
    </div>
  );
}