import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Trash2,
  Camera,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    specialty: "",
    experience: "",
    hourlyRate: "",
    bio: "",
    cuisines: "",
    status: "offline",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api("/cooks/me");
      if (res.success) {
        const p = res.data.profile || {};
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          address: res.data.address || "",
          specialty: p.specialty || "",
          experience: p.experience || "",
          hourlyRate: p.hourlyRate || "",
          bio: p.bio || "",
          cuisines: p.cuisines ? p.cuisines.join(", ") : "",
          status: p.status || "offline",
        });
      }
    } catch (err) {
      console.error("Failed to fetch full profile", err);
    }
  };

  const toggleStatus = async () => {
    const newStatus = form.status === "online" ? "offline" : "online";
    setForm(prev => ({ ...prev, status: newStatus }));
    
    // Also save it immediately for better UX
    try {
      const res = await api("/cooks/me", {
        method: "PUT",
        body: JSON.stringify({ ...form, status: newStatus }),
      });
      if (res.success) {
        toast.success(`You are now ${newStatus}! ${newStatus === 'online' ? '🟢' : '⚪'}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
      setForm(prev => ({ ...prev, status: form.status })); // revert on error
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api("/cooks/me", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (res.success) {
        toast.success("Professional profile updated! ✅");
        // Update local user info if needed or just reload
        const updatedUser = { ...user, name: form.name };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "WARNING: Are you sure you want to delete your cook account? This action is permanent and cannot be undone.",
      )
    ) {
      try {
        const res = await api(`/auth/delete/${user.id}`, {
          method: "DELETE",
        });
        if (res.success) {
          toast.success("Account deleted");
          logout();
          navigate("/login");
        }
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      const res = await api("/auth/update-avatar", {
        method: "POST",
        body: formData,
        // FormData doesn't need Content-Type header manually set in my api.js if I fix it
      });

      if (res.success) {
        toast.success("Profile photo updated! 📸");
        // Update local storage user data
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        currentUser.profileImage = res.data.profileImage;
        localStorage.setItem("user", JSON.stringify(currentUser));
        setTimeout(() => window.location.reload(), 800);
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition shadow-sm border border-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Card: Info Summary */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
            <div className="relative inline-block mb-4">
              <input
                type="file"
                ref={fileInputRef}
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
              <div
                className={`w-24 h-24 bg-orange-100 rounded-3xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden ${uploading ? 'opacity-50' : ''}`}
              >
                {user?.profileImage && user.profileImage !== 'default-avatar.png' ? (
                  <img
                    src={`http://localhost:5000${user.profileImage}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-orange-500" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <Camera className={`w-4 h-4 ${uploading ? 'animate-pulse' : 'text-orange-500'}`} />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-sm mb-4">Professional Cook</p>
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={toggleStatus}
                className={`w-full py-2 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 border ${
                  form.status === "online"
                    ? "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${form.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                {form.status === "online" ? "Online" : "Offline"}
              </button>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">
                {user?.role}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Rating</span>
                <span className="font-bold text-orange-500">4.9 ★</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Completed</span>
                <span className="font-bold text-gray-800">24 Orders</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Edit Form */}
        <div className="md:col-span-2">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-bold text-gray-800 mb-6">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Work Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  <textarea
                    rows="2"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm resize-none"
                    placeholder="Your work address"
                  />
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-gray-800 mt-10 mb-6">
              Professional Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Specialty
                </label>
                <input
                  type="text"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm"
                  placeholder="e.g. North Indian & Mughlai"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Experience
                </label>
                <input
                  type="text"
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm"
                  placeholder="e.g. 8 years"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Hourly Rate / Visit Fee (₹)
                </label>
                <input
                  type="number"
                  value={form.hourlyRate}
                  onChange={(e) =>
                    setForm({ ...form, hourlyRate: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-bold text-orange-600"
                  placeholder="800"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Cuisines (comma separated)
                </label>
                <input
                  type="text"
                  value={form.cuisines}
                  onChange={(e) =>
                    setForm({ ...form, cuisines: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm"
                  placeholder="North Indian, Chinese, Italian"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Professional Bio
                </label>
                <textarea
                  rows="4"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm resize-none"
                  placeholder="Tell customers about your cooking style, signature dishes, and professional background..."
                />
              </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-500 hover:text-red-500 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
