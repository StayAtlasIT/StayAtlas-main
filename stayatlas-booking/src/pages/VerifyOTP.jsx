import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signupData = JSON.parse(localStorage.getItem("signupData"));

  useEffect(() => {
    if (!signupData?.email) {
      toast.error("Signup data not found!");
      navigate("/signup");
    }
  }, [navigate]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const verifyRes = await axios.post("/v1/users/verify-otp", {
        email: signupData.email,
        otp,
      });

      if (verifyRes.data.statusCode === 200) {
        const { confirmPassword, ...formDataToSend } = signupData;
        const registerRes = await axios.post(
          "/v1/users/register",
          formDataToSend
        );

        if (registerRes.data.statusCode === 200) {
          toast.success("Registration successful!");

          // ✅ Save phoneNumber and password for login autofill
          localStorage.setItem(
            "loginAutofill",
            JSON.stringify({
              phoneNumber: signupData.phoneNumber,
              password: signupData.password,
            })
          );

          localStorage.removeItem("signupData");
          navigate("/login");
        } else {
          toast.error(registerRes.data.message || "Registration failed");
        }
      } else {
        toast.error("Invalid OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!signupData?.email) return;
    try {
      const resendRes = await axios.post("/v1/users/send-otp", {
        email: signupData.email,
      });
      if (resendRes.data.statusCode === 200) {
        toast.success("OTP resent successfully!");
      } else {
        toast.error("Failed to resend OTP");
      }
    } catch (err) {
      toast.error("Resend failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 px-4 py-10">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-xl border border-gray-200">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-2">
            OTP Verification
          </h2>
          <p className="text-sm text-gray-600">
            We’ve sent a 6-digit OTP to your email:{" "}
            <span className="font-semibold">{signupData?.email || "..."}</span>
          </p>
        </div>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          placeholder="Enter 6-digit OTP"
          className="w-full p-3 text-center tracking-widest text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-5"
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className={`w-full p-3 rounded-md text-white font-semibold transition-all ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify & Register"}
        </button>

        <p className="text-xs text-center mt-6 text-gray-500">
          Didn’t receive an OTP?{" "}
          <span
            className="text-green-700 font-medium cursor-pointer hover:underline"
            onClick={handleResend}
          >
            Resend
          </span>
        </p>
      </div>
    </div>
  );
}
