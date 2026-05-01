import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt, FaTrash, FaUpload } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function ProductsPage() {
  const [type, setType] = useState("veg");
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cooks, setCooks] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes, cookRes] = await Promise.all([
        api("/products"),
        api("/categories"),
        api("/auth/sellers"),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setCooks(cookRes.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("type", type);
      formData.append("cookId", data.cookId);
      formData.append("description", "Delicious food item");
      formData.append("isBestSeller", !!data.isBestSeller);
      formData.append("isQuickPick", !!data.isQuickPick);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api("/products", {
        method: "POST",
        body: formData,
      });

      toast.success("Product Added ✅");
      reset();
      setPreview("");
      setImageFile(null);
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Failed to add product");
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api(`/products/${id}`, { method: "DELETE" });
        toast.error("Product Deleted ❌");
        fetchData();
      } catch (err) {
        toast.error("Failed to delete product");
      }
    }
  };

  const openEdit = (product) => {
    setEditingProduct({ ...product });
    setShowModal(true);
  };

  const saveEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", editingProduct.name);
      formData.append("price", editingProduct.price);
      formData.append("category", editingProduct.category);
      formData.append("type", editingProduct.type);
      formData.append("cookId", editingProduct.cookId);
      formData.append("isBestSeller", editingProduct.isBestSeller || false);
      formData.append("isQuickPick", editingProduct.isQuickPick || false);

      if (editingProduct.newImage) {
        formData.append("image", editingProduct.newImage);
      }

      await api(`/products/${editingProduct._id}`, {
        method: "PUT",
        body: formData,
      });

      toast.success("Product Updated ✏️");
      setShowModal(false);
      fetchData();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-400 font-bold uppercase tracking-widest animate-pulse">
        Loading Menu...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-gray-800 uppercase tracking-tight">
            Product Catalog
          </h2>
          <p className="text-xs text-gray-400 font-medium">
            Manage your restaurant menu and pricing
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl shadow-lg shadow-orange-100 transition-all active:scale-95 font-bold text-sm flex items-center gap-2"
        >
          {showForm ? (
            <FaTrash size={12} />
          ) : (
            <span className="text-lg">+</span>
          )}
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-sm border border-orange-100 rounded-3xl p-8 mb-8 mt-2"
        >
          {/* FEATURED OPTIONS AT TOP */}
          <div className="flex gap-8 items-center p-4 bg-orange-50 rounded-2xl border border-orange-100 mb-6 font-black text-xs uppercase tracking-widest text-orange-600">
            <span className="text-gray-400">Featured On Home:</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isBestSeller")} className="w-5 h-5 rounded border-gray-300 text-orange-500" />
              <span>Best Seller ⭐</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...register("isQuickPick")} className="w-5 h-5 rounded border-gray-300 text-orange-500" />
              <span>Quick Pick ⚡</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Food Name</label>
                <input {...register("name", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-semibold text-sm" placeholder="Enter dish name..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Price (₹)</label>
                  <input type="number" {...register("price", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-semibold text-sm" placeholder="0.00" />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Category</label>
                  <select {...register("category", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-semibold text-sm">
                    <option value="">Select Category</option>
                    {categories.map((c) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Assign Cook</label>
                  <select {...register("cookId", { required: true })} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-semibold text-sm">
                    <option value="">Select Cook</option>
                    {cooks.map((cook) => <option key={cook._id} value={cook._id}>{cook.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Dietary Type</label>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setType("veg")} className={`flex-1 p-3 rounded-xl text-[10px] font-black border-2 transition-all ${type === "veg" ? "bg-green-50 border-green-500 text-green-700" : "bg-gray-50 border-transparent text-gray-400"}`}>Veg</button>
                    <button type="button" onClick={() => setType("nonveg")} className={`flex-1 p-3 rounded-xl text-[10px] font-black border-2 transition-all ${type === "nonveg" ? "bg-red-50 border-red-500 text-red-700" : "bg-gray-50 border-transparent text-gray-400"}`}>Non-Veg</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Food Image</label>
              <label className="w-full h-40 border-4 border-dashed border-gray-100 rounded-3xl flex flex-col items-center justify-center cursor-pointer relative overflow-hidden">
                {!preview ? (
                  <div className="text-center"><FaUpload className="mx-auto mb-2 text-gray-300" size={24} /><p className="text-[10px] font-bold text-gray-400 uppercase">Upload photo</p></div>
                ) : (
                  <img src={preview} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <input type="file" accept="image/*" {...register("image")} className="hidden" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) { setImageFile(file); setPreview(URL.createObjectURL(file)); }
                }} />
              </label>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl w-full uppercase tracking-widest text-xs transition-all shadow-lg shadow-orange-100">
                Publish Product
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="p-5">Dish</th>
                <th className="p-5">Category</th>
                <th className="p-5">Price</th>
                <th className="p-5 text-center">Type</th>
                <th className="p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr
                  key={item._id}
                  className="border-t border-gray-50 group hover:bg-orange-50/30 transition-colors"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img
                          src={
                            item.image.includes("http")
                              ? item.image
                              : `http://localhost:5000/${item.image}`
                          }
                          className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:scale-110 transition-transform"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                          <FaUpload size={14} />
                        </div>
                      )}
                      <span className="font-bold text-gray-800 text-sm">
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 font-bold text-xs text-gray-500 uppercase tracking-widest">
                    {item.category}
                  </td>
                  <td className="p-5 font-black text-orange-500">
                    ₹{item.price}
                  </td>
                  <td className="p-5 text-center">
                    <span
                      className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-widest border ${item.type === "veg" ? "bg-green-50 border-green-100 text-green-600" : "bg-red-50 border-red-100 text-red-600"}`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex items-center justify-end gap-2 pr-2">
                      <button
                        onClick={() => openEdit(item)}
                        className="w-9 h-9 rounded-xl bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      >
                        <FaPencilAlt size={12} />
                      </button>
                      <button
                        onClick={() => deleteProduct(item._id)}
                        className="w-9 h-9 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shadow-sm"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl p-8 space-y-5 animate-in zoom-in-95 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <h3 className="text-xl font-black text-gray-800 uppercase tracking-tighter">Edit Menu Item</h3>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dish Name</label>
                  <input value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm" />
               </div>
               <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Price (₹)</label>
                  <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm" />
               </div>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</label>
               <select value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm">
                  {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
               </select>
            </div>

            <div className="space-y-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assigned Cook</label>
               <select value={editingProduct.cookId} onChange={(e) => setEditingProduct({...editingProduct, cookId: e.target.value})} className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold text-sm">
                  {cooks.map(cook => <option key={cook._id} value={cook._id}>{cook.name}</option>)}
               </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Dietary Type</label>
                <div className="flex gap-2">
                  <button onClick={() => setEditingProduct({...editingProduct, type: 'veg'})} className={`flex-1 p-3 rounded-xl text-[10px] font-black border-2 ${editingProduct.type === 'veg' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-gray-50 border-transparent text-gray-400'}`}>Veg</button>
                  <button onClick={() => setEditingProduct({...editingProduct, type: 'nonveg'})} className={`flex-1 p-3 rounded-xl text-[10px] font-black border-2 ${editingProduct.type === 'nonveg' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-gray-50 border-transparent text-gray-400'}`}>Non-Veg</button>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Featured</label>
                <div className="space-y-1 pt-1">
                   <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.isBestSeller} onChange={() => setEditingProduct({...editingProduct, isBestSeller: !editingProduct.isBestSeller})} /> <span className="text-[9px] font-bold uppercase text-gray-500">Best Seller ⭐</span></label>
                   <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={editingProduct.isQuickPick} onChange={() => setEditingProduct({...editingProduct, isQuickPick: !editingProduct.isQuickPick})} /> <span className="text-[9px] font-bold uppercase text-gray-500">Quick Pick ⚡</span></label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-500 hover:bg-gray-50">Discard</button>
              <button onClick={saveEdit} className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-100 hover:bg-orange-600">Update Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
