import React from 'react';
import {
  FaEnvelope,
  FaWhatsapp,
  FaFacebookF,
  FaSms,
  FaLink,
} from 'react-icons/fa';

function ShareOptions({ onClose }) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
      onClose();
    });
  };

  const shareOptions = [
    {
      label: 'Email',
      icon: <FaEnvelope size={18} />,
      onClick: () => {
        window.location.href = `mailto:?subject=Check out this Villa&body=I found this amazing villa on StayAtlas: ${window.location.href}`;
      },
    },
    {
      label: 'WhatsApp',
      icon: <FaWhatsapp size={18} />,
      onClick: () => {
        window.open(`https://wa.me/?text=Check out this amazing villa on StayAtlas: ${window.location.href}`);
      },
    },
    {
      label: 'Facebook',
      icon: <FaFacebookF size={18} />,
      onClick: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`);
      },
    },
    {
      label: 'Messages',
      icon: <FaSms size={18} />,
      onClick: () => {
        window.location.href = `sms:?&body=Check out this amazing villa on StayAtlas: ${window.location.href}`;
      },
    },
  ];

  return (
<div className="flex gap-3 px-4 py-3 overflow-x-auto space-x-3">
    {shareOptions.map((option, index) => (
      <button
        key={index}
        onClick={option.onClick}
        className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 border border-gray-300 rounded-md w-20"
      >
        <div className="mb-1">{option.icon}</div>
        <span className="text-xs text-gray-700 text-center">{option.label}</span>
      </button>
    ))}
    <button
      onClick={handleCopyLink}
      className="flex flex-col items-center justify-center p-2 hover:bg-gray-100 border border-gray-300 rounded-md w-20"
    >
      <div className="mb-1">
        <FaLink size={18} />
      </div>
      <span className="text-xs text-gray-700 text-center">Copy Link</span>
    </button>
  </div>
      
      
  );
}

export default ShareOptions;
