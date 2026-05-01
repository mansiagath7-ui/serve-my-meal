import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
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
        toast.success("Welcome back, Admin 👋");
        navigate("/admin");
      } else {
        // 📝 SIGNUP (Only works if no admin exists)
        if (!data.name || !data.email || !data.password) {
          throw new Error("All fields required");
        }
        await register({
          name: data.name,
          email: data.email,
          password: data.password,
        });
        toast.success("Admin registered successfully 🎉");
        navigate("/admin/");
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
          <p className="text-xs text-gray-400 tracking-widest">
            FOOD TECH PLATFORM
          </p>
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

        {/* Info for Sign Up */}
        {!isLogin && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-600 text-[10px] rounded-xl border border-blue-100 leading-tight">
            Note: Admin registration is only allowed once. If an admin already
            exists, this will fail.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Admin Full Name"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className="w-full pl-12 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
          )}

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Admin Email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full pl-12 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              autoComplete="username"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Admin Password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="w-full pl-12 pr-10 py-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              autoComplete="current-password"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 cursor-pointer text-gray-400"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition disabled:opacity-50 shadow-lg shadow-orange-100 active:scale-95"
          >
            {loading
              ? "Processing..."
              : isLogin
                ? "Log In as Admin"
                : "Register Initial Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
