import React, { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { Loader2, Package, MapPin, Phone, User } from "lucide-react";

const statusColor = {
  New: "bg-blue-100 text-blue-700 border-blue-200",
  Preparing: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Ready: "bg-purple-100 text-purple-700 border-purple-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

const filters = ["All", "New", "Preparing", "Ready", "Delivered", "Cancelled"];

export default function Liveorders() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api("/orders/cook");
      if (res.success) {
        setOrders(res.data);
      }
    } catch (err) {
      toast.error("Failed to fetch orders");
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
      const res = await api(`/orders/${orderId}/status`, {
        method: "PATCH",
        body: { status: newStatus },
      });
      if (res.success) {
        setOrders(
          orders.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o,
          ),
        );
        toast.success(`Order moved to ${newStatus}`);
      }
    } catch (err) {
      toast.error("Status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesFilter =
      activeFilter === "All" || order.status === activeFilter;
    const customerName = order.userId?.name || "Unknown";
    const itemsText = order.items.map((i) => i.name).join(", ");

    const matchesSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      itemsText.toLowerCase().includes(search.toLowerCase()) ||
      order._id.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight text-center md:text-left">
            LIVE ORDERS
          </h1>
          <p className="text-gray-500 font-medium text-center md:text-left">
            Real-time catering requests
          </p>
        </div>

        <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto scrollbar-none max-w-full">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeFilter === f
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-100"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8 max-w-md mx-auto md:mx-0">
        <input
          type="text"
          placeholder="Search by customer or item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-100 px-6 py-4 rounded-[24px] text-sm font-bold shadow-sm focus:ring-2 focus:ring-orange-500 outline-none transition-all"
        />
      </div>

      {/* Orders Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <Package className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest">
              No Active Orders Found
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-[40px] shadow-xl shadow-gray-200/50 border border-gray-100 p-9 flex flex-col gap-6 relative group overflow-hidden transition-all hover:translate-y-[-4px]"
            >
              {/* Status Badge */}
              <div
                className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[40px] text-[10px] font-black uppercase tracking-[2px] border-b border-l z-10 ${statusColor[order.status]}`}
              >
                {order.status}
              </div>

              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-orange-50 flex items-center justify-center text-orange-500 font-black text-2xl border border-orange-100 shadow-inner">
                    {order.userId?.name?.charAt(0) || <User />}
                  </div>
                  <div>
                    <h2 className="font-black text-2xl text-gray-800 tracking-tight">
                      {order.userId?.name || "Customer"}
                    </h2>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest flex items-center gap-2 mt-1">
                      #{order._id.slice(-6).toUpperCase()} •{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right pr-20 md:pr-0">
                  <p className="text-3xl font-black text-gray-800 tracking-tighter">
                    ₹{order.totalAmount}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-gray-50/50 rounded-[32px] p-6 space-y-3 border border-gray-100/50">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  Order Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center bg-white px-5 py-4 rounded-2xl border border-gray-100 shadow-sm transition-all hover:scale-[1.01]"
                    >
                      <span className="font-bold text-gray-700 text-sm">
                        {item.name}
                      </span>
                      <span className="bg-orange-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-sm shadow-orange-200">
                        x{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Bar - Improved Design */}
              <div className="mt-auto space-y-6">
                {/* Address Section */}
                <div className="flex items-start gap-4 bg-orange-50/50 p-5 rounded-[28px] border border-orange-100/50">
                  <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
                    <MapPin className="text-orange-500 w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-1">
                      Catering Address:
                    </span>
                    <p className="text-[12px] font-bold text-gray-600 leading-relaxed line-clamp-2">
                      {order.deliveryAddress}
                    </p>
                  </div>
                </div>

                {/* Update Status Buttons */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                      Update Lifecycle
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                    {["Preparing", "Ready", "Delivered", "Cancelled"].map(
                      (s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusUpdate(order._id, s)}
                          disabled={
                            updatingId === order._id || order.status === s
                          }
                          className={`py-3.5 px-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 relative overflow-hidden ${
                            order.status === s
                              ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                              : "bg-white border-gray-100 hover:border-orange-200 hover:text-orange-600 hover:shadow-lg hover:shadow-orange-100/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
                          }`}
                        >
                          {updatingId === order._id && order.status !== s ? (
                            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                          ) : (
                            s
                          )}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
