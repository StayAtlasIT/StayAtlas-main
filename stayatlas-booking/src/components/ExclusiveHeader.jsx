import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sa logo white.png";

const ExclusiveHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-black sticky top-0 z-50 shadow-md">
      <div className="max-w-[2560px] mx-auto flex justify-between items-center py-5 px-6 md:px-20">

        {/* LEFT: Logo and Brand */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}> 
          <img src={logo} alt="StayAtlas Logo" className="h-15 md:h-18 w-auto" />
          <div className="text-white text-2xl font-light tracking-widest hover:scale-105 transition-transform duration-300">
            Stay
            <span className="italic bg-gradient-to-br from-[#F9F295] to-[#fceb01] bg-clip-text text-transparent">
              Exclusive
            </span>
          </div>
        </div>

        {/* RIGHT: Nav/Menu */}
        <div className="hidden md:flex space-x-8 items-center">
          <a href="/" className="text-white font-semibold text-base relative hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-500 after:w-0">
            HOME
          </a>

          {/* <div className="relative group">
            <button className="text-white font-semibold text-sm flex items-center gap-1">
              LOCATION <span className="text-xs">▼</span>
            </button>
            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 min-w-[180px] shadow-xl rounded-xl overflow-hidden mt-2">
              <a href="#" className="px-4 py-3 block hover:bg-blue-500 hover:text-white transition-all duration-200">Panvel</a>
              <a href="#" className="px-4 py-3 block hover:bg-blue-500 hover:text-white transition-all duration-200">Khanavale</a>
              <a href="#" className="px-4 py-3 block hover:bg-blue-500 hover:text-white transition-all duration-200">Other Locations</a>
            </div>
          </div>

          <div className="relative group">
            <button className="text-white font-semibold text-sm flex items-center gap-1">
              EXCLUSIVE <span className="text-xs">▼</span>
            </button>
            <div className="absolute invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 min-w-[180px] shadow-xl rounded-xl overflow-hidden mt-2">
              <a href="#" className="px-4 py-3 block hover:bg-blue-500 hover:text-white transition-all duration-200">Villas</a>
              <a href="#" className="px-4 py-3 block hover:bg-blue-500 hover:text-white transition-all duration-200">Resorts</a>
              <a href="#" className="px-4 py-3 block hover:bg-blue-500 hover:text-white transition-all duration-200">Pool Homes</a>
            </div>
          </div>
           */}
          <a
            href="https://wa.me/918591131447"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold text-base relative hover:after:w-full after:transition-all after:duration-300 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-blue-500 after:w-0"
          >
            CONTACT US
          </a>
        </div>

        {/* Mobile menu icon */}
        <div className="md:hidden flex flex-col justify-between w-8 h-5 cursor-pointer">
          <span className="h-1 w-full bg-white rounded-md"></span>
          <span className="h-1 w-full bg-white rounded-md"></span>
          <span className="h-1 w-full bg-white rounded-md"></span>
        </div>
      </div>
    </header>
  );
};

export default ExclusiveHeader;
