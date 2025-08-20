import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  const handleReset = async () => {
    if (!password || password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/v1/users/reset-password/${token}`,
        { password }
      );
      toast.success(response.data?.message || "Password reset successful");
      setPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold mb-4 text-center">Reset Password</h2>

      {/* Password Input with Eye Icon */}
      <div className="relative mb-4">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter new password"
          className="border border-gray-300 p-2 w-full rounded pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <div
          className="absolute right-3 top-2.5 cursor-pointer text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
        </div>
      </div>

      <button
  className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-50 cursor-pointer flex justify-center items-center gap-2"
  onClick={handleReset}
  disabled={loading}
>
  {loading ? (
    <>
      <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-solid"></span>
      Resetting...
    </>
  ) : (
    "Reset Password"
  )}
</button>

    </div>
  );
};

export default ResetPasswordPage;
