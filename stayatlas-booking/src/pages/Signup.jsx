import axios from "../utils/axios.js";
import React, { useState, useEffect, useRef } from "react";
import { Loader, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Simplified Country Code Dropdown Component
const countryCodes = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
];

function CountryCodeDropdown({ selectedCode, onSelect }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCountry = countryCodes.find((c) => c.code === selectedCode);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (country) => {
    onSelect(country.code);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="px-3 sm:px-4 py-4 text-base text-gray-700 bg-transparent border-r border-gray-200 focus:outline-none transition-all duration-200 flex items-center gap-2 rounded-l-xl"
      >
        <span>{selectedCountry?.flag || "🌍"}</span>
        <span>{selectedCountry?.code || "+91"}</span>
        <ChevronDown size={16} className={`ml-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {isDropdownOpen && (
        <ul className="absolute z-10 top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg animate-fadeIn">
          {countryCodes.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                onClick={() => handleSelect(country)}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                <span>{country.flag}</span>
                <span className="flex-1 text-left">{country.name}</span>
                <span className="text-gray-500">{country.code}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Date Picker Component with Month and Year Selectors
function DatePickerDropdown({ value, onChange }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const calendarRef = useRef(null);

  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [calendarRef]);

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handleMonthChange = (e) => {
    const newMonth = parseInt(e.target.value, 10);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth, 1));
  };

  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value, 10);
    setCurrentDate(new Date(newYear, currentDate.getMonth(), 1));
  };

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const firstDay = firstDayOfMonth(currentDate.getMonth(), currentDate.getFullYear());

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    for (let i = 1; i <= totalDays; i++) {
      const day = i;
      const dateString = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const isSelected = value === dateString;

      days.push(
        <button
          key={i}
          type="button"
          onClick={() => {
            onChange({ target: { name: "dob", value: dateString } });
            setIsCalendarOpen(false);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isSelected ? 'bg-black text-white' : 'text-gray-900 hover:bg-gray-200'}`}
        >
          {day}
        </button>
      );
    }
    return days;
  };

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="relative" ref={calendarRef}>
      <button
        type="button"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="rounded-xl border border-gray-200 bg-white shadow-sm focus:border-black focus:ring-4 focus:ring-black/10 w-full px-4 py-3 text-gray-900 text-sm flex justify-between items-center"
      >
        <span>{value ? value : "Date of Birth"}</span>
        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} />
      </button>

      {isCalendarOpen && (
        <div className="absolute z-10 top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4 animate-fadeIn">
          <div className="flex justify-between items-center mb-4 gap-2">
            <select
              value={currentDate.getMonth()}
              onChange={handleMonthChange}
              className="flex-1 py-1 px-2 border border-gray-300 rounded-lg text-sm"
            >
              {months.map((month, index) => (
                <option key={index} value={index}>{month}</option>
              ))}
            </select>
            <select
              value={currentDate.getFullYear()}
              onChange={handleYearChange}
              className="flex-1 py-1 px-2 border border-gray-300 rounded-lg text-sm"
            >
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
            <div>Su</div>
            <div>Mo</div>
            <div>Tu</div>
            <div>We</div>
            <div>Th</div>
            <div>Fr</div>
            <div>Sa</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SignupForm({ onSwitchView, onSuccess }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    countryCode: "+91",
    dob: "",
    password: "",
    confirmPassword: "",
    email: "",
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      setForm({ ...form, [name]: onlyNums });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const validateAge = (dob) => {
    const dobDate = new Date(dob);
    const ageDifMs = Date.now() - dobDate.getTime();
    const ageDate = new Date(ageDifMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age >= 18 && age <= 100;
  };

  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateAge(form.dob)) newErrors.dob = "Your age must be between 18 and 100.";
    if (!validatePhoneNumber(form.phoneNumber)) newErrors.phoneNumber = "Invalid phone number.";
    if (form.password !== form.confirmPassword) newErrors.password = "Passwords do not match.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await axios.post(`/v1/users/send-otp`, {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        dob: form.dob,
        password: form.password,
        phoneNumber: form.phoneNumber,
      });

      if (response.data.statusCode === 200) {
        toast.success("OTP sent successfully!");
        localStorage.setItem("signupData", JSON.stringify(form));
        localStorage.setItem("userEmail", form.email);
        
        // Close modal immediately on successful OTP send
        if (onSuccess) {
          onSuccess();
        }
        
        // Navigate after modal closes
        setTimeout(() => {
          navigate("/verify-otp");
        }, 100);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message;
      toast.error(errMsg || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.append("client_id", import.meta.env.VITE_GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append("redirect_uri", `${import.meta.env.VITE_BACKEND_URL}/v1/users/google-callback`);
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid email profile");
    googleAuthUrl.searchParams.append("access_type", "offline");
    googleAuthUrl.searchParams.append("prompt", "select_account");
    window.location.href = googleAuthUrl.toString();
  };

  return (
    <div className="w-full bg-white space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-gray-900">Create Your Account</h2>
        <p className="text-sm text-gray-600 leading-relaxed">Sign up to explore beautiful stays</p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="rounded-xl border border-gray-200 bg-white shadow-sm focus:border-black focus:ring-4 focus:ring-black/10 w-full px-4 py-3 text-gray-900 placeholder-gray-500 text-sm"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="rounded-xl border border-gray-200 bg-white shadow-sm focus:border-black focus:ring-4 focus:ring-black/10 w-full px-4 py-3 text-gray-900 placeholder-gray-500 text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-stretch rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/10 transition-all duration-200">
            <CountryCodeDropdown
              selectedCode={form.countryCode}
              onSelect={(code) => setForm({ ...form, countryCode: code })}
            />
            <div className="w-px bg-gray-200"></div>
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="flex-1 px-3 sm:px-4 py-4 bg-transparent border-0 text-gray-900 placeholder-gray-500 text-base focus:outline-none"
              maxLength={10}
              pattern="\d*"
            />
          </div>
          {errors.phoneNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phoneNumber}</p>}
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          required
          value={form.email}
          onChange={handleChange}
          className="rounded-xl border border-gray-200 bg-white shadow-sm focus:border-black focus:ring-4 focus:ring-black/10 w-full px-4 py-3 text-gray-900 placeholder-gray-500 text-sm"
        />

        <div className="space-y-1">
          <DatePickerDropdown
            value={form.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="text-red-500 text-xs mt-1 ml-1">{errors.dob}</p>}
        </div>

        <div className="space-y-3">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Create Password"
            value={form.password}
            onChange={handleChange}
            required
            className="rounded-xl border border-gray-200 bg-white shadow-sm focus:border-black focus:ring-4 focus:ring-black/10 w-full px-4 py-3 text-gray-900 placeholder-gray-500 text-sm"
          />
          <input
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="rounded-xl border border-gray-200 bg-white shadow-sm focus:border-black focus:ring-4 focus:ring-black/10 w-full px-4 py-3 text-gray-900 placeholder-gray-500 text-sm"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>}

          <label className="flex items-center text-sm text-gray-600 cursor-pointer">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
              className="w-4 h-4 border-gray-300 rounded accent-black focus:ring-black focus:ring-2"
            />
            <span className="ml-2">Show Passwords</span>
          </label>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full bg-black text-white font-medium py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <Loader className="animate-spin w-5 h-5" />
              <span>Signing Up...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>

        <div className="flex justify-center text-sm">
          <button type="button" onClick={onSwitchView} className="text-black hover:text-gray-800 font-medium transition-colors">
            Already registered? Login
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center space-x-3 py-3 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
}