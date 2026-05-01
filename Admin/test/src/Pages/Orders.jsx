import React, { useEffect, useState } from "react";
import { Search, Filter, Loader2, AlertCircle, Clock } from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

const statusStyle = {
  New: "bg-orange-100 text-orange-600",
  Preparing: "bg-amber-100 text-amber-600",
  Ready: "bg-blue-100 text-blue-600",
  Delivered: "bg-green-100 text-green-600",
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

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api("/orders");
      if (response.success) {
        setOrders(response.data);
      }
    } catch (err) {
      console.error("Fetch orders failed:", err);
      setError("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const response = await api(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });

      if (response.success) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        toast.success(`Order marked as ${newStatus}`);
      }
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchTab = tab === "All" || order.status === tab;
    const customerName = order.userId?.name || "Unknown";
    const matchSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800">{error}</h2>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">All Orders</h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search by name or ID..."
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
                {[
                  "All",
                  "New",
                  "Preparing",
                  "Ready",
                  "Delivered",
                  "Cancelled",
                ].map((f) => (
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
        {["All", "New", "Preparing", "Ready", "Delivered", "Cancelled"].map(
          (t) => (
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
          ),
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Head */}
        <div className="grid grid-cols-6 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50/50 border-b border-gray-50">
          <span>Customer</span>
          <span>Order ID</span>
          <span>Dish</span>
          <span>Amount</span>
          <span>Time</span>
          <span className="text-right pr-4">Status & Action</span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-gray-50">
          {filteredOrders.length === 0 ? (
            <div className="py-20 text-center">
              <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No orders found</p>
            </div>
          ) : (
            filteredOrders.map((o) => {
              const customerName = o.userId?.name || "Deleted User";
              const dishLabel =
                o.items.length > 0
                  ? `${o.items[0].name}${o.items.length > 1 ? ` + ${o.items.length - 1} more` : ""}`
                  : "No Items";

              return (
                <div
                  key={o._id}
                  className="grid grid-cols-6 px-8 py-5 items-center text-sm hover:bg-gray-50/50 transition-colors relative group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-xs border border-orange-100">
                      {customerName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-black text-gray-800 tracking-tight">
                        {customerName}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        {o.userId?.email || ""}
                      </span>
                    </div>
                  </div>

                  <span className="text-gray-400 font-bold text-[11px] tabular-nums">
                    #{o._id.slice(-8).toUpperCase()}
                  </span>

                  <div className="flex flex-col">
                    <span className="text-gray-600 font-bold">{dishLabel}</span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {o.items.length} items total
                    </span>
                  </div>

                  <span className="font-black text-gray-800">
                    ₹{o.totalAmount}
                  </span>

                  <div className="flex flex-col">
                    <span className="text-gray-600 font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3 text-orange-400" />
                      {getRelativeTime(o.createdAt)}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">
                      {new Date(o.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-3 pr-2">
                    {updatingId === o._id ? (
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    ) : (
                      <div className="relative group/status">
                        <span
                          className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl border border-transparent shadow-sm transition-all cursor-pointer ${statusStyle[o.status]}`}
                        >
                          {o.status}
                        </span>

                        {/* Status Change Dropdown (Hover) */}
                        <div className="absolute right-0 top-full mt-1 hidden group-hover/status:block bg-white shadow-2xl rounded-2xl border border-gray-100 z-20 py-2 w-36">
                          {[
                            "New",
                            "Preparing",
                            "Ready",
                            "Delivered",
                            "Cancelled",
                          ].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleStatusUpdate(o._id, s)}
                              className={`block w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-orange-50 transition-colors ${o.status === s ? "text-orange-500 bg-orange-50" : "text-gray-400"}`}
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
          <div className="flex gap-2">
            <button
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors disabled:opacity-30"
              disabled
            >
              Previous
            </button>
            <button className="px-4 py-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors">
              Next
            </button>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
            Total {filteredOrders.length} Orders Found
          </span>
        </div>
      </div>
    </div>
  );
}
