// AuthModal.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../pages/Login";
import SignupForm from "../pages/Signup";
import loginPopupImg from "../assets/LoginPopUp.jpeg";

export default function AuthModal({ isOpen, onClose, defaultView = "login" }) {
  const [view, setView] = useState(defaultView);

  useEffect(() => {
    setView(defaultView);
  }, [defaultView]);

  // Handle successful authentication - ensures modal closes
  const handleAuthSuccess = () => {
    // Close the modal
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[99999] flex justify-center items-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="relative flex justify-center items-center w-full">
            <motion.div
              className="relative w-full max-w-xs sm:max-w-md md:max-w-4xl mx-3 bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row 
              h-auto max-h-[90vh] overflow-hidden"
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 40, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left - Image */}
              <div className="hidden md:flex md:w-1/2 h-full p-4">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-sm border border-gray-200 bg-white">
                  <img
                    src={loginPopupImg}
                    alt="Luxury Stay"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>

              {/* Right - Form */}
              <div className="w-full md:w-1/2 flex flex-col bg-white relative max-h-[90vh]">
                {/* Tabs */}
                <div className="flex items-center justify-center px-3 pt-3 shrink-0">
                  <div className="flex flex-1 gap-2 rounded-lg p-1 bg-gray-100 text-xs sm:text-sm">
                    <button
                      onClick={() => setView("login")}
                      className={`flex-1 py-2 font-semibold rounded-lg transition ${
                        view === "login"
                          ? "bg-white text-black shadow"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => setView("signup")}
                      className={`flex-1 py-2 font-semibold rounded-lg transition ${
                        view === "signup"
                          ? "bg-white text-black shadow"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* Scrollable form */}
                <div className="flex-1 px-3 pb-3 mt-2 overflow-y-auto">
                  <div className="w-full max-w-xs sm:max-w-md gap-3 mx-auto">
                    {view === "login" ? (
                      <LoginForm
                        onSwitchView={() => setView("signup")}
                        onSuccess={handleAuthSuccess} // Guaranteed to close modal
                      />
                    ) : (
                      <SignupForm
                        onSwitchView={() => setView("login")}
                        onSuccess={handleAuthSuccess} // Guaranteed to close modal
                      />
                    )}
                  </div>
                </div>

                {/* Exit button */}
                <button
                  onClick={onClose}
                  className="hidden md:flex absolute -top-6 -right-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 items-center justify-center text-gray-600 hover:text-gray-800 transition shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}