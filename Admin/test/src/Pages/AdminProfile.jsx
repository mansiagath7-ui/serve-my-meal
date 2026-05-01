import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Save, Trash2, Camera, LogOut, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function AdminProfile() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api('/auth/update', {
        method: 'PUT',
        body: JSON.stringify(form)
      });
      if (res.success) {
        toast.success("Admin profile updated! ✅");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("CRITICAL WARNING: You are deleting the Super Admin account. This will restrict access to this panel until a new admin is registered. Proceed?")) {
      try {
        const res = await api(`/auth/delete/${user.id}`, {
          method: 'DELETE'
        });
        if (res.success) {
          toast.success("Admin account deleted");
          logout();
          navigate("/login");
        }
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-400">Loading Admin Dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
        <button 
          onClick={handleDelete}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition shadow-sm border border-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Delete SuperAdmin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Summary Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 opacity-10">
               <ShieldCheck className="w-20 h-20 text-orange-500" />
            </div>
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-amber-300 rounded-3xl flex items-center justify-center border-4 border-white shadow-md">
                <User className="w-12 h-12 text-white" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-100">
                <Camera className="w-4 h-4 text-orange-500" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name}</h2>
            <p className="text-gray-500 text-sm mb-4">Super Administrator</p>
            <div className="flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-orange-500 text-white text-[10px] font-black rounded-full uppercase">Full Access</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-[10px] font-black rounded-full uppercase">Admin</span>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">System Privileges</h3>
            <ul className="space-y-3">
              {["User Management", "Cook Onboarding", "Order Supervision", "Global Analytics"].map(p => (
                <li key={p} className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Side: Account Settings */}
        <div className="md:col-span-2">
          <form onSubmit={handleUpdate} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Master Account Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Admin Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-semibold"
                    placeholder="Admin"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="email" 
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-semibold"
                    placeholder="admin@servemymeal.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Emergency Contact</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="tel" 
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-semibold"
                    placeholder="Phone number"
                  />
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider">Headquarters / Home Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                  <textarea 
                    rows="3"
                    value={form.address}
                    onChange={(e) => setForm({...form, address: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-orange-500 transition-all outline-none text-sm font-semibold resize-none"
                    placeholder="System location"
                  />
                </div>
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
                className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-black rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 uppercase tracking-wider text-xs"
              >
                <Save className="w-4 h-4" />
                {saving ? "Updating..." : "Update Credentials"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
