import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaPencilAlt, FaTrash, FaUpload } from "react-icons/fa";
import { Loader2, Pizza, Utensils } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function MyProducts() {
  const [type, setType] = useState("veg");
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useAuth();

  const { register, handleSubmit, reset } = useForm();

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api("/products/cook"),
        api("/categories"),
      ]);
      setProducts(prodRes.data);
      // Filter categories to show only system (null cookId) or mine
      const filteredCats = catRes.data.filter(c => !c.cookId || c.cookId === user?._id);
      setCategories(filteredCats);
    } catch (err) {
      toast.error("Failed to load products");
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
      formData.append("description", data.description || "Freshly cooked meal");

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api("/products", {
        method: "POST",
        body: formData,
      });

      toast.success("Product Published ✅");
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
    if (window.confirm("Are you sure you want to remove this dish?")) {
      try {
        await api(`/products/${id}`, { method: "DELETE" });
        toast.error("Product Removed");
        fetchData();
      } catch (err) {
        toast.error("Failed to remove product");
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
      formData.append("isAvailable", editingProduct.isAvailable);
      formData.append("isAvailable", editingProduct.isAvailable);

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
      <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-gray-400 font-black uppercase tracking-widest">
          Warming the kitchen...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-800 tracking-tight">
            MY MENU
          </h2>
          <p className="text-gray-500 font-medium tracking-tight">
            Manage your specialty dishes and availability
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`${showForm ? "bg-red-500" : "bg-orange-500"} hover:opacity-90 text-white px-8 py-4 rounded-[24px] shadow-xl shadow-orange-100 transition-all active:scale-95 font-black text-xs uppercase tracking-widest flex items-center gap-3`}
        >
          {showForm ? (
            "Cancel"
          ) : (
            <>
              <span className="text-lg">+</span> Add New Dish
            </>
          )}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-sm border border-orange-100 rounded-[40px] p-8 mb-10 mt-2 animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                  Dish Name
                </label>
                <input
                  {...register("name", { required: true })}
                  className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-2xl outline-none transition-all text-sm font-bold shadow-sm"
                  placeholder="e.g. Signature Butter Chicken"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    {...register("price", { required: true })}
                    className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-2xl outline-none transition-all text-sm font-bold shadow-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                    Category
                  </label>
                  <select
                    {...register("category", { required: true })}
                    className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-2xl outline-none transition-all text-sm font-bold shadow-sm appearance-none cursor-pointer"
                  >
                    <option value="">Select Cuisine</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                  Dietary Type
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setType("veg")}
                    className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all border-2 ${type === "veg" ? "bg-green-50 border-green-500 text-green-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-400"}`}
                  >
                    🌿 Pure Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("nonveg")}
                    className={`flex-1 py-4 rounded-2xl text-xs font-black uppercase transition-all border-2 ${type === "nonveg" ? "bg-red-50 border-red-500 text-red-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-400"}`}
                  >
                    🍗 Non-Veg
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block pl-1">
                  Brief Description
                </label>
                <textarea
                  {...register("description")}
                  className="w-full p-4 bg-gray-50 border border-transparent focus:bg-white focus:border-orange-500 rounded-2xl outline-none transition-all text-sm font-bold shadow-sm min-h-[100px]"
                  placeholder="Describe your specialty..."
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block pl-1">
              Dish Visuals
            </label>
            <label className="flex-1 min-h-[250px] border-4 border-dashed border-gray-50 rounded-[40px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50/50 transition-all group relative overflow-hidden bg-gray-50/20">
              {!preview ? (
                <>
                  <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-orange-400 shadow-sm mb-4 group-hover:scale-110 transition-transform">
                    <FaUpload size={24} />
                  </div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">
                    Tap to upload photo
                  </p>
                </>
              ) : (
                <img
                  src={preview}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                {...register("image")}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setImageFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>
            {preview && (
              <button
                type="button"
                onClick={() => {
                  setPreview("");
                  setImageFile(null);
                  reset({ image: null });
                }}
                className="mt-4 bg-red-50 text-red-500 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                Delete Selection
              </button>
            )}
          </div>

          <button className="bg-orange-500 hover:bg-orange-600 text-white font-black py-5 rounded-2xl w-full mt-10 shadow-2xl shadow-orange-100 transition-all active:scale-[0.98] uppercase tracking-[3px] text-xs">
            Publish New Specialty
          </button>
        </form>
      )}

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
            <Utensils className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-black uppercase tracking-widest text-xs">
              No dishes added to your menu yet
            </p>
          </div>
        ) : (
          products.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:shadow-orange-100/50 transition-all relative"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    item.image.includes("http")
                      ? item.image
                      : `http://localhost:5000/${item.image}`
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div
                  className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg ${item.type === "veg" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {item.type}
                </div>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <span className="text-white font-black text-xs uppercase tracking-[4px] border-2 border-white px-6 py-2 rounded-xl">
                      Sold Out
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-gray-800 text-lg uppercase tracking-tight truncate">
                    {item.name}
                  </h3>
                  <span className="text-sm font-black text-orange-500 tracking-tighter">
                    ₹{item.price}
                  </span>
                </div>

                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6">
                  {item.category}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 bg-gray-50 hover:bg-orange-50 text-gray-600 hover:text-orange-500 py-3 rounded-2xl flex items-center justify-center transition-all shadow-sm"
                  >
                    <FaPencilAlt size={12} />
                  </button>
                  <button
                    onClick={() => deleteProduct(item._id)}
                    className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all shadow-sm"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingProduct && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] p-8 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-gray-800 uppercase tracking-tighter">
                Edit Dish
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Available
                </span>
                <button
                  onClick={() =>
                    setEditingProduct({
                      ...editingProduct,
                      isAvailable: !editingProduct.isAvailable,
                    })
                  }
                  className={`w-12 h-6 rounded-full relative transition-all ${editingProduct.isAvailable ? "bg-green-500" : "bg-gray-200"}`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingProduct.isAvailable ? "left-7" : "left-1"}`}
                  />
                </button>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Dish Name
                  </label>
                  <input
                    value={editingProduct.name}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        name: e.target.value,
                      })
                    }
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  Cuisine Category
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full p-4 bg-gray-50 rounded-2xl border border-transparent focus:border-orange-500 focus:bg-white outline-none font-bold text-sm appearance-none shadow-sm"
                >
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    setEditingProduct({ ...editingProduct, type: "veg" })
                  }
                  className={`flex-1 p-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${editingProduct.type === "veg" ? "bg-green-50 border-green-500 text-green-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-400"}`}
                >
                  Veg
                </button>
                <button
                  onClick={() =>
                    setEditingProduct({ ...editingProduct, type: "nonveg" })
                  }
                  className={`flex-1 p-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${editingProduct.type === "nonveg" ? "bg-red-50 border-red-500 text-red-700 shadow-sm" : "bg-gray-50 border-transparent text-gray-400"}`}
                >
                  Non-Veg
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">
                  Update Appearance
                </label>
                <label className="border-2 border-dashed border-gray-100 rounded-2xl p-4 text-center cursor-pointer block hover:bg-gray-50 transition-colors group">
                  <FaUpload
                    className="mx-auto mb-2 text-gray-300 group-hover:text-orange-400 transition-colors"
                    size={16}
                  />
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {editingProduct.newImage
                      ? editingProduct.newImage.name
                      : "Tap to change photo"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setEditingProduct({
                          ...editingProduct,
                          newImage: file,
                          preview: URL.createObjectURL(file), // For temporary preview
                        });
                      }
                    }}
                  />
                </label>
                {(editingProduct.preview || editingProduct.image) && (
                  <div className="mt-2 h-20 w-full rounded-xl overflow-hidden relative border border-gray-100">
                    <img
                      src={
                        editingProduct.preview ||
                        (editingProduct.image.includes("http")
                          ? editingProduct.image
                          : `http://localhost:5000/${editingProduct.image}`)
                      }
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-[8px] font-black text-white uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
                        Selected
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors"
              >
                Discard
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-orange-100 hover:bg-orange-600 transition-all active:scale-95"
              >
                Save Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
