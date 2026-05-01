import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Trash2,
  Loader2,
} from "lucide-react";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("orders");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const itemsPerPage = 8;

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api('/auth/users');
        if (res.success) {
          // Flatten data and add defaults for missing metrics
          const formatted = res.data.map(user => ({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || 'N/A',
            orders: user.ordersCount || 0, // Mock for now until orders implemented
            spent: user.totalSpent || 0,   // Mock for now until payments implemented
            joined: new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            status: user.status || "Active"
          }));
          setCustomers(formatted);
        }
      } catch (err) {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const confirmDelete = async () => {
    try {
      const res = await api(`/auth/delete/${deleteId}`, { method: 'DELETE' });
      if (res.success) {
        setCustomers(customers.filter((c) => c.id !== deleteId));
        toast.success("User deleted successfully");
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete user");
    } finally {
      setDeleteId(null);
    }
  };

  const filtered = customers.filter((c) => {
    const matchesFilter = filter === "All" ? true : c.status === filter;
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    return matchesFilter && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => b[sortKey] - a[sortKey]);
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4">All Customers</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex w-full md:w-1/3 shadow-sm text-sm">
          <input
            type="text"
            placeholder="Search customers..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2 border rounded-l-xl w-full outline-none focus:ring-1 focus:ring-orange-400"
          />
          <button className="bg-orange-500 text-white px-4 rounded-r-xl">Search</button>
        </div>

        <div className="flex gap-2">
          {["All", "Active", "Suspended"].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm transition ${
                filter === f ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-4">Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th onClick={() => setSortKey("orders")} className="cursor-pointer">Orders <ArrowUpDown size={12} className="inline ml-1" /></th>
              <th onClick={() => setSortKey("spent")} className="cursor-pointer">Spent <ArrowUpDown size={12} className="inline ml-1" /></th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50">
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-semibold text-purple-600 text-xs">
                    {c.name.charAt(0)}
                  </div>
                  {c.name}
                </td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{c.orders}</td>
                <td className="text-orange-500 font-medium">₹{c.spent.toLocaleString()}</td>
                <td>{c.joined}</td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setSelectedCustomer(c); setModalType("view"); }}
                      className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition"
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteId(c.id)}
                      className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="flex justify-between p-4 items-center border-t text-xs">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-1.5 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200">
              <ChevronLeft size={16} />
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-1.5 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {modalType && selectedCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl scale-in-center">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Customer Details</h2>
            <div className="space-y-3 text-sm">
              <p><span className="text-gray-500 font-medium w-20 inline-block">ID:</span> <span className="text-orange-500">{selectedCustomer.id}</span></p>
              <p><span className="text-gray-500 font-medium w-20 inline-block">Name:</span> {selectedCustomer.name}</p>
              <p><span className="text-gray-500 font-medium w-20 inline-block">Email:</span> {selectedCustomer.email}</p>
              <p><span className="text-gray-500 font-medium w-20 inline-block">Phone:</span> {selectedCustomer.phone}</p>
              <p><span className="text-gray-500 font-medium w-20 inline-block">Joined:</span> {selectedCustomer.joined}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button onClick={() => setModalType(null)} className="px-6 py-2 bg-orange-100 text-orange-600 rounded-xl font-medium hover:bg-orange-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-xs shadow-2xl">
            <h2 className="font-semibold mb-3 text-gray-800">Confirm Delete</h2>
            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this customer account permanently?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}