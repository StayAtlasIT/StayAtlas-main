import axios from "../utils/axios.js";
import React, { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setUser } from "../state/features/authSlice.js";
import { useDispatch } from "react-redux";
import { Loader, ChevronDown } from "lucide-react";

// Country codes list
const countryCodes = [
  { code: "+91", flag: "🇮🇳", name: "India" },
  { code: "+1", flag: "🇺🇸", name: "United States" },
  { code: "+44", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+61", flag: "🇦🇺", name: "Australia" },
  { code: "+81", flag: "🇯🇵", name: "Japan" },
];

// CountryCodeDropdown Component
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="px-3 sm:px-4 py-4 text-base text-gray-700 bg-transparent border-r border-gray-200 focus:outline-none transition-all duration-200 flex items-center gap-2 rounded-l-xl"
      >
        <span>{selectedCountry?.flag || "🌍"}</span>
        <span>{selectedCountry?.code || "+91"}</span>
        <ChevronDown
          size={16}
          className={`ml-1 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isDropdownOpen && (
        <ul className="absolute z-10 top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg animate-fadeIn">
          {countryCodes.map((country) => (
            <li key={country.code}>
              <button
                type="button"
                onClick={() => {
                  onSelect(country.code);
                  setIsDropdownOpen(false);
                }}
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

export default function Login({ onSwitchView, onSuccess }) {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [form, setForm] = useState({ phoneNumber: "", countryCode: "+91", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const validatePhoneNumber = (number) => /^\d{10}$/.test(number);

  // Forgot password handler
  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/v1/users/forgot-password`, { email: resetEmail });
      toast.success(response.data?.message || "Reset link sent to your email");
      setShowForgotPassword(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const newErrors = {};
    if (!validatePhoneNumber(form.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit phone number.";
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const response = await axios.post(`/v1/users/login`, form);
        const { data } = response;
        if (data.statusCode === 200) {
          dispatch(setUser(data.data.user));
          toast.success("Login successful!");
          setForm({ phoneNumber: "", countryCode: "+91", password: "" });
          
          // Close modal immediately on success
          if (onSuccess) {
            onSuccess();
          }
          
          // Navigate after modal closes
          setTimeout(() => {
            navigate("/");
          }, 100);
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    }
  };

  // Fetch email by phone
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await axios.post("/v1/users/email-by-phone", { phoneNumber: form.phoneNumber });
        const userEmail = res.data?.email;
        if (userEmail) {
          setResetEmail(userEmail);
          localStorage.setItem("userEmail", userEmail);
        }
      } catch {
        setResetEmail("");
      }
    };
    if (form.phoneNumber.length === 10) fetchEmail();
  }, [form.phoneNumber]);

  // Autofill login
  useEffect(() => {
    const savedCreds = JSON.parse(localStorage.getItem("loginAutofill"));
    if (savedCreds) {
      setForm({
        phoneNumber: savedCreds.phoneNumber || "",
        password: savedCreds.password || "",
        countryCode: "+91",
      });
      localStorage.removeItem("loginAutofill");
    }
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail");
    if (storedEmail) setResetEmail(storedEmail);
  }, []);

  // Google Login
  const handleGoogleLogin = () => {
    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.append("client_id", import.meta.env.VITE_GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append(
      "redirect_uri",
      `${import.meta.env.VITE_BACKEND_URL}/v1/users/google-callback`
    );
    googleAuthUrl.searchParams.append("response_type", "code");
    googleAuthUrl.searchParams.append("scope", "openid email profile");
    googleAuthUrl.searchParams.append("access_type", "offline");
    googleAuthUrl.searchParams.append("prompt", "select_account");
    window.location.href = googleAuthUrl.toString();
  };

  // Handle Google callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const error = params.get("error");

    if (accessToken && refreshToken) {
      try {
        const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
        const userFromToken = {
          _id: decodedToken._id,
          email: decodedToken.email || "",
          firstName: decodedToken.firstName || "",
          lastName: decodedToken.lastName || "",
          username: decodedToken.username || "",
          phoneNumber: decodedToken.phoneNumber || "",
          role: decodedToken.role || "defaultUser",
          profilePic: decodedToken.picture || "",
          isBanned: decodedToken.isBanned || false,
        };
        dispatch(setUser(userFromToken));
        toast.success("Google login successful!");
        
        // Close modal on Google login success
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 100);
      } catch {
        toast.error("Failed to process login. Please try again.");
        navigate("/login", { replace: true });
      } finally {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } else if (error) {
      toast.error(decodeURIComponent(error));
      navigate("/login", { replace: true });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [dispatch, navigate, onSuccess]);

  return (
    <div className="w-full bg-white space-y-6">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl font-semibold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Sign in to continue your journey with StayAtlas
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Phone Input */}
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
              placeholder="Enter Mobile Number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
              className="flex-1 px-3 sm:px-4 py-4 bg-transparent border-0 text-gray-900 placeholder-gray-500 text-base focus:outline-none"
              maxLength={10}
              pattern="\d*"
            />
          </div>
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1 ml-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm focus-within:border-black focus-within:ring-4 focus-within:ring-black/10 transition-all duration-200">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-4 bg-transparent border-0 text-gray-900 placeholder-gray-500 text-base focus:outline-none rounded-xl"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
                className="w-4 h-4 border-gray-300 rounded accent-black"
              />
              <span className="ml-2">Show Password</span>
            </label>
          </div>
        </div>

        {/* Login Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full bg-black text-white font-medium py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <div className="flex justify-center items-center space-x-2">
              <Loader className="animate-spin w-5 h-5" />
              <span>Signing In...</span>
            </div>
          ) : (
            "Continue"
          )}
        </button>

        {/* Links */}
        <div className="flex justify-between items-center text-sm">
          <button
            type="button"
            onClick={onSwitchView}
            className="text-black hover:text-gray-800 font-medium transition-colors"
          >
            New user? Signup
          </button>
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-black hover:text-gray-800 font-medium transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        {/* Forgot Password Section */}
        {showForgotPassword && (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-800">Reset Your Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-3 w-3 border-t-2 border-white border-solid"></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>
              <button
                type="button"
                className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
                onClick={() => setShowForgotPassword(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-gray-400 text-xs uppercase tracking-wider font-medium">
            Other Login Options
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex justify-center items-center space-x-3 py-4 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-gray-700"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
}