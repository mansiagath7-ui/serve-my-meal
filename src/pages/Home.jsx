import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronRight,
  Flame,
  Clock,
  ChefHat,
  Percent,
  X,
  TrendingUp,
} from "lucide-react";
import api from "../utils/api";
import ProductCard from "../components/ProductCard";

const banners = [
  {
    label: "30% OFF Today",
    sub: "On all Starters & Indo Chinese",
    cta: "Order Now",
    link: "/menu",
    gradient: "from-orange-500 via-orange-400 to-amber-300",
    img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80",
  },
  {
    label: "Free Delivery",
    sub: "On orders above ₹299",
    cta: "Explore Menu",
    link: "/menu",
    gradient: "from-rose-500 via-pink-500 to-rose-400",
    img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80",
  },
  {
    label: "Book a Cook",
    sub: "Professional chef at your home",
    cta: "Book Now",
    link: "/menu",
    gradient: "from-violet-500 via-purple-500 to-violet-400",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeBanner, setActiveBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHomeData();
    const t = setInterval(
      () => setActiveBanner((p) => (p + 1) % banners.length),
      4000,
    );
    return () => clearInterval(t);
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api("/products"),
        api("/categories?adminOnly=true"),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Failed to fetch home data", err);
    } finally {
      setLoading(false);
    }
  };

  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 5);
  const quickPicks = products.filter((p) => p.isQuickPick).slice(0, 5);

  const filtered =
    search.trim().length > 1
      ? products.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.description &&
              p.description.toLowerCase().includes(search.toLowerCase())),
        )
      : [];

  const b = banners[activeBanner];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Preparing Menu...
          </p>
        </div>
      </div>
    );

  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      {/* ── SEARCH BAR (sticky, only on mobile / shows below header) ── */}
      <div className="sticky top-14 md:top-16 z-20 bg-white border-b border-gray-100 px-4 md:px-8 py-3">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search dishes, cuisines..."
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 max-w-7xl mx-auto">
        {/* ── SEARCH RESULTS ── */}
        {filtered.length > 0 ? (
          <div className="mt-5">
            <p className="text-sm font-semibold text-gray-500 mb-4">
              {filtered.length} results for{" "}
              <span className="text-orange-500">"{search}"</span>
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : search.trim().length > 1 ? (
          <div className="mt-16 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-bold text-gray-600">No results for "{search}"</p>
            <p className="text-gray-400 text-sm mt-1">
              Try a different dish or category
            </p>
          </div>
        ) : (
          <>
            {/* ── HERO BANNER ── */}
            <div className="mt-5">
              <div
                className={`relative bg-gradient-to-r ${b.gradient} rounded-2xl overflow-hidden min-h-[150px] md:min-h-[180px]`}
              >
                <img
                  src={b.img}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-30"
                />
                <div className="relative z-10 p-5 md:p-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-white text-2xl md:text-3xl font-black drop-shadow">
                      {b.label}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base mt-1">
                      {b.sub}
                    </p>
                    <button
                      onClick={() => navigate(b.link)}
                      className="mt-4 bg-white text-gray-800 text-sm font-bold px-5 py-2 rounded-xl hover:shadow-lg transition-all active:scale-95"
                    >
                      {b.cta} →
                    </button>
                  </div>
                </div>
              </div>

              {/* Banner dots */}
              <div className="flex gap-2 justify-center mt-3">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveBanner(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === activeBanner
                        ? "w-7 bg-orange-500"
                        : "w-1.5 bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* ── CATEGORIES ── */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-gray-800 text-base md:text-lg">
                  Categories
                </h2>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {[
                  ...categories
                    .slice(0, 6)
                    .map((c) => ({ id: c._id, label: c.name, emoji: "🍱" })),
                  {
                    id: "Cook-Booking",
                    label: "Book a Cook",
                    emoji: "👨‍🍳",
                    isSpecial: true,
                  },
                ].map((cat) => (
                  <Link
                    key={cat.id}
                    to={cat.isSpecial ? "/cook-booking" : `/menu/${cat.label}`}
                    className="flex flex-col items-center gap-1.5 bg-white hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl p-2.5 md:p-3 transition-all group"
                  >
                    <span className="text-[10px] md:text-lg font-bold text-gray-600 text-center leading-tight">
                      {cat.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── PROMO STRIP ── */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                {
                  icon: Percent,
                  label: "30% OFF",
                  sub: "Starters",
                  color: "bg-orange-50 text-orange-600",
                  iconColor: "text-orange-500",
                },
                {
                  icon: ChefHat,
                  label: "Book Chef",
                  sub: "At your home",
                  color: "bg-violet-50 text-violet-600",
                  iconColor: "text-violet-500",
                },
                {
                  icon: Flame,
                  label: "Bestsellers",
                  sub: "Most loved",
                  color: "bg-red-50 text-red-600",
                  iconColor: "text-red-500",
                },
              ].map((promo) => (
                <div
                  key={promo.label}
                  className={`flex items-center gap-3 ${promo.color} rounded-xl p-3 md:p-4 cursor-pointer hover:scale-[1.02] transition-transform`}
                >
                  <promo.icon
                    className={`w-5 h-5 ${promo.iconColor} shrink-0`}
                  />
                  <div>
                    <p className="font-bold text-sm">{promo.label}</p>
                    <p className="text-xs opacity-70">{promo.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── BESTSELLERS ── */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-gray-800 text-base md:text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" /> Best Sellers
                </h2>
                <Link
                  to="/menu/Best Sellers"
                  className="text-orange-500 text-xs font-semibold flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {bestsellers.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>

            {/* ── QUICK PICKS ── */}
            <div className="mt-7">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-extrabold text-gray-800 text-base md:text-lg flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-500" /> Quick Picks
                </h2>
                <Link
                  to="/menu/Quick Picks"
                  className="text-orange-500 text-xs font-semibold flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {quickPicks.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </div>

            {/* ── BOOK A COOK BANNER ── */}
            <div
              onClick={() => navigate("/cook-booking")}
              className="mt-7 bg-gradient-to-r from-violet-600 to-purple-500 rounded-2xl p-5 md:p-7 flex items-center justify-between cursor-pointer hover:shadow-xl transition-all group"
            >
              <div>
                <h3 className="text-white font-black text-lg md:text-2xl">
                  Book a Personal Chef
                </h3>
                <p className="text-white/75 text-sm mt-1">
                  Expert cooks delivered to your doorstep
                </p>
                <button className="mt-3 bg-white text-purple-600 text-sm font-bold px-5 py-2 rounded-xl hover:shadow-md transition">
                  Book Now →
                </button>
              </div>
              <ChefHat className="w-16 h-16 md:w-20 md:h-20 text-white/20 group-hover:text-white/30 transition-all shrink-0" />
            </div>

            <div className="h-4" />
          </>
        )}
      </div>
    </div>
  );
}
