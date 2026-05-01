import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  Package,
  Star,
  Edit3,
  Camera,
  Bell,
  Shield,
  Truck,
  Heart,
  Phone,
  Mail,
  ChefHat,
  Lock,
  Eye,
  EyeOff,
  Wallet,
  Clock,
  Award,
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Users,
  Home,
  Briefcase,
  Map,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const T = (msg) => toast.success(msg);
const E = (msg) => toast.error(msg);

function SubHeader({ title, onBack }) {
  return (
    <div className="sticky top-14 md:top-16 z-20 bg-white border-b border-gray-100 px-4 md:px-8 py-3.5">
      <div className="flex items-center gap-3 max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-5 h-5 text-orange-500" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-800">{title}</h1>
      </div>
    </div>
  );
}

/* ── PROFILE HOME ── */
function ProfileHome({ setPage, user, logout, onDelete }) {
  const addressCount = user?.addresses?.length || 0;
  const primaryAddress = user?.addresses?.find((a) => a.isDefault);

  const menuItems = [
    {
      icon: User,
      label: "Edit Profile",
      sub: "Name, photo, bio",
      page: "edit",
      color: "bg-blue-50 text-blue-500",
    },
    {
      icon: MapPin,
      label: "Delivery Addresses",
      sub: `${addressCount} saved addresses`,
      page: "address",
      color: "bg-green-50 text-green-500",
    },
    {
      icon: Wallet,
      label: "FoodieZone Wallet",
      sub: "₹340 available",
      page: "wallet",
      color: "bg-emerald-50 text-emerald-500",
    },
    {
      icon: ChefHat,
      label: "Book a Cook",
      sub: "Personal chef at home",
      page: "cook",
      color: "bg-violet-50 text-violet-500",
    },
    {
      icon: Bell,
      label: "Notifications",
      sub: "Manage alerts",
      page: "notifs",
      color: "bg-red-50 text-red-500",
    },
    {
      icon: Phone,
      label: "Contact Us",
      sub: "24/7 support",
      page: "contact",
      color: "bg-teal-50 text-teal-500",
    },
    {
      icon: Phone,
      label: "About Us",
      sub: "Learn more about us",
      page: "About",
      color: "bg-indigo-50 text-indigo-500",
    },
    {
      icon: HelpCircle,
      label: "Help & FAQs",
      sub: "Quick answers",
      page: "faq",
      color: "bg-sky-50 text-sky-500",
    },
    {
      icon: Settings,
      label: "Change Password",
      sub: "Preferences, privacy",
      page: "Changepassword",
      color: "bg-gray-100 text-gray-500",
    },
  ];
  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 px-4 md:px-8 pt-6 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-white font-black text-xl">My Account</h1>
            <button
              onClick={() => setPage("edit")}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-1.5 transition border border-white/20"
            >
              <Edit3 className="w-3.5 h-3.5 text-white" />
              <span className="text-white text-xs font-semibold">Edit</span>
            </button>
          </div>

          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border border-orange-100">
                <Camera className="w-3.5 h-3.5 text-orange-500" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-white font-black text-xl leading-tight">
                {user?.name || "User"}
              </h2>
              <p className="text-white/75 text-sm mt-0.5">{user?.email}</p>
              <p className="text-white/65 text-xs">
                {user?.phone || "No phone"} ·{" "}
                {primaryAddress
                  ? `Primary: ${primaryAddress.label}`
                  : "No address set"}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                  Member
                </span>
                <span className="bg-white/20 text-white text-[11px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[
              { label: "Orders", value: "12", icon: Package },
              { label: "Reviews", value: "8", icon: Star },
              { label: "Points", value: "340", icon: Award },
              { label: "Saved", value: "12", icon: Heart },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5 text-center border border-white/20"
              >
                <p className="text-white font-black text-lg leading-tight">
                  {s.value}
                </p>
                <p className="text-white/70 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wallet quick card */}
      <div className="px-4 md:px-8 -mt-12 max-w-3xl mx-auto mb-3">
        <button
          onClick={() => setPage("wallet")}
          className="w-full bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex items-center justify-between hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-800 text-sm">
                FoodieZone Wallet
              </p>
              <p className="text-emerald-600 font-extrabold text-lg leading-tight">
                ₹340{" "}
                <span className="text-gray-400 text-xs font-normal">
                  available
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-2.5 py-1 rounded-full">
              Add Money
            </span>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition" />
          </div>
        </button>
      </div>

      {/* Menu */}
      <div className="px-4 md:px-8 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {menuItems.map((item, idx) => (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 active:bg-orange-50 transition-all text-left ${idx > 0 ? "border-t border-gray-50" : ""}`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}
              >
                <item.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm">
                  {item.label}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-200 shrink-0" />
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-4 mt-3 bg-white rounded-2xl text-left hover:bg-gray-50 transition border border-gray-100 group"
        >
          <div className="w-10 h-10 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center transition shrink-0">
            <LogOut className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-semibold text-gray-800 text-sm">Log Out</p>
            <p className="text-gray-400 text-xs">Sign out of your account</p>
          </div>
        </button>

        <button
          onClick={onDelete}
          className="w-full flex items-center gap-3 px-4 py-4 mt-3 bg-red-50 rounded-2xl text-left hover:bg-red-100 transition border border-red-100 group"
        >
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center transition shrink-0">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-semibold text-red-600 text-sm">Delete Account</p>
            <p className="text-red-400 text-xs">Permanently remove your data</p>
          </div>
        </button>
        <div className="h-4" />
      </div>
    </div>
  );
}

