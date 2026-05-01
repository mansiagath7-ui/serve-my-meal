import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Home, ShoppingCart, User, UtensilsCrossed,
  Package, ChevronDown, Bell, X, ChefHat, Leaf
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const menuCategories = [
  { to: "/starters", label: "Starters", },
  { to: "/maincourse", label: "Main Course", },
  { to: "/southindian", label: "South Indian", },
  { to: "/indochinese", label: "Indo Chinese", },
  { to: "/dessert", label: "Dessert", },
  { to: "/beverages", label: "Beverages", },
  { to: "/veg", label: "Only Veg", },
];

const notifications = [
  { id: 1, title: "Order Delivered! 🎉", body: "Your Butter Chicken is here.", time: "2m ago", unread: true },
  { id: 2, title: "30% OFF Today!", body: "On all starters. Limited time.", time: "1h ago", unread: true },
  { id: 3, title: "Order Confirmed", body: "#ORD-002 is being prepared.", time: "Yesterday", unread: false },
];

export default function Header() {
  const { count } = useCart();
  const { user } = useAuth();
  const [catOpen, setCatOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(notifications);
  const location = useLocation();
  const notifRef = useRef(null);
  const catRef = useRef(null);

  useEffect(() => { setCatOpen(false); setNotifOpen(false); }, [location]);

  useEffect(() => {
    const h = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const unread = notifs.filter((n) => n.unread).length;
  const markAll = () => setNotifs(notifs.map((n) => ({ ...n, unread: false })));

  const navCls = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${isActive ? "bg-orange-500 text-white shadow-md" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
    }`;

  const NotifPanel = ({ mobile }) => (
    <div className={`absolute right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[60] overflow-hidden ${mobile ? "w-72" : "w-80"}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-bold text-gray-800 text-sm">Notifications {unread > 0 && <span className="bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5 ml-1">{unread}</span>}</h3>
        <button onClick={() => setNotifOpen(false)}><X className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
      </div>
      <div className="max-h-72 overflow-y-auto">
        {notifs.map((n) => (
          <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 transition-colors ${n.unread ? "bg-orange-50/40" : "bg-white"}`}>
            <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.unread ? "bg-orange-500" : "bg-gray-200"}`} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 text-xs leading-tight">{n.title}</p>
              <p className="text-gray-500 text-xs mt-0.5">{n.body}</p>
              <p className="text-gray-400 text-[10px] mt-1">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-2.5 border-t border-gray-50 flex justify-between">
        <button onClick={markAll} className="text-orange-500 text-xs font-semibold hover:underline">Mark all as read</button>
        <button className="text-gray-400 text-xs hover:text-gray-600">View all</button>
      </div>
    </div>
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const [dynamicCategories, setDynamicCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api("/categories?adminOnly=true");
        if (res.success) setDynamicCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch menu categories", err);
      }
    };
    fetchCats();
  }, []);

  return (
    <>
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-16 items-center px-6 gap-3 shadow-sm">
        <NavLink to="/" className="flex items-center mr-3 shrink-0 group">
          <img
            src="/Logo.png"
            alt="FoodieZone"
            className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            loading="eager"
          />
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navCls}><Home className="w-4 h-4" /> Home</NavLink>
          <NavLink to="/menu" className={navCls}><UtensilsCrossed className="w-4 h-4" /> Menu</NavLink>

          {/* Menu dropdown */}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen(!catOpen)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${catOpen ? "bg-orange-50 text-orange-500" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`}
            >
              Menu <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 w-52 z-[60]">
                {dynamicCategories.map((cat) => (
                  <NavLink key={cat._id} to={`/menu/${cat.name}`}
                    className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all ${isActive ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`}
                  >
                    <span className="text-base">{cat.name}</span>
                  </NavLink>
                ))}
                {/* Special link for Veg */}
                <NavLink to="/veg"
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 text-sm font-bold border-t border-gray-50 mt-1 transition-all ${isActive ? "bg-green-50 text-green-600" : "text-green-600 hover:bg-green-50"}`}
                >
                  <Leaf className="w-4 h-4" />
                  <span className="text-base">Only Veg</span>
                </NavLink>
              </div>
            )}
          </div>

          <NavLink to="/orders" className={navCls}><Package className="w-4 h-4" /> Orders</NavLink>
          <NavLink to="/cook-booking" className={navCls}><ChefHat className="w-4 h-4" /> Book a Cook</NavLink>
          <NavLink to="/veg" className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all whitespace-nowrap ${isActive ? "bg-green-500 text-white shadow-md" : "text-green-600 hover:bg-green-50"}`}>
            <Leaf className="w-4 h-4" /> Only Veg
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Notif */}
          <div className="relative" ref={notifRef}>
            <button onClick={() => { setNotifOpen(!notifOpen); setCatOpen(false); }}
              className="relative w-9 h-9 rounded-xl bg-gray-50 hover:bg-orange-50 flex items-center justify-center transition-all">
              <Bell className="w-4 h-4 text-gray-600" />
              {unread > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{unread}</span>}
            </button>
            {notifOpen && <NotifPanel />}
          </div>

          <NavLink to="/cart" className="relative w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <ShoppingCart className="w-4 h-4 text-orange-500" />
            {count > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{count}</span>}
          </NavLink>


          {user ? (
            <NavLink to="/profile"
              className={({ isActive }) => `flex items-center gap-2 px-3 py-2 rounded-xl font-semibold text-sm transition-all ${isActive ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"}`}>
              <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-amber-300 rounded-lg flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <span>Profile</span>
            </NavLink>
          ) : (
            <NavLink to="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-all">
              Login
            </NavLink>
          )}
        </div>
      </header>

      {/* ── MOBILE HEADER ── */}
      <nav className="md:hidden fixed bottom-0 top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-4 shadow-sm">
        <NavLink to="/" className="flex items-center">
          <img
            src="/Logo.png"
            alt="FoodieZone"
            className="h-8 w-auto object-contain"
            loading="eager"
          />
        </NavLink>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="relative" ref={notifRef}>
            <button onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-gray-600" />
              {unread > 0 && <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">{unread}</span>}
            </button>
            {notifOpen && <NotifPanel mobile />}
          </div>
          {/*  */}
          <button
  onClick={() => setMenuOpen(true)}
  className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"
>
  ⋮
</button>
        </div>
      </nav>

      {menuOpen && (
  <div className="fixed inset-0 z-[60] bg-black/30">
    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-4">
      
      {/* Close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">Menu</h2>
        <button onClick={() => setMenuOpen(false)}>
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        {dynamicCategories.map((cat) => (
          <NavLink
            key={cat._id}
            to={`/menu/${cat.name}`}
            onClick={() => setMenuOpen(false)}
            className="block p-3 rounded-xl bg-gray-100 font-semibold text-sm"
          >
            {cat.name}
          </NavLink>
        ))}
      </div>

      {/* Extra options */}
      <div className="mt-6 border-t pt-4 space-y-2">
        <NavLink to="/cart" onClick={() => setMenuOpen(false)} className="block text-sm">Cart</NavLink>
        <NavLink to="/orders" onClick={() => setMenuOpen(false)} className="block text-sm">Orders</NavLink>
        {user ? (
          <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="block text-sm">Profile</NavLink>
        ) : (
          <NavLink to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-orange-500 font-bold">Login</NavLink>
        )}
      </div>

    </div>
  </div>
)}

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 shadow-lg">
        <div className="flex items-center justify-around px-1 py-1.5">
          {[
            { to: "/", icon: Home, label: "Home", end: true },
            { to: "/cart", icon: ShoppingCart, label: "Cart" },
            { to: "/cook-booking", icon: ChefHat, label: "Cook" },
            { to: "/orders", icon: Package, label: "Orders" },
            user ? { to: "/profile", icon: User, label: "Profile" } : { to: "/login", icon: User, label: "Login" },
          ].map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => `flex flex-col items-center gap-0.5 py-1.5 px-2.5 rounded-xl transition-all ${isActive ? "text-orange-500" : "text-gray-400 hover:text-gray-600"}`}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {label === "Cart" && count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{count}</span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
