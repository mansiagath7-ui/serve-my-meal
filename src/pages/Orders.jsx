import React, { useEffect, useState } from "react";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  Calendar,
  ChefHat,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const statusColors = {
  New: "bg-orange-100 text-orange-600",
  Preparing: "bg-amber-100 text-amber-600",
  Ready: "bg-blue-100 text-blue-600",
  Delivered: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-500",
  Pending: "bg-orange-100 text-orange-600",
  Confirmed: "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, bookingsRes] = await Promise.all([
        api("/orders/my-orders"),
        api("/bookings/my-bookings"),
      ]);
      
      if (ordersRes.success) setOrders(ordersRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load your history. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6 bg-gray-50 min-h-screen">
      <div className="sticky top-14 md:top-16 z-20 bg-white border-b border-orange-50 px-4 md:px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <h1 className="text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" /> My Activity
          </h1>
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "orders" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400"}`}
            >
              Meals
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTab === "bookings" ? "bg-white text-orange-500 shadow-sm" : "text-gray-400"}`}
            >
              Chef
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 mt-4 max-w-2xl mx-auto space-y-3">
        {activeTab === "orders" ? (
          orders.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Package className="w-12 h-12 text-orange-200 mb-4" />
              <h3 className="font-bold text-gray-800">No meal orders yet</h3>
              <button onClick={() => navigate("/")} className="mt-4 text-orange-500 text-sm font-bold">Browse Menu</button>
            </div>
          ) : (
            orders.map((o) => (
              <div key={o._id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-black text-gray-800 text-sm tracking-tight uppercase">Order #{o._id.slice(-8)}</p>
                    <p className="text-gray-400 text-[10px] font-bold mt-1 uppercase tracking-wider">
                      {new Date(o.createdAt).toLocaleDateString()} · {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${statusColors[o.status] || "bg-gray-100 text-gray-400"}`}>
                    {o.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {o.items.map((i, idx) => (
                    <span key={idx} className="text-[10px] bg-gray-50 text-gray-600 font-bold px-2.5 py-1 rounded-lg border border-gray-100">
                      {i.name} ×{i.quantity}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Total Paid</span>
                    <span className="font-black text-orange-500 text-lg">₹{o.totalAmount}</span>
                  </div>
                  <button onClick={() => navigate("/")} className="text-xs bg-orange-500 text-white font-bold px-4 py-2 rounded-xl transition">Reorder</button>
                </div>
              </div>
            ))
          )
        ) : (
          bookings.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <Calendar className="w-12 h-12 text-orange-200 mb-4" />
              <h3 className="font-bold text-gray-800">No chef bookings yet</h3>
              <button onClick={() => navigate("/cook-booking")} className="mt-4 text-orange-500 text-sm font-bold">Book a Chef</button>
            </div>
          ) : (
            bookings.map((b) => (
              <div key={b._id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-50 group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 overflow-hidden">
                      {b.cookId?.profileImage ? (
                        <img src={`http://localhost:5000${b.cookId.profileImage}`} className="w-full h-full object-cover" alt="" />
                      ) : <ChefHat size={24} />}
                    </div>
                    <div>
                      <p className="font-black text-gray-800 text-sm tracking-tight">{b.cookId?.name || "Professional Chef"}</p>
                      <p className="text-gray-400 text-[10px] font-bold flex items-center gap-1 mt-0.5 uppercase tracking-wider">
                        <Calendar size={10} /> {new Date(b.date).toLocaleDateString()} · <Clock size={10} /> {b.time}
                      </p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${statusColors[b.status] || "bg-gray-100 text-gray-500"}`}>
                    {b.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-4 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Occasion</span>
                        <span className="text-xs font-bold text-gray-700">{b.occasion || "General"}</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Guests</span>
                        <span className="text-xs font-bold text-gray-700">{b.guests} People</span>
                    </div>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Dishes</span>
                        <span className="text-xs font-bold text-gray-700">{b.dishes.length} Items</span>
                    </div>
                </div>
                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-1">Estimated Total</span>
                    <span className="font-black text-orange-500 text-lg">₹{b.totalAmount}</span>
                  </div>
                  <button className="text-xs bg-white text-gray-500 font-bold px-4 py-2 rounded-xl border border-gray-200 transition">View Details</button>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
}
