import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN
        if (!data.email || !data.password) {
          throw new Error("Email and password required");
        }
        await login(data.email, data.password);
        toast.success(`Welcome back! 👨‍🍳`);
        navigate("/cook");
      } else {
        // 📝 SIGNUP
        if (!data.name || !data.email || !data.password) {
          throw new Error("All fields required");
        }
        await register({
          name: data.name,
          email: data.email,
          password: data.password
        });
        toast.success("Account created successfully 🎉");
        navigate("/cook");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-500">ServeMyMeal</h1>
          <p className="text-xs text-gray-400 tracking-widest">FOOD TECH PLATFORM</p>
        </div>

        {/* Tabs */}
        <div className="bg-gray-100 rounded-xl p-1 mb-6 flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2 rounded-xl text-sm font-medium transition ${
              isLogin ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2 rounded-xl text-sm font-medium transition ${
              !isLogin ? "bg-white text-orange-500 shadow-sm" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Full Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full pl-12 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email address"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full pl-12 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}