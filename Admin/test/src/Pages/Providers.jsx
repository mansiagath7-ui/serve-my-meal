import React, { useState, useMemo, useEffect } from "react";
import {
  Pencil,
  Trash2,
  UploadCloud,
  Loader2,
  Star,
  CheckCircle,
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Providers() {
  const PAGE_SIZE = 5;

  const initialForm = {
    name: "",
    email: "", // owner's email
    phone: "",
    cuisine: "Multi-Cuisine",
    rating: "4.0",
    revenue: "0",
    status: "Online",
    verified: false,
    image: "",
  };

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(initialForm);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Fetch sellers from backend
  const fetchSellers = async () => {
    try {
      const res = await api("/auth/sellers");
      if (res.success) {
        const formatted = res.data.map((seller) => ({
          id: seller._id,
          name: seller.name, // Displaying user name as "Kitchen Name" for now or name
          owner: seller.name,
          email: seller.email,
          phone: seller.phone || "N/A",
          cuisine: seller.profile?.specialty || "Specified in Profile",
          revenue: 0,
          status: seller.profile?.status === 'online' ? "Online" : "Offline",
          verified: seller.profile?.isVerified || false,
          image:
            seller.profileImage ||
            `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        }));
        setProviders(formatted);
      }
    } catch (err) {
      toast.error("Failed to load providers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  const filtered = useMemo(() => {
    return providers.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.email.toLowerCase().includes(search.toLowerCase());

      if (filter === "Online") return p.status === "Online" && matchSearch;
      if (filter === "Offline") return p.status === "Offline" && matchSearch;
      if (filter === "Verified") return p.verified && matchSearch;

      return matchSearch;
    });
  }, [providers, filter, search]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const paginated = useMemo(() => {
    return filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  }, [filtered, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this provider?"))
      return;
    try {
      const res = await api(`/auth/delete/${id}`, { method: "DELETE" });
      if (res.success) {
        setProviders((prev) => prev.filter((p) => p.id !== id));
        toast.success("Provider account deleted");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditData(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Total Sellers
          </p>
          <h2 className="text-3xl font-bold text-gray-800">
            {providers.length}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Active Status
          </p>
          <h2 className="text-3xl font-bold text-green-500">
            {providers.filter((p) => p.status === "Online").length}
          </h2>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Verified Shops
          </p>
          <h2 className="text-3xl font-bold text-blue-500">
            {providers.filter((p) => p.verified).length}
          </h2>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Cook Management
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-orange-100 active:scale-95"
        >
          + Add New Seller
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <input
            placeholder="Search by name or email..."
            className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2 flex-wrap">
            {["All", "Online", "Offline", "Verified"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  filter === f
                    ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-100"
                    : "bg-white text-gray-500 border-gray-200 hover:border-orange-400"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-4 text-[10px] items-center font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
          <span className="col-span-2">Provider Details</span>
          <span>Cuisine Type</span>
          <span>Availability</span>
          <span className="text-center">Action</span>
        </div>

        {paginated.length > 0 ? (
          paginated.map((p, i) => (
            <div
              key={p.id}
              className={`grid grid-cols-6 px-6 py-5 items-center text-sm border-t border-gray-50 transition-colors hover:bg-orange-50/30 ${
                i % 2 === 0 ? "bg-white" : "bg-gray-50/20"
              }`}
            >
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={`http://localhost:5000${p.image}`}
                  className="w-11 h-11 rounded-2xl object-cover ring-2 ring-gray-100"
                  alt={p.name}
                />
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-gray-800 truncate">
                    {p.name}
                  </span>
                  <span className="text-xs text-gray-400 truncate">
                    {p.email}
                  </span>
                  {p.verified && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-500 mt-0.5">
                      <CheckCircle size={10} /> Verified Chef
                    </div>
                  )}
                </div>
              </div>

              <span className="text-gray-500 font-medium">{p.cuisine}</span>

              <div>
                <span
                  className={`text-[10px] px-3 py-1 rounded-lg font-bold uppercase tracking-tighter ${
                    p.status === "Online"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center text-gray-400 italic">
            No providers found matching your criteria.
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8 gap-3">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`w-9 h-9 rounded-xl border text-sm font-bold transition-all ${
              page === i + 1
                ? "bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-100"
                : "bg-white text-gray-400 border-gray-100 hover:border-orange-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-orange-500"></div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Provider Account Creation
            </h2>
            <p className="text-xs text-gray-400 mb-6 bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
              Note: Creating a provider here will register a new user account
              with the "Cook" role and initialize their workspace.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                try {
                  await api("/auth/register", {
                    method: "POST",
                    body: JSON.stringify({
                      name: form.name,
                      email: form.email,
                      password: "default123", // System default password
                      role: "cook",
                      phone: form.phone,
                    }),
                  });
                  toast.success("Seller account created successfully!");
                  fetchSellers();
                  resetForm();
                } catch (err) {
                  toast.error(err.message || "Failed to create seller");
                } finally {
                  setLoading(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">
                  Kitchen / Full Name
                </label>
                <input
                  required
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Royal Kitchens"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">
                  Owner Email Address
                </label>
                <input
                  required
                  type="email"
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="owner@kitchen.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 ml-1 uppercase">
                  Contact WhatsApp Number
                </label>
                <input
                  className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 99999 99999"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 border-2 border-gray-100 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:bg-gray-50 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-orange-500 text-white py-3 rounded-2xl text-sm font-bold shadow-lg shadow-orange-100 hover:bg-orange-600 transition-all"
                >
                  Activate Seller
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
