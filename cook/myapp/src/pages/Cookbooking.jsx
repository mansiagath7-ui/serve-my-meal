import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { toast } from "react-hot-toast";

const tabs = ["All", "Paid", "Confirmed", "Completed", "Cancelled"];

const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-600",
  Paid: "bg-orange-100 text-orange-600",
  Confirmed: "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-600",
};

const Cookbooking = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api("/bookings/my-chef-bookings");
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch bookings", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await api(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.success) {
        toast.success(`Booking ${newStatus}`);
        fetchBookings();
      } else {
        toast.error(res.message || "Failed to update status");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const filteredBookings =
    activeTab === "All"
      ? bookings
      : bookings.filter((item) => item.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* 🔹 Mobile Menu Button */}
      <div className="flex justify-between items-center mb-4 md:hidden">
        <h1 className="text-xl font-bold">Cook Bookings</h1>
      </div>

      {/* 🔹 Title (Desktop) */}
      <h1 className="hidden md:block text-2xl font-bold mb-6">Cook Bookings</h1>

      {/* 🔹 Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-orange-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 shadow"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 🔹 Booking Cards */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading bookings...</p>
          </div>
        ) : filteredBookings.length > 0 ? (
          filteredBookings.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition-all hover:shadow-md"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-orange-100 text-orange-600 flex items-center justify-center rounded-2xl font-black text-lg">
                  {item.userId?.name?.charAt(0) || "U"}
                </div>

                <div>
                  <h3 className="font-bold text-gray-800 text-base md:text-lg">
                    {item.userId?.name || "Unknown User"}{" "}
                    <span className="text-gray-400 font-medium text-xs">
                      #{item._id.slice(-6).toUpperCase()}
                    </span>
                  </h3>

                  <p className="text-gray-500 text-xs md:text-sm mt-0.5">
                    {new Date(item.date).toLocaleDateString()} at {item.time} •{" "}
                    {item.guests} guests • {item.occasion}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.dishes.map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium"
                      >
                        {d.name} x{d.quantity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div className="flex flex-row md:flex-col justify-between items-center md:items-end gap-3 pt-3 md:pt-0 border-t md:border-none border-gray-50">
                <div className="text-right">
                  <h3 className="font-black text-orange-500 text-xl md:text-2xl">
                    ₹{item.totalAmount}
                  </h3>
                  <span
                    className={`text-[10px] md:text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      statusStyle[item.status]
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {item.status === "Paid" && (
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleUpdateStatus(item._id, "Confirmed")}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-green-100"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(item._id, "Cancelled")}
                      className="bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold px-4 py-2 rounded-xl transition-all"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {item.status === "Confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(item._id, "Completed")}
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-100"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-4xl mb-4">📅</p>
            <p className="text-gray-400 font-bold">
              No {activeTab !== "All" ? activeTab : ""} bookings found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cookbooking;
