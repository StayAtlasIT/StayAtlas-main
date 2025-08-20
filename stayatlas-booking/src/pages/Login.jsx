import axios from "../utils/axios.js";
import React, { useState, useEffect } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { setUser } from "../state/features/authSlice.js";
import { useDispatch } from "react-redux";
import { Loader } from "lucide-react";

const bottleGreen = "#006A4E";

export default function Login() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    phoneNumber: "",
    countryCode: "+91",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(number);
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `/v1/users/forgot-password`,
        { email: resetEmail }
      );
      toast.success(response.data?.message || "Reset link sent to your email");
      setShowForgotPassword(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset link. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (loading) return;

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
          navigate("/");
        }
      } catch (err) {
        console.log(err);
        toast.error(err.response.data.message);
      } finally {
        setForm({
          phoneNumber: "",
          countryCode: "+91",
          password: "",
        });
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const res = await axios.post("/v1/users/email-by-phone", {
          phoneNumber: form.phoneNumber,
        });
        const userEmail = res.data?.email;
        if (userEmail) {
          setResetEmail(userEmail);
          localStorage.setItem("userEmail", userEmail); // Optional
        }
      } catch (err) {
        console.log("No email found for this phone.");
        setResetEmail("");
      }
    };

    if (form.phoneNumber.length === 10) {
      fetchEmail();
    }
  }, [form.phoneNumber]);


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
    if (storedEmail) {
      setResetEmail(storedEmail);
    }
  }, []);

  // Function to initiate Google OAuth login
  const handleGoogleLogin = () => {
    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    googleAuthUrl.searchParams.append('redirect_uri', `${import.meta.env.VITE_BACKEND_URL}/v1/users/google-callback`);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'select_account');

    window.location.href = googleAuthUrl.toString();
  };

  // Handle tokens from URL params after backend redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const error = params.get('error');

    if (accessToken && refreshToken) {
      try {
        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        
        // Ensure all expected user fields are present, even if undefined in token
        const userFromToken = {
          _id: decodedToken._id,
          email: decodedToken.email || '',
          firstName: decodedToken.firstName || '',
          lastName: decodedToken.lastName || '',
          username: decodedToken.username || '', 
          phoneNumber: decodedToken.phoneNumber || '', // Google won't provide phoneNumber
          role: decodedToken.role || 'defaultUser', // Default role if not in token
          profilePic: decodedToken.picture || '', // Google's 'picture' is the profile image
          isBanned: decodedToken.isBanned || false,
          // Add any other fields your UserProfile component expects, with defaults
        };

        dispatch(setUser(userFromToken));
        toast.success("Google login successful!");
        navigate("/", { replace: true });
      } catch (decodeError) {
        console.error("Error decoding accessToken or populating user data:", decodeError);
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
  }, [dispatch, navigate]);


  return (
    <div className="py-7 px-3 min-h-screen flex items-center justify-center bg-gray-900">
      <form
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: bottleGreen }}
        >
          Login
        </h2>

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
            placeholder="Contact Number"
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
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Enter Password"
          value={form.password}
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

        <button
          disabled={loading}
          type="submit"
          className={`${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-600 cursor-pointer "
          } mt-6 w-full p-2 rounded text-white font-semibold`}
        >
          {loading ? (
            <div className="flex justify-center">
              <Loader className="animate-spin" />
            </div>
          ) : (
            "Login"
          )}
        </button>
        <div className="py-2 flex justify-between items-center">
          <div className="flex gap-1">
            <p className="font-semibold">New user?</p>
            <Link
              to={"/signup"}
              className="hover:text-blue-500 hover:underline"
            >
              Signup
            </Link>
          </div>
          
          <button
            type="button"
            className="text-sm text-blue-600 hover:underline mt-2"
            onClick={() => setShowForgotPassword(true)}
          >
            Forgot Password?
          </button>
        </div>

        {showForgotPassword && (
          <div className="mt-4 bg-gray-50 border p-4 rounded-md">
            <h3 className="text-md font-semibold mb-2">Reset Your Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              className="border p-2 w-full rounded mb-2"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white border-solid"></span>
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Google Login Button */}
        <div className="py-2 text-center">
            <p className="text-gray-500 my-4">OR</p>
            <button
                type="button"
                onClick={handleGoogleLogin}
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

      </form>
    </div>
  );
}
