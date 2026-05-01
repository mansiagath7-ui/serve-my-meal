import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Search, Plus, X, Upload } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

function Modal({ onClose, onSave, initial, loading }) {
  const [form, setForm] = useState(
    initial
      ? { name: initial.name, image: initial.image }
      : { name: "", image: null },
  );
  const [preview, setPreview] = useState(
    initial?.image
      ? initial.image.includes("http")
        ? initial.image
        : `http://localhost:5000/${initial.image}`
      : null,
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, newImage: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md p-8 animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">
            {initial ? "Edit Category" : "New Category"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-600 transition p-2 hover:bg-gray-50 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-6">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Category Name
            </label>
            <input
              className="w-full border border-transparent bg-gray-50 rounded-2xl px-4 py-3.5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all shadow-inner"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Starters"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
              Display Image
            </label>
            <label className="border-4 border-dashed border-gray-50 rounded-[32px] p-6 text-center cursor-pointer block hover:bg-orange-50/10 transition-colors group">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-2xl shadow-sm mb-2"
                />
              ) : (
                <div className="py-4">
                  <Upload
                    className="mx-auto mb-2 text-gray-200 group-hover:text-orange-400 transition-colors"
                    size={32}
                  />
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-wider">
                    Tap to upload
                  </p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            disabled={loading}
            onClick={onClose}
            className="flex-1 border-2 border-gray-100 text-gray-500 rounded-2xl py-3.5 text-xs font-black uppercase tracking-widest hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={() => onSave(form)}
            className="flex-1 bg-orange-500 text-white rounded-2xl py-3.5 text-xs font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-100 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Syncing..." : initial ? "Save" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ cat, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8 overflow-hidden">
        <div className="relative h-48 -mx-8 -mt-8 mb-6">
          {cat.image ? (
            <img
              src={
                cat.image.includes("http")
                  ? cat.image
                  : `http://localhost:5000/${cat.image}`
              }
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
              No Image
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/40 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
              Information
            </span>
            <h2 className="text-3xl font-black text-gray-800 tracking-tighter">
              {cat.name}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-3xl text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Status
              </span>
              <span className="text-sm font-black text-green-500 uppercase">
                Live
              </span>
            </div>
            <div className="bg-gray-50 p-4 rounded-3xl text-center">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                Index
              </span>
              <span className="text-sm font-black text-gray-800">
                # {cat.id || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 bg-gray-800 text-white rounded-2xl py-4 text-xs font-black uppercase tracking-widest hover:bg-gray-900 transition-all active:scale-[0.98]"
        >
          Dismiss Details
        </button>
      </div>
    </div>
  );
}

export default function Category() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  const deleteCategory = async (id) => {
    if (
      window.confirm(
        "Are you sure? This will hide all products in this category.",
      )
    ) {
      try {
        await api(`/categories/${id}`, { method: "DELETE" });
        toast.error("Category Removed 🗑️");
        fetchCategories();
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const handleSave = async (form) => {
    try {
      setActionLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      if (form.newImage) {
        formData.append("image", form.newImage);
      }

      if (editTarget) {
        await api(`/categories/${editTarget._id}`, {
          method: "PUT",
          body: formData,
        });
        toast.success("Category Sync'd ✨");
      } else {
        await api("/categories", {
          method: "POST",
          body: formData,
        });
        toast.success("New Category Added 🚀");
      }

      setShowModal(false);
      setEditTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400 font-black tracking-widest animate-pulse">
        Initializing Categories...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
            Menu Structure
          </h1>
          <p className="text-xs text-gray-400 font-medium">
            Define your food departments and sections
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95"
        >
          <Plus size={15} />
          Create New
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm px-6 py-4 mb-8 flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <input
            className="w-full bg-gray-50 border border-transparent rounded-[20px] pl-11 pr-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-300 focus:bg-white transition-all shadow-inner"
            placeholder="Find a category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
          />
        </div>
        <div className="flex gap-6 pr-4">
          <div className="text-center">
            <span className="block text-[10px] font-black text-gray-300 uppercase">
              Live Sections
            </span>
            <span className="text-xl font-black text-gray-800">
              {categories.length}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center">
            <span className="text-4xl opacity-20">📂</span>
            <p className="text-gray-400 mt-4 font-bold uppercase tracking-widest text-xs">
              Zero collections found
            </p>
          </div>
        )}
        {filtered.map((cat) => (
          <div
            key={cat._id}
            className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
          >
            <div className="relative h-40 overflow-hidden">
              {cat.image ? (
                <img
                  src={
                    cat.image.includes("http")
                      ? cat.image
                      : `http://localhost:5000/${cat.image}`
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-orange-50 flex items-center justify-center text-orange-200 font-black uppercase tracking-widest text-xs">
                  No Brand Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <h3 className="text-white font-black text-xl tracking-tight">
                  {cat.name}
                </h3>
              </div>
            </div>

            <div className="px-6 py-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-green-100 text-green-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Public
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewTarget(cat)}
                  className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-green-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Eye size={14} />
                </button>
                <button
                  onClick={() => setEditTarget(cat)}
                  className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => deleteCategory(cat._id)}
                  className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          loading={actionLoading}
        />
      )}
      {editTarget && (
        <Modal
          onClose={() => setEditTarget(null)}
          onSave={handleSave}
          initial={editTarget}
          loading={actionLoading}
        />
      )}
      {viewTarget && (
        <ViewModal cat={viewTarget} onClose={() => setViewTarget(null)} />
      )}
    </div>
  );
}
