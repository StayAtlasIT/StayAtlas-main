import axios from "../utils/axios.js";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Loader } from "lucide-react";

const bottleGreen = "#006A4E";

export default function SignupForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contact: "", // This seems redundant with phoneNumber, consider removing if not used
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
  const [email, setEmail] = useState(""); // This seems redundant with form.email, consider removing

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

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!validateAge(form.dob))
      newErrors.dob = "Your age must be between 18 and 100.";
    if (!validatePhoneNumber(form.phoneNumber))
      newErrors.phoneNumber = "Invalid phone number.";
    if (form.password !== form.confirmPassword)
      newErrors.password = "Passwords do not match.";

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

        navigate("/verify-otp");
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      const errMsg = error.response?.data?.message;
      if (errMsg === "User with this email already exists") {
        toast.error(errMsg);
      } else {
        toast.error("Error sending OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to initiate Google OAuth login (copied from Login.jsx)
  const handleGoogleLogin = () => {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    // Corrected redirect_uri: It must include '/v1' to match your backend route structure
    googleAuthUrl.searchParams.append('redirect_uri', `${import.meta.env.VITE_BACKEND_URL}/v1/users/google-callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline'); // For refresh tokens if needed later
    googleAuthUrl.searchParams.append('prompt', 'select_account'); // Forces account selection

    window.location.href = googleAuthUrl.toString();
  };

  return (
    <div className="py-7 px-3 min-h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={handleSendOtp}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: bottleGreen }}
        >
          Sign Up
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="border p-2 rounded"
          />
        </div>

        {/* Contact Number with Country Code */}
        <div className="flex mt-4 gap-2">
          <select
            name="countryCode"
            value={form.countryCode}
            onChange={handleChange}
            className="border p-2 rounded bg-white"
          >
            <option value="+91">🇮🇳 +91</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+61">🇦🇺 +61</option>
            <option value="+81">🇯🇵 +81</option>
          </select>

          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleChange}
            required
            className="border p-2 rounded flex-1"
            maxLength={10}
            pattern="\d*"
          />
        </div>
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
        )}

        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
          required
          className="border p-2 rounded mt-4 w-full"
        />
        {errors.dob && (
          <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
        )}

        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Create Password"
          value={form.password}
          onChange={handleChange}
          required
          className="border p-2 rounded mt-4 w-full"
        />

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="border p-2 rounded mt-4 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}

        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
            className="mr-2"
          />
          <label>Show Passwords</label>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded mt-4 w-full"
        />

        {/* ✅ OTP Input */}
        {/* <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          value={form.otp}
          onChange={handleChange}
          maxLength={6}
          className="border p-2 rounded mt-4 w-full"
        /> */}

        <button
          disabled={loading}
          onClick={handleSendOtp}
          className={`${
            loading ? "bg-gray-500" : "bg-green-700 hover:bg-green-600"
          } mt-6 w-full p-2 rounded text-white font-semibold`}
        >
          {loading ? (
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            "Send OTP"
          )}
        </button>

        {/* NEW: Google Login Button */}
        <div className="py-2 text-center">
            <p className="text-gray-500 my-4">OR</p>
            <button
                type="button"
                onClick={handleGoogleLogin} // Call the new Google login handler
                className="w-full p-2 rounded-full text-white font-semibold flex items-center justify-center gap-2"
                style={{ backgroundColor: '#DB4437' }}
            >
                {/* Google SVG icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
                    <path d="M22.56 12.25c0-.78-.07-1.55-.2-2.3C21.9 4.3 17 0 12.01 0 5.48 0 0 5.48 0 12c0 6.62 5.48 12 12 12c4.95 0 9.17-2.92 11.22-7.16c.13-.25.21-.5.3-.77h-1.07c-.08.23-.16.46-.26.68c-1.93 4.14-6.15 6.94-10.99 6.94C6.54 23.99 2 19.45 2 12s4.54-11.99 10.01-11.99c2.93 0 5.58 1.25 7.42 3.32l-2.09 2.08c-1.22-1.12-2.78-1.78-4.32-1.78c-4.32 0-7.82 3.5-7.82 7.82s3.5 7.82 7.82 7.82c4.32 0 7.23-3.05 7.42-6.52h-7.42v-2.22z" />
                </svg>
                Continue with Google
            </button>
        </div>

        <div className="py-2 flex gap-1">
          <p className="font-semibold">Already registered?</p>
          <Link to={"/login"} className="hover:text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