/* ── ORDERS ── */
const ordersList = [
  {
    id: "#ORD-001",
    date: "Today, 2:30 PM",
    items: ["Butter Chicken", "Dal Makhani", "Garlic Naan"],
    total: 580,
    status: "Delivered",
    rating: 5,
  },
  {
    id: "#ORD-002",
    date: "Yesterday, 7:15 PM",
    items: ["Masala Dosa", "Idli Sambar", "Mango Lassi"],
    total: 290,
    status: "Delivered",
    rating: 4,
  },
  {
    id: "#ORD-003",
    date: "Mar 8, 12:00 PM",
    items: ["Chicken Biryani", "Gulab Jamun"],
    total: 400,
    status: "On the way",
    rating: null,
  },
  {
    id: "#ORD-004",
    date: "Mar 5, 6:45 PM",
    items: ["Paneer Tikka", "Veg Hakka Noodles"],
    total: 380,
    status: "Cancelled",
    rating: null,
  },
];
const statusCls = {
  Delivered: "bg-green-100 text-green-700",
  "On the way": "bg-blue-100 text-blue-600",
  Cancelled: "bg-red-100 text-red-500",
};

function About({ setPage }) {
  const navigate = useNavigate();
  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
            {/* HERO */}
            
      <div className="bg-gradient-to-br from-orange-500 to-amber-400 px-6 md:px-16 py-14 md:py-20 text-center">
                
        <h1 className="text-white font-black text-3xl md:text-5xl leading-tight">
                    About ServeMyMeal         
        </h1>
                
        <p className="text-white/80 text-base md:text-xl mt-4 max-w-2xl mx-auto leading-relaxed">
                    A web-based platform that connects users with professional
          home cooks and food providers — making fresh, hygienic food accessible
          to everyone.         
        </p>
              
      </div>
            
      <div className="max-w-4xl mx-auto px-4 md:px-8">
                {/* WHAT WE DO */}
                
        <div className="mt-10 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                    
          <h2 className="font-black text-gray-800 text-xl md:text-2xl mb-2">
            What is ServeMyMeal?
          </h2>
                    
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                        ServeMyMeal is an online home cook service platform that
            enables users to book professional cooks with scheduling, payment,
            and service management. Users can also browse meals from food
            providers, add items to their cart, and place orders with ease. The
            platform digitizes the entire food ordering workflow — reducing
            manual effort for both customers and providers.           
          </p>
                  
        </div>
                {/* HOW IT WORKS */}
                
        <div className="mt-6">
                    
          <h2 className="font-black text-gray-800 text-xl mb-4 text-center">
            How It Works
          </h2>
                    
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
            {[
              {
                icon: ShoppingCart,
                title: "Order Food Online",
                desc: "Browse menus from multiple food providers. Add your favourite dishes to cart and checkout in seconds. Pay via UPI, card, or COD.",
                color: "bg-orange-50 text-orange-500",
              },
              {
                icon: ChefHat,
                title: "Book a Home Cook",
                desc: "Choose a professional chef based on cuisine, rating, and price. They come to your home and cook your chosen dishes — fresh.",
                color: "bg-violet-50 text-violet-500",
              },
              {
                icon: Clock,
                title: "Schedule Your Meals",
                desc: "Pick a date, time, number of guests, and occasion. We handle the rest — cooking, ingredients, and cleanup.",
                color: "bg-teal-50 text-teal-500",
              },
              {
                icon: Truck,
                title: "Track Your Order",
                desc: "Real-time status updates from confirmation to delivery. Know exactly when your food will arrive.",
                color: "bg-blue-50 text-blue-500",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4"
              >
                                
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}
                >
                                    
                  <f.icon className="w-5 h-5" />
                                  
                </div>
                                
                <div>
                                    
                  <h3 className="font-bold text-gray-800 text-sm mb-1">
                    {f.title}
                  </h3>
                                    
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {f.desc}
                  </p>
                                  
                </div>
                              
              </div>
            ))}
                      
          </div>
                  
        </div>
                {/* STATS */}
                
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                    
          {[
            { value: "500+", label: "Happy Customers", icon: User },
            { value: "50+", label: "Home Cooks", icon: ChefHat },
            { value: "4.8★", label: "Avg Rating", icon: Star },
            { value: "100%", label: "Fresh & Hygienic", icon: Shield },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
            >
                            
              <s.icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            
              <p className="font-black text-gray-800 text-xl">{s.value}</p>
                            
              <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                          
            </div>
          ))}
                  
        </div>
                {/* WHY US */}
                
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    
          <h2 className="font-black text-gray-800 text-lg mb-4">
            Why ServeMyMeal?
          </h2>
                    
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        
            {[
              {
                icon: Shield,
                title: "Fresh & Hygienic",
                desc: "All cooks are verified. Ingredients are fresh and food is prepared hygienically.",
              },
              {
                icon: Clock,
                title: "On Time, Every Time",
                desc: "Punctual delivery and cook arrivals — we respect your schedule.",
              },
              {
                icon: Award,
                title: "Verified Cooks",
                desc: "All home cooks are background-checked, trained, and rated by customers.",
              },
              {
                icon: Users,
                title: "For Everyone",
                desc: "Whether ordering for one or booking a chef for 50 — ServeMyMeal scales to your needs.",
              },
            ].map((w) => (
              <div
                key={w.title}
                className="flex gap-3 p-3 bg-gray-50 rounded-xl"
              >
                                
                <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                                    
                  <w.icon className="w-4 h-4 text-orange-500" />
                                  
                </div>
                                
                <div>
                                    
                  <p className="font-bold text-gray-800 text-xs">{w.title}</p>
                                    
                  <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">
                    {w.desc}
                  </p>
                                  
                </div>
                              
              </div>
            ))}
                      
          </div>
                  
        </div>
                {/* CTA */}
                
        <div className="mt-6 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 text-center">
                    
          <h3 className="text-white font-black text-xl mb-1">
            Ready to get started?
          </h3>
                    
          <p className="text-white/80 text-sm mb-4">
            Order food or book a cook in minutes
          </p>
                    
          <div className="flex gap-3 justify-center flex-wrap">
                        
            <button
              onClick={() => navigate("/maincourse")}
              className="bg-white text-orange-500 font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition"
            >
              Order Food →
            </button>
                        
            <button
              onClick={() => navigate("/cook-booking")}
              className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-700 transition"
            >
              Book a Cook →
            </button>
                      
          </div>
                  
        </div>
                
        <div className="h-4" />
              
      </div>
          
    </div>
  );
}
/* ── EDIT PROFILE ── */
function EditProfile({ setPage, user }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob || "",
    gender: user?.gender || "male",
    bio: user?.bio || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      const res = await api("/auth/update", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      if (res.success) {
        T("Profile updated! ✅");
        setTimeout(() => window.location.reload(), 1000); // Reload to refresh AuthContext
      }
    } catch (err) {
      E(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      <SubHeader title="Edit Profile" onBack={() => setPage("home")} />
      <div className="px-4 md:px-8 mt-6 max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center border-2 border-orange-200">
              <User className="w-12 h-12 text-orange-400" />
            </div>
            <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
          {[
            {
              label: "Full Name",
              key: "name",
              type: "text",
              placeholder: "Your full name",
            },
            {
              label: "Email",
              key: "email",
              type: "email",
              placeholder: "email@example.com",
            },
            {
              label: "Phone",
              key: "phone",
              type: "tel",
              placeholder: "+91 98765 43210",
            },
            {
              label: "Date of Birth",
              key: "dob",
              type: "date",
              placeholder: "",
            },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
                {f.label}
              </label>
              <input
                type={f.type}
                value={form[f.key]}
                placeholder={f.placeholder}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Gender
            </label>
            <div className="flex gap-2">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  onClick={() => setForm({ ...form, gender: g })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize border transition-all ${form.gender === g ? "bg-orange-500 text-white border-orange-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 block">
              Bio
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none"
            />
          </div>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl hover:bg-orange-600 transition shadow-lg shadow-orange-200 mt-4 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

/* ── ADDRESS MODAL ── */
function AddressModal({ isOpen, onClose, address, onSave }) {
  const [form, setForm] = useState({
    label: "Home",
    street: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (address) {
      setForm({
        label: address.label || "Home",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        zip: address.zip || "",
        isDefault: address.isDefault || false,
      });
    } else {
      setForm({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
        isDefault: false,
      });
    }
  }, [address, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = address ? `/auth/address/${address._id}` : "/auth/address";
      const method = address ? "PUT" : "POST";

      const res = await api(url, {
        method,
        body: JSON.stringify(form),
      });

      if (res.success) {
        onSave();
        onClose();
        T(address ? "Address updated! ✅" : "Address added! ✅");
      }
    } catch (err) {
      E(err.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const labels = [
    { id: "Home", icon: Home },
    { id: "Work", icon: Briefcase },
    { id: "Other", icon: MapPin },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-black text-gray-800 text-lg">
            {address ? "Edit Address" : "Add New Address"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-400 rotate-180" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Label Selector */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
              Address Label
            </label>
            <div className="flex gap-2">
              {labels.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setForm({ ...form, label: l.id })}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl border transition-all ${
                    form.label === l.id
                      ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100"
                      : "bg-gray-50 text-gray-600 border-gray-100 hover:border-orange-200"
                  }`}
                >
                  <l.icon className="w-4 h-4" />
                  <span className="text-[10px] font-bold">{l.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                Full Street Address
              </label>
              <textarea
                required
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all outline-none resize-none"
                placeholder="House no, Building, Area"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                  City
                </label>
                <input
                  required
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all outline-none"
                  placeholder="e.g. Ahmedabad"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                  State
                </label>
                <input
                  required
                  type="text"
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all outline-none"
                  placeholder="e.g. Gujarat"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">
                Pincode
              </label>
              <input
                required
                type="text"
                value={form.zip}
                onChange={(e) => setForm({ ...form, zip: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm border border-transparent focus:bg-white focus:border-orange-300 focus:ring-4 focus:ring-orange-50 transition-all outline-none"
                placeholder="6-digit pincode"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              checked={form.isDefault}
              onChange={(e) =>
                setForm({ ...form, isDefault: e.target.checked })
              }
              className="w-5 h-5 rounded-lg border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-semibold text-gray-700 cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : address
                  ? "Update Address"
                  : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── ADDRESS ── */
function AddressPage({ setPage }) {
  const { user, refreshUser } = useAuth();
  const [modalType, setModalType] = useState(null); // 'add' or 'edit'
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  const addrs = user?.addresses || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    setLoadingAction(id);
    try {
      const res = await api(`/auth/address/${id}`, { method: "DELETE" });
      if (res.success) {
        await refreshUser();
        T("Address removed 🗑️");
      }
    } catch (err) {
      E(err.message || "Failed to delete address");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSetDefault = async (id) => {
    setLoadingAction(id);
    try {
      const res = await api(`/auth/address/${id}/default`, { method: "PATCH" });
      if (res.success) {
        await refreshUser();
        T("Default address updated 📍");
      }
    } catch (err) {
      E(err.message || "Failed to set default");
    } finally {
      setLoadingAction(null);
    }
  };

  const labels = {
    Home: "🏠",
    Work: "🏢",
    Other: "📍",
  };

  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      <SubHeader title="Delivery Addresses" onBack={() => setPage("home")} />

      <div className="px-4 md:px-8 mt-4 max-w-2xl mx-auto space-y-4">
        {addrs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-orange-400" />
            </div>
            <p className="text-gray-500 font-bold">No saved addresses found</p>
            <p className="text-gray-400 text-xs px-10 mt-1">
              Add your delivery address to start ordering fresh meals.
            </p>
          </div>
        ) : (
          addrs.map((a) => (
            <div
              key={a._id}
              className={`bg-white rounded-3xl p-5 shadow-sm border-2 transition-all group ${a.isDefault ? "border-orange-400 ring-4 ring-orange-400/5 shadow-orange-100" : "border-white hover:border-orange-100"}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg ${a.isDefault ? "bg-orange-500 text-white" : "bg-orange-50 text-orange-500"}`}
                  >
                    {labels[a.label] || "📍"}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800 text-sm">
                      {a.label}
                    </p>
                  </div>
                </div>
                {a.isDefault ? (
                  <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
                    Primary
                  </span>
                ) : (
                  <button
                    disabled={loadingAction === a._id}
                    onClick={() => handleSetDefault(a._id)}
                    className="text-[11px] font-bold text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    Set Default
                  </button>
                )}
              </div>

              <div className="bg-gray-50/50 rounded-2xl p-3 mb-4">
                <p className="text-gray-600 text-[13px] leading-relaxed font-medium">
                  {a.street}
                  <br />
                  <span className="text-gray-400 text-xs">
                    {a.city}, {a.state} - {a.zip}
                  </span>
                </p>
              </div>

              <div className="flex gap-4 pt-1">
                <button
                  onClick={() => {
                    setSelectedAddr(a);
                    setModalType("edit");
                  }}
                  className="flex items-center gap-1.5 text-xs text-orange-500 font-bold hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  disabled={loadingAction === a._id}
                  onClick={() => handleDelete(a._id)}
                  className="flex items-center gap-1.5 text-xs text-red-400 font-bold hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))
        )}

        {addrs.length < 5 && (
          <button
            onClick={() => {
              setSelectedAddr(null);
              setModalType("add");
            }}
            className="w-full h-20 border-2 border-dashed border-orange-200 rounded-3xl text-orange-500 font-bold text-sm flex flex-col items-center justify-center gap-1 hover:bg-orange-50 hover:border-orange-300 transition-all active:scale-[0.98]"
          >
            <MapPin className="w-5 h-5" />
            <span>Add New Address</span>
          </button>
        )}

        {addrs.length >= 5 && (
          <p className="text-center text-[11px] text-gray-400 font-medium">
            Reached maximum limit of 5 addresses.
          </p>
        )}
      </div>

      <AddressModal
        isOpen={!!modalType}
        onClose={() => setModalType(null)}
        address={selectedAddr}
        onSave={refreshUser}
      />
    </div>
  );
}

/* ── WALLET ── */
function WalletPage({ setPage }) {
  const txns = [
    {
      id: 1,
      label: "Order #ORD-001 cashback",
      amt: "+₹58",
      date: "Today",
      color: "text-green-600",
    },
    {
      id: 2,
      label: "Added via UPI",
      amt: "+₹200",
      date: "Mar 10",
      color: "text-green-600",
    },
    {
      id: 3,
      label: "Order #ORD-002 payment",
      amt: "-₹290",
      date: "Mar 8",
      color: "text-red-500",
    },
    {
      id: 4,
      label: "Referral bonus",
      amt: "+₹100",
      date: "Mar 5",
      color: "text-green-600",
    },
    {
      id: 5,
      label: "Order #ORD-004 refund",
      amt: "+₹380",
      date: "Mar 6",
      color: "text-green-600",
    },
  ];
  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      <SubHeader title="FoodieZone Wallet" onBack={() => setPage("home")} />
      <div className="px-4 md:px-8 mt-4 max-w-lg mx-auto">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-6 text-center mb-4 shadow-lg shadow-emerald-200">
          <p className="text-white/70 text-sm font-medium">Available Balance</p>
          <p className="text-white font-black text-4xl mt-1">₹340</p>
          <button
            onClick={() => T("Add money feature coming soon!")}
            className="mt-4 bg-white text-emerald-600 font-bold px-6 py-2 rounded-xl text-sm hover:shadow-md transition"
          >
            + Add Money
          </button>
        </div>
        <h3 className="font-bold text-gray-700 text-sm mb-3">
          Transaction History
        </h3>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          {txns.map((t, i) => (
            <div
              key={t.id}
              className={`flex justify-between items-center px-4 py-3.5 ${i > 0 ? "border-t border-gray-50" : ""}`}
            >
              <div>
                <p className="font-semibold text-gray-700 text-sm">{t.label}</p>
                <p className="text-gray-400 text-xs mt-0.5">{t.date}</p>
              </div>
              <span className={`font-extrabold text-base ${t.color}`}>
                {t.amt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── SAVED DISHES ── */
function SavedDishes({ setPage }) {
  const saved = [
    {
      name: "Butter Chicken",
      price: 320,
      img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&q=80",
    },
    {
      name: "Masala Dosa",
      price: 120,
      img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200&q=80",
    },
    {
      name: "Chocolate Lava Cake",
      price: 180,
      img: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=200&q=80",
    },
    {
      name: "Mango Lassi",
      price: 100,
      img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=200&q=80",
    },
  ];
  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      <SubHeader title="Saved Dishes" onBack={() => setPage("home")} />
      <div className="px-4 md:px-8 mt-4 max-w-2xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-3">
        {saved.map((d) => (
          <div
            key={d.name}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
          >
            <img
              src={d.img}
              alt={d.name}
              className="w-full h-28 object-cover"
            />
            <div className="p-3">
              <p className="font-bold text-gray-800 text-sm">{d.name}</p>
              <div className="flex justify-between items-center mt-2">
                <span className="font-extrabold text-orange-500">
                  ₹{d.price}
                </span>
                <button
                  onClick={() => T("Added to cart! 🛒", "🛒")}
                  className="bg-orange-500 text-white text-xs font-bold px-2.5 py-1.5 rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function Changepassword({ setPage }) {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [loading, setLoading] = useState(false);

  const handleChangePassword = (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error("Please fill all fields.");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (form.newPassword.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      const user = JSON.parse(localStorage.getItem("user"));

      if (user && user.password !== form.currentPassword) {
        toast.error("Current password is incorrect");
        return;
      }

      if (user) {
        user.password = form.newPassword;
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Password changed successfully 🔐");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      navigate("/login");
    }, 800);
  };

  const Input = ({ placeholder, value, onChange, toggle, setToggle }) => (
    <div className="relative">
      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

      <input
        type={toggle ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-xl text-sm border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-200"
      />

      <button
        type="button"
        onClick={() => setToggle(!toggle)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2"
      >
        {toggle ? (
          <EyeOff className="w-4 h-4 text-gray-400" />
        ) : (
          <Eye className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6">
        <button
          onClick={() => setPage("home")}
          className="mb-4 flex items-center text-gray-500 hover:text-orange-500 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-extrabold text-orange-500">
            Change Password
          </h1>
          <p className="text-sm text-gray-400">Update your account password</p>
        </div>

        <form className="space-y-4" onSubmit={handleChangePassword}>
          <Input
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
            toggle={show.current}
            setToggle={(val) => setShow({ ...show, current: val })}
          />

          <Input
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            toggle={show.new}
            setToggle={(val) => setShow({ ...show, new: val })}
          />

          <Input
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
            toggle={show.confirm}
            setToggle={(val) => setShow({ ...show, confirm: val })}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            {loading ? "Updating..." : "Change Password"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-5">
          Back to{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-orange-500 font-semibold cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
} /* ── SIMPLE PAGES ── */
function SimplePage({ title, onBack, children }) {
  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      <SubHeader title={title} onBack={onBack} />
      <div className="px-4 md:px-8 mt-4 max-w-4xl mx-auto">{children}</div>
    </div>
  );
}

/* ── ROOT ── */
export default function Profile() {
  const [page, setPage] = useState("home");
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        const res = await api(`/auth/delete/${user.id}`, {
          method: "DELETE",
        });
        if (res.success) {
          toast.success("Account deleted successfully");
          logout();
          navigate("/login");
        }
      } catch (err) {
        toast.error("Failed to delete account");
      }
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  if (!user && page === "home") {
    navigate("/login");
    return null;
  }

  if (page === "home")
    return (
      <ProfileHome
        setPage={setPage}
        user={user}
        logout={logout}
        onDelete={handleDelete}
      />
    );
  if (page === "orders") return <MyOrders setPage={setPage} />;
  if (page === "edit") return <EditProfile setPage={setPage} user={user} />;
  if (page === "address") return <AddressPage setPage={setPage} />;
  if (page === "wallet") return <WalletPage setPage={setPage} />;
  if (page === "rewards") return <RewardsPage setPage={setPage} />;
  if (page === "saved") return <SavedDishes setPage={setPage} />;
  if (page === "Changepassword") return <Changepassword setPage={setPage} />;
  if (page === "cook")
    return (() => {
      window.location.href = "/cook-booking";
      return null;
    })();

  if (page === "payment")
    return (
      <SimplePage title="Payment Methods" onBack={() => setPage("home")}>
        <div className="space-y-3">
          {[
            {
              l: "Google Pay",
              s: "Linked UPI · Default",
              c: "bg-green-50 text-green-500",
            },
            {
              l: "HDFC Debit Card",
              s: "•••• 4532 · Visa",
              c: "bg-purple-50 text-purple-500",
            },
          ].map((c) => (
            <div
              key={c.l}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-gray-100"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.c}`}
              >
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{c.l}</p>
                <p className="text-gray-400 text-xs">{c.s}</p>
              </div>
              <button className="text-xs text-red-400 font-semibold">
                Remove
              </button>
            </div>
          ))}
          <button className="w-full border-2 border-dashed border-orange-300 rounded-2xl p-4 text-orange-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-orange-50">
            + Add Payment Method
          </button>
        </div>
      </SimplePage>
    );

  if (page === "notifs")
    return (
      <SimplePage title="Notifications" onBack={() => setPage("home")}>
        <div className="space-y-2">
          {[
            ["Order updates", true],
            ["Promotions & offers", true],
            ["New dishes", false],
            ["Cook booking", true],
            ["Weekly digest", false],
          ].map(([l, on]) => (
            <div
              key={l}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between border border-gray-100"
            >
              <p className="font-semibold text-gray-700 text-sm">{l}</p>
              <div
                className={`w-10 h-5 rounded-full relative cursor-pointer ${on ? "bg-orange-500" : "bg-gray-200"}`}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? "left-5" : "left-0.5"}`}
                />
              </div>
            </div>
          ))}
        </div>
      </SimplePage>
    );

  if (page === "contact")
    return (
      <SimplePage title="Contact Us" onBack={() => setPage("home")}>
        <div className="space-y-3">
          {[
            {
              icon: Phone,
              l: "Call Support",
              s: "+91 1800-XXX-XXXX",
              c: "bg-green-50 text-green-600",
            },
            {
              icon: Mail,
              l: "Email Us",
              s: "support@foodiezone.com",
              c: "bg-blue-50 text-blue-600",
            },
          ].map((c) => (
            <div
              key={c.l}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-gray-100"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.c}`}
              >
                <c.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{c.l}</p>
                <p className="text-gray-400 text-xs">{c.s}</p>
              </div>
            </div>
          ))}
        </div>
      </SimplePage>
    );

  if (page === "About")
    return (
      <SimplePage title="About us" onBack={() => setPage("About")}>
        <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
                
          <div className="w-full mx-auto px-4 md:px-8">
                    {/* WHAT WE DO */}
                    
            <div className="mt-10 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        
              <h2 className="font-black text-gray-800 text-xl md:text-2xl mb-2">
                What is ServeMyMeal?
              </h2>
                        
              <p className="text-gray-500 text-sm md:text-base leading-relaxed">
                            ServeMyMeal is an online home cook service platform
                that enables users to book professional cooks with scheduling,
                payment, and service management. Users can also browse meals
                from food providers, add items to their cart, and place orders
                with ease. The platform digitizes the entire food ordering
                workflow — reducing manual effort for both customers and
                providers.           
              </p>
                      
            </div>
                    {/* HOW IT WORKS */}
                    
            <div className="mt-6">
                        
              <h2 className="font-black text-gray-800 text-xl mb-4 text-center">
                How It Works
              </h2>
                        
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                {[
                  {
                    icon: ShoppingCart,
                    title: "Order Food Online",
                    desc: "Browse menus from multiple food providers. Add your favourite dishes to cart and checkout in seconds. Pay via UPI, card, or COD.",
                    color: "bg-orange-50 text-orange-500",
                  },
                  {
                    icon: ChefHat,
                    title: "Book a Home Cook",
                    desc: "Choose a professional chef based on cuisine, rating, and price. They come to your home and cook your chosen dishes — fresh.",
                    color: "bg-violet-50 text-violet-500",
                  },
                  {
                    icon: Clock,
                    title: "Schedule Your Meals",
                    desc: "Pick a date, time, number of guests, and occasion. We handle the rest — cooking, ingredients, and cleanup.",
                    color: "bg-teal-50 text-teal-500",
                  },
                  {
                    icon: Truck,
                    title: "Track Your Order",
                    desc: "Real-time status updates from confirmation to delivery. Know exactly when your food will arrive.",
                    color: "bg-blue-50 text-blue-500",
                  },
                ].map((f) => (
                  <div
                    key={f.title}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex gap-4"
                  >
                                    
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${f.color}`}
                    >
                                        
                      <f.icon className="w-5 h-5" />
                                      
                    </div>
                                    
                    <div>
                                        
                      <h3 className="font-bold text-gray-800 text-sm mb-1">
                        {f.title}
                      </h3>
                                        
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {f.desc}
                      </p>
                                      
                    </div>
                                  
                  </div>
                ))}
                          
              </div>
                      
            </div>
                    {/* STATS */}
                    
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                        
              {[
                { value: "500+", label: "Happy Customers", icon: User },
                { value: "50+", label: "Home Cooks", icon: ChefHat },
                { value: "4.8★", label: "Avg Rating", icon: Star },
                { value: "100%", label: "Fresh & Hygienic", icon: Shield },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-center"
                >
                                
                  <s.icon className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                                
                  <p className="font-black text-gray-800 text-xl">{s.value}</p>
                                
                  <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
                              
                </div>
              ))}
                      
            </div>
                    {/* WHY US */}
                    
            <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        
              <h2 className="font-black text-gray-800 text-lg mb-4">
                Why ServeMyMeal?
              </h2>
                        
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            
                {[
                  {
                    icon: Shield,
                    title: "Fresh & Hygienic",
                    desc: "All cooks are verified. Ingredients are fresh and food is prepared hygienically.",
                  },
                  {
                    icon: Clock,
                    title: "On Time, Every Time",
                    desc: "Punctual delivery and cook arrivals — we respect your schedule.",
                  },
                  {
                    icon: Award,
                    title: "Verified Cooks",
                    desc: "All home cooks are background-checked, trained, and rated by customers.",
                  },
                  {
                    icon: User,
                    title: "For Everyone",
                    desc: "Whether ordering for one or booking a chef for 50 — ServeMyMeal scales to your needs.",
                  },
                ].map((w) => (
                  <div
                    key={w.title}
                    className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                  >
                                    
                    <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center shrink-0">
                                        
                      <w.icon className="w-4 h-4 text-orange-500" />
                                      
                    </div>
                                    
                    <div>
                                        
                      <p className="font-bold text-gray-800 text-xs">
                        {w.title}
                      </p>
                                        
                      <p className="text-gray-400 text-[11px] mt-0.5 leading-relaxed">
                        {w.desc}
                      </p>
                                      
                    </div>
                                  
                  </div>
                ))}
                          
              </div>
                      
            </div>
                    {/* CTA */}
                    
            <div className="mt-6 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 text-center">
                        
              <h3 className="text-white font-black text-xl mb-1">
                Ready to get started?
              </h3>
                        
              <p className="text-white/80 text-sm mb-4">
                Order food or book a cook in minutes
              </p>
                        
              <div className="flex gap-3 justify-center flex-wrap">
                            
                <button
                  onClick={() => navigate("/maincourse")}
                  className="bg-white text-orange-500 font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition"
                >
                  Order Food →
                </button>
                            
                <button
                  onClick={() => navigate("/cook-booking")}
                  className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-700 transition"
                >
                  Book a Cook →
                </button>
                          
              </div>
                      
            </div>
                    
            <div className="h-4" />
                  
          </div>
              
        </div>
      </SimplePage>
    );

  if (page === "faq")
    return (
      <SimplePage title="Help & FAQs" onBack={() => setPage("home")}>
        <div className="space-y-2">
          {[
            "How do I track my order?",
            "Can I cancel my order?",
            "What are delivery charges?",
            "How do refunds work?",
            "How to apply promo codes?",
            "How to book a cook?",
            "What if my order is late?",
          ].map((q) => (
            <div
              key={q}
              className="bg-white rounded-2xl px-4 py-3.5 flex items-center justify-between border border-gray-100 cursor-pointer hover:bg-gray-50"
            >
              <p className="text-sm font-medium text-gray-700">{q}</p>
              <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
            </div>
          ))}
        </div>
      </SimplePage>
    );

  return null;
}
