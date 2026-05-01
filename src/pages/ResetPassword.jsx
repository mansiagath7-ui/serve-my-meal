import React, { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast.success("Password reset link sent to your email 📩");

      navigate("/login");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center text-gray-500 hover:text-orange-500 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-orange-500">
            Reset Password
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Enter your email to receive reset link
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleReset} className="space-y-4">
          
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-xl text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 mt-5">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 font-semibold cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}