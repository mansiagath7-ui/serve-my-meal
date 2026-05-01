import React, { useEffect, useState } from "react";
import { Search, Filter, Loader2, AlertCircle, Clock, Calendar, Users } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const statusStyle = {
  Pending: "bg-orange-50 text-orange-400",
  Paid: "bg-orange-100 text-orange-600",
  Confirmed: "bg-blue-100 text-blue-600",
  Completed: "bg-green-100 text-green-600",
  Cancelled: "bg-red-100 text-red-500",
};


const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now - date;
  const diffInMins = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMins < 1) return "Just now";
  if (diffInMins < 60) return `${diffInMins}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

export default function BookingsTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await api("/bookings/all");
      if (response.success) {
        setBookings(response.data);
      }
    } catch (err) {
      console.error("Fetch bookings failed:", err);
      setError("Failed to fetch bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      const response = await api(`/bookings/${bookingId}/status`, {
        method: 'PATCH',
        body: { status: newStatus }
      });

      if (response.success) {
        setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
        toast.success(`Booking status updated to ${newStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchTab = tab === "All" || booking.status === tab;
    const customerName = booking.userId?.name || "Unknown";
    const chefName = booking.cookId?.name || "Unknown";
    const matchSearch = customerName.toLowerCase().includes(search.toLowerCase()) || 
                      chefName.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading chef bookings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">{error}</h2>
        <button onClick={fetchBookings} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Chef Bookings</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search chef or user..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-xl text-sm w-64 transition-all bg-white"
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" /> Filter
            </button>

            {filterOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-2xl border text-sm z-50 py-2">
                {["All", "Pending", "Paid", "Confirmed", "Completed", "Cancelled"].map(f => (
                  <button
                    key={f}
                    onClick={() => {
                      setTab(f);
                      setFilterOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2.5 hover:bg-orange-50 transition-colors ${tab === f ? "text-orange-500 font-bold" : "text-gray-600"}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {["All", "Pending", "Paid", "Confirmed", "Completed", "Cancelled"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              tab === t
                ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-105"
                : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-6 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-50">
          <span>Customer</span>
          <span>Chef Info</span>
          <span>Appointment</span>
          <span>Dish / Guests</span>
          <span>Amount</span>
          <span className="text-right pr-4">Status & Action</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {filteredBookings.length === 0 ? (
            <div className="py-20 text-center text-gray-400 italic">
              No chef bookings found.
            </div>
          ) : (
            filteredBookings.map((b) => {
              const customerName = b.userId?.name || "Deleted User";
              const chefName = b.cookId?.name || "Unknown Chef";
              
              return (
                <div key={b._id} className="grid grid-cols-6 px-8 py-5 items-center text-sm hover:bg-gray-50/50 transition-colors relative group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 font-black text-xs border border-blue-100">
                      {customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 tracking-tight">{customerName}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{b.userId?.email || ""}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-xs border border-orange-100">
                      {chefName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 tracking-tight">{chefName}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Professional Chef</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-gray-600 font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      {new Date(b.date).toLocaleDateString()}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {b.time}
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-gray-600 font-bold truncate">
                        {b.dishes.length > 0 ? b.dishes[0].name : "Custom Menu"}
                    </span>
                    <span className="text-[10px] text-gray-400 font-black flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {b.guests} Guests
                    </span>
                  </div>

                  <span className="font-black text-gray-800">₹{b.totalAmount}</span>

                  <div className="flex items-center justify-end gap-3 pr-2">
                    {updatingId === b._id ? (
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    ) : (
                      <div className="relative group/status">
                        <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-transparent shadow-sm transition-all cursor-pointer ${statusStyle[b.status]}`}>
                          {b.status}
                        </span>
                        
                        {/* Status Change Dropdown */}
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/status:block bg-white shadow-2xl rounded-2xl border border-gray-100 z-20 py-2 w-36">
                          {["Pending", "Paid", "Confirmed", "Completed", "Cancelled"].map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusUpdate(b._id, s)}
                              className={`block w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-colors ${b.status === s ? "text-orange-500 bg-orange-50" : "text-gray-400"}`}
                            >
                              Mark {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-8 py-5 bg-gray-50/30 border-t border-gray-50">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total {filteredBookings.length} Bookings Found</span>
          <p className="text-[10px] text-gray-400 font-bold">* Hover on status to change</p>
        </div>
      </div>
    </div>
  );
}
