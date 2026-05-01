import React, { useState, useEffect } from "react";
import { ChevronLeft, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../utils/api";

export default function CategoryPage({
  title,
  categoryName: initialCategory,
  type: initialType,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(initialType || "all");
  const [categoryName, setCategoryName] = useState(initialCategory || "All");
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [categoryName, initialType]);

  const fetchCategories = async () => {
    try {
      const res = await api("/categories?adminOnly=true");
      setCategories([{ name: "All" }, ...res.data]);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let url = "/products";
      const params = [];

      if (categoryName === "Best Sellers") {
        params.push(`isBestSeller=true`);
      } else if (categoryName === "Quick Picks") {
        params.push(`isQuickPick=true`);
      } else if (categoryName && categoryName !== "All") {
        params.push(`category=${categoryName}`);
      }

      if (initialType) params.push(`type=${initialType}`);

      if (params.length > 0) {
        url += `?${params.join("&")}`;
      }

      const res = await api(url);
      setItems(res.data);
    } catch (err) {
      console.error(`Failed to fetch products`, err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const isVeg = p.type === "veg" || p.veg === true;
    const matchFilter =
      filter === "all" ||
      (filter === "veg" && isVeg) ||
      (filter === "nonveg" && !isVeg);
    return matchSearch && matchFilter;
  });

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Loading {categoryName}...
          </p>
        </div>
      </div>
    );

  return (
    <div className="pb-20 md:pb-6">
      {/* Header */}
      <div className="sticky top-14 md:top-16 z-20 bg-white/95 backdrop-blur-sm border-b border-orange-50 px-4 md:px-6 pt-4 pb-3">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => navigate("/")}
            className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center hover:bg-orange transition"
          >
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-gray-800">
              {categoryName === "All" ? "Main Menu" : categoryName}
            </h1>
          </div>
          <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
            {filtered.length} items
          </span>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search in ${categoryName}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide border-b border-gray-50">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategoryName(cat.name)}
              className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                categoryName === cat.name
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105"
                  : "bg-gray-50 text-gray-500 hover:bg-orange-50 hover:text-orange-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Secondary Filter chips (Veg/Non-Veg) */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          {[
            { key: "all", label: "All Types" },
            { key: "veg", label: "Veg" },
            { key: "nonveg", label: "Non-Veg" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-3 py-1 rounded-full text-[10px] font-semibold transition-all ${
                filter === f.key
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-400 border border-gray-100 hover:border-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-6 mt-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <p className="text-gray-400 font-bold">
              No dishes found in this category
            </p>
            <button
              onClick={() => {
                setCategoryName("All");
                setFilter("all");
                setSearch("");
              }}
              className="mt-4 text-orange-500 text-sm font-bold hover:underline"
            >
              Back to Main Menu
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map((p) => (
              <ProductCard key={p._id || p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
