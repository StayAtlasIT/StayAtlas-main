import React, { useState, useEffect, useRef } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/state/features/authSlice";
import logo from "../assets/sa logo white.png";
import { Bars3Icon } from "@heroicons/react/24/outline";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "../utils/axios";
import toast from "react-hot-toast";

// 👇 import AuthModal
import AuthModal from "./AuthModal";

const Header = () => {
  const match = useMatch("/viewExclusive/:id");
  const { isLoggedIn, firstName } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false); // modal state
  const [authView, setAuthView] = useState("login"); // login / signup

  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  async function logoutUser() {
    try {
      const response = await axios.post("/v1/users/logout");
      if (response.data.statusCode === 200) {
        toast.success("Logout successful");
        dispatch(logout());
        setAuthOpen(false);
        navigate("/");
      } else {
        toast.error("Logout failed. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const handleListPropertyClick = () => {
    navigate("/list");
    setIsMobileDropdownOpen(false);
  };

  const handleContactClick = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
    }
    setTimeout(() => {
      const contactSection = document.getElementById("contact-us-section");
      if (contactSection) {
        const offsetTop =
          contactSection.getBoundingClientRect().top +
          window.scrollY -
          100;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    }, 100);
    setIsMobileDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !event.target.closest("#mobile-menu-button")
      ) {
        setIsMobileDropdownOpen(false);
      }
    }
    if (isMobileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileDropdownOpen]);

  return (
    <header className="bg-black sticky top-0 shadow-md z-[9999]">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center py-2 px-6 md:px-20">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer flex-shrink-0"
        >
          {match ? (
            <div className="text-white text-2xl font-light tracking-widest hover:scale-105 transition-transform duration-300 cursor-pointer">
              Stay
              <span className="italic bg-gradient-to-br from-[#F9F295] to-[#fceb01] bg-clip-text text-transparent">
                Exclusive
              </span>
            </div>
          ) : (
            <img
              src={logo}
              alt="StayAtlas Logo"
              className="h-15 md:h-18 w-auto"
            />
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center items-center space-x-8">
          <a
            href="/"
            className="text-[white] font-semibold text-base relative hover:text-white transition-colors duration-200 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#D6AE7B] after:w-0"
          >
            HOME
          </a>
          <button
            onClick={() => navigate("/exclusive")}
            className="cursor-pointer text-[white] font-semibold text-base relative hover:text-white transition-colors duration-200 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#D6AE7B] after:w-0"
          >
            EXCLUSIVE
          </button>
          <a
            href="/explore"
            className="text-[white] font-semibold text-base relative hover:text-white transition-colors duration-200 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#D6AE7B] after:w-0"
          >
            EXPLORE
          </a>
          <button
            onClick={handleContactClick}
            className="text-[white] font-semibold text-base relative hover:text-white transition-colors duration-200 hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-[#D6AE7B] after:w-0"
          >
            CONTACT US
          </button>
        </div>

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center flex-shrink-0 ml-4 space-x-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleListPropertyClick}
                className="bg-[#002b20] text-white font-semibold px-4 py-2 rounded-md border border-black hover:bg-[#002b20] duration-200 transform hover:scale-105 transition-all"
              >
                List Your Property
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer">
                    <AvatarImage
                      src={`https://api.dicebear.com/5.x/initials/svg/seed=${firstName}`}
                      alt={firstName || "User"}
                    />
                    <AvatarFallback>
                      {firstName?.charAt(0) || "👤"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 z-[9999]">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => navigate("/profile")}
                    >
                      Profile
                      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={logoutUser}
                  >
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <button
                onClick={handleListPropertyClick}
                className="bg-[#002b20] text-white font-semibold px-4 py-2 rounded-md border border-black hover:bg-[#002b20] transition-colors duration-200"
              >
                List Your Property
              </button>
              <button
                onClick={() => {
                  setAuthView("login");
                  setAuthOpen(true);
                }}
                className="bg-white border border-black text-black font-semibold px-4 py-2 rounded-md hover:bg-[#22c55e] hover:text-white transition-colors duration-200"
              >
                Login/Signup
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            id="mobile-menu-button"
            onClick={() => setIsMobileDropdownOpen(true)}
            className="text-[white] font-bold text-sm flex items-center gap-1"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-in Dropdown */}
      <div
        ref={dropdownRef}
        className={`fixed top-0 left-0 right-0 bg-black z-[1000000] transform transition-transform duration-500 ease-in-out ${
          isMobileDropdownOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between p-3 border-b">
          <img src={logo} alt="StayAtlas Logo" className="h-16 w-auto" />
          <button
            onClick={() => setIsMobileDropdownOpen(false)}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Menu Links */}
        <div className="flex flex-col items-center gap-6 py-8">
          <a
            href="/"
            onClick={() => setIsMobileDropdownOpen(false)}
            className="text-lg font-medium text-white hover:text-[#2563eb] transition-colors"
          >
            HOME
          </a>
          <a
            href="/exclusive"
            onClick={() => setIsMobileDropdownOpen(false)}
            className="text-lg font-medium text-white hover:text-[#2563eb] transition-colors"
          >
            EXCLUSIVE
          </a>
          <a
            href="/explore"
            onClick={() => setIsMobileDropdownOpen(false)}
            className="text-lg font-medium text-white hover:text-[#2563eb] transition-colors"
          >
            EXPLORE
          </a>
          <button
            onClick={handleContactClick}
            className="text-lg font-medium text-white hover:text-[#2563eb] transition-colors"
          >
            CONTACT US
          </button>
          <span
            onClick={handleListPropertyClick}
            className="text-lg font-medium text-white hover:text-[#2563eb] cursor-pointer transition-colors"
          >
            LIST YOUR PROPERTY
          </span>
          {isLoggedIn ? (
            <>
              <span
                onClick={() => {
                  navigate("/profile");
                  setIsMobileDropdownOpen(false);
                }}
                className="text-lg font-medium text-white hover:text-[#2563eb] cursor-pointer transition-colors"
              >
                PROFILE
              </span>
              <span
                onClick={() => {
                  logoutUser();
                  setIsMobileDropdownOpen(false);
                }}
                className="text-lg font-medium text-white hover:text-[#2563eb] cursor-pointer transition-colors"
              >
                LOGOUT
              </span>
            </>
          ) : (
            <span
              onClick={() => {
                setAuthView("login");
                setAuthOpen(true);
                setIsMobileDropdownOpen(false);
              }}
              className="text-lg font-medium text-white hover:text-[#2563eb] cursor-pointer transition-colors"
            >
              LOGIN/SIGNUP
            </span>
          )}
        </div>
      </div>

      {/* 👇 Auth Modal render */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        defaultView={authView}
      />
    </header>
  );
};

export default Header;