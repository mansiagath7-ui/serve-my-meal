import React, { useState, useEffect } from "react";
import {
  ChefHat,
  Star,
  ChevronLeft,
  Clock,
  Users,
  CheckCircle,
  Utensils,
  Plus,
  Minus,
  Trash2,
  Search,
  Leaf,
  Drumstick,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../utils/api";

/* ─── STEP INDICATOR ─── */
const STEPS = ["Choose Cook", "Pick Dishes", "Schedule", "Confirm"];

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-1 mt-3 max-w-4xl mx-auto">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-1.5 shrink-0">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > i + 1 ? "bg-green-500 text-white" : step === i + 1 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}
            >
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span
              className={`text-xs font-semibold hidden sm:block ${step === i + 1 ? "text-orange-500" : step > i + 1 ? "text-green-600" : "text-gray-400"}`}
            >
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`flex-1 h-0.5 rounded-full mx-1 ${step > i + 1 ? "bg-green-400" : "bg-gray-200"}`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
const today = new Date().toISOString().split("T")[0]; // disable past dates
const minDate = today;

const formatTime = (time) => {
  if (!time) return "";

  let [hours, minutes] = time.split(":");
  hours = parseInt(hours);

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${ampm}`;
};

/* ─── MAIN COMPONENT ─── */
export default function CookBooking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cookId, setCookId] = useState(null);
  const [mealItems, setMealItems] = useState({}); // { dishId: qty }
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(4);
  const [occasion, setOccasion] = useState("");
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState(false);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [vegFilter, setVegFilter] = useState("all");
  const [expandedCook, setExpandedCook] = useState(null);
  const [allDishes, setAllDishes] = useState([]);
  const [cooks, setCooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingCategories, setBookingCategories] = useState([]);

  useEffect(() => {
    if (cookId) {
      fetchCookCategories();
    }
  }, [cookId]);

  const fetchCookCategories = async () => {
    try {
      const res = await api(`/categories?cookId=${cookId}`);
      if (res.success) setBookingCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch cook categories", err);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [dishesRes, cooksRes] = await Promise.all([
        api("/products"),
        api("/cooks"),
      ]);
      setAllDishes(dishesRes.data);

      // Transform raw API data into frontend format
      const transformedCooks = (cooksRes.data || []).map((c) => ({
        id: c.id || c._id, // Handle both cases
        name: c.name,
        specialty: c.specialty || "Professional Cook",
        experience: c.experience || "Expert",
        rating: c.rating || 4.9,
        reviewsCount: c.reviewsCount || 24,
        profileImage: c.profileImage, // Keep raw path
        hourlyRate: c.hourlyRate || 0,
        bio: c.bio || "No professional bio provided yet.",
      }));

      setCooks(transformedCooks);
    } catch (err) {
      console.error("Failed to fetch booking data", err);
      toast.error("Failed to load chefs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCook = cooks.find((c) => c.id === cookId);
  const mealCount = Object.values(mealItems).reduce((a, b) => a + b, 0);
  const selectedDishes = allDishes.filter((d) => mealItems[d._id] > 0);

  const cookFee = selectedCook?.hourlyRate ?? 0;
  const mealCost = selectedDishes.reduce(
    (sum, d) => sum + d.price * mealItems[d._id],
    0,
  );
  const total = cookFee + mealCost;

  const err = (msg) =>
    toast.error(msg, {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: true,
      style: { borderRadius: "12px", fontSize: "13px" },
    });
  const ok = (msg) =>
    toast.success(msg, {
      position: "bottom-right",
      autoClose: 2500,
      hideProgressBar: true,
      style: { borderRadius: "12px", fontSize: "13px" },
    });

  const goNext = () => {
    if (step === 1 && !cookId) {
      err("Please select a chef first!");
      return;
    }
    if (step === 2 && mealCount === 0) {
      err("Add at least 1 dish to your meal!");
      return;
    }
    if (step === 3) {
      if (!date) {
        err("Please select a date!");
        return;
      }
      if (!time) {
        err("Please select a time!");
        return;
      }
    }
    setStep(step + 1);
  };

  const setQty = (id, qty) => {
    if (qty <= 0) {
      const n = { ...mealItems };
      delete n[id];
      setMealItems(n);
    } else {
      setMealItems({ ...mealItems, [id]: qty });
    }
  };

  const filteredDishes = allDishes.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      catFilter === "all" ||
      d.category.toLowerCase() === catFilter.toLowerCase();
    const isVeg = d.type === "veg" || d.veg === true;
    const matchVeg =
      vegFilter === "all" ||
      (vegFilter === "veg" && isVeg) ||
      (vegFilter === "nonveg" && !isVeg);
    return matchSearch && matchCat && matchVeg;
  });
  const handlePayment = async () => {
    if (!user) {
      toast.error("Please login to confirm booking");
      navigate('/login', { state: { from: '/cook-booking' } });
      return;
    }

    try {
      setLoading(true);
      
      const bookingData = {
        cookId: cookId,
        date,
        time,
        guests,
        occasion,
        dishes: selectedDishes.map(d => ({
          productId: d._id,
          name: d.name,
          quantity: mealItems[d._id]
        })),
        totalAmount: total,
        note
      };

      // 1. Create Booking Record
      const res = await api('/bookings', {
        method: 'POST',
        body: JSON.stringify(bookingData)
      });

      if (!res.success) {
        throw new Error(res.message || "Failed to create booking");
      }

      const bookingId = res.data._id;

      // 2. Create Payment Session
      const sessionRes = await api("/payments/create-session", {
        method: "POST",
        body: JSON.stringify({
          bookingId: bookingId,
          amount: total,
        }),
      });

      if (sessionRes.success) {
        // 3. Initialize Cashfree
        const cashfree = window.Cashfree({
          mode: "sandbox", 
        });

        let checkoutOptions = {
          paymentSessionId: sessionRes.data.payment_session_id,
          redirectTarget: "_self", 
        };

        cashfree.checkout(checkoutOptions);
      } else {
        throw new Error("Failed to initialize payment session");
      }
    } catch (err) {
      console.error("Booking failed", err);
      toast.error(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  /* ─── BOOKING CONFIRMED ─── */
  if (booked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pb-20 md:pb-0">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-800">
            Booking Confirmed! 🎉
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {selectedCook?.name} will arrive at your home
          </p>

          <div className="bg-orange-50 rounded-2xl p-4 mt-5 text-left space-y-2.5">
            {[
              { l: "Chef", v: selectedCook?.name },
              { l: "Date", v: date },
              { l: "Time", v: time },
              { l: "Guests", v: `${guests} people` },
              { l: "Occasion", v: occasion || "General" },
              { l: "Dishes", v: `${mealCount} items` },
              { l: "Meal Cost", v: `₹${mealCost}` },
              { l: "Chef Fee", v: `₹${cookFee}` },
            ].map((r) => (
              <div key={r.l} className="flex justify-between text-sm">
                <span className="text-gray-500">{r.l}</span>
                <span className="font-semibold text-gray-800">{r.v}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm pt-3 border-t-2 border-dashed border-orange-200 mt-2">
              <span className="font-bold text-gray-800">Total Paid</span>
              <span className="font-extrabold text-orange-500 text-lg">
                ₹{total}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              navigate("/");
            }}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition shadow-lg shadow-orange-100 mt-6"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-8 min-h-screen bg-gray-50">
      {/* ── STICKY HEADER ── */}
      <div className="sticky top-14 md:top-16 z-20 bg-white border-b border-gray-100 px-4 md:px-8 py-3 shadow-sm">
        <div className="flex items-center gap-3 max-w-5xl mx-auto">
          <button
            onClick={() => {
              if (step === 1) navigate(-1);
              else setStep(step - 1);
            }}
            className="w-9 h-9 rounded-xl bg-orange-50 hover:bg-orange-100 flex items-center justify-center transition-all shrink-0"
          >
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>
          <div>
            <h1 className="text-base font-extrabold text-gray-800 flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" /> Book a Personal
              Cook
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Professional chef · Your home · Your menu
            </p>
          </div>
          {mealCount > 0 && (
            <div className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Utensils className="w-3 h-3" /> {mealCount} dishes
            </div>
          )}
        </div>
        <StepBar step={step} />
      </div>

      <div className="px-4 md:px-8 mt-5 max-w-5xl mx-auto">
        {/* ══ STEP 1 — CHOOSE COOK ══ */}
        {step === 1 && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Select a professional cook for your home experience
            </p>
            {loading ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading master chefs...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cooks.map((c) => (
                  <div
                    key={c.id}
                    className={`bg-white rounded-2xl overflow-hidden border-2 shadow-sm transition-all cursor-pointer ${cookId === c.id ? "border-orange-500 shadow-orange-100" : "border-gray-100 hover:border-orange-200 hover:shadow-md"}`}
                    onClick={() => setCookId(c.id)}
                  >
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={
                          c.profileImage && c.profileImage !== 'default-avatar.png'
                            ? `http://localhost:5000${c.profileImage}`
                            : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
                        }
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80";
                        }}
                        alt={c.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-black text-base leading-tight">
                          {c.name}
                        </p>
                        <p className="text-white/80 text-xs mt-0.5">
                          {c.specialty}
                        </p>
                      </div>
                      {cookId === c.id && (
                        <div className="absolute top-2 right-2 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            ✓
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {c.rating}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Clock className="w-3 h-3" />
                          {c.experience}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <Users className="w-3 h-3" />
                          {c.reviewsCount} reviews
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                        {c.bio}
                      </p>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                        <div>
                          <span className="font-extrabold text-orange-500 text-lg">
                            ₹{c.hourlyRate}
                          </span>
                          <span className="text-gray-400 text-xs ml-1">
                            /visit
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedCook(
                              expandedCook === c.id ? null : c.id,
                            );
                          }}
                          className="text-xs text-blue-500 font-semibold flex items-center gap-1 hover:underline"
                        >
                          <Info className="w-3 h-3" /> Details
                        </button>
                      </div>
                      {expandedCook === c.id && (
                        <div className="mt-2 bg-blue-50 rounded-xl p-2.5 text-xs text-blue-700">
                          {c.bio}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {!loading && cooks.length === 0 && (
              <div className="col-span-full py-20 text-center">
                <ChefHat className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  No chefs available at the moment.
                </p>
              </div>
            )}
          </>
        )}

        {/* ══ STEP 2 — PICK DISHES ══ */}
        {step === 2 && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dishes..."
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                />
              </div>
              {/* Veg toggle */}
              <div className="flex gap-1.5">
                {[
                  ["all", "All"],
                  ["veg", "🌿 Veg"],
                  ["nonveg", "🍗 Non-Veg"],
                ].map(([v, l]) => (
                  <button
                    key={v}
                    onClick={() => setVegFilter(v)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${vegFilter === v ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
              <button
                onClick={() => setCatFilter("all")}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter === "all" ? "bg-orange-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}
              >
                <span>🍽️</span>
                All Dishes
              </button>
              {bookingCategories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setCatFilter(cat.name)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${catFilter.toLowerCase() === cat.name.toLowerCase() ? "bg-orange-500 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300"}`}
                >
                  <img src={`http://localhost:5000/${cat.image}`} alt="" className="w-4 h-4 object-contain rounded-sm" />
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Selected summary bar */}
            {mealCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-semibold text-orange-700">
                    {mealCount} dishes · ₹{mealCost} meal cost
                  </span>
                </div>
                <span className="text-xs text-orange-500 font-semibold">
                  {selectedDishes.length} unique items
                </span>
              </div>
            )}

            {/* Dish grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredDishes.map((d) => {
                const qty = mealItems[d._id] || 0;
                return (
                  <div
                    key={d._id}
                    className={`bg-white rounded-2xl overflow-hidden border shadow-sm transition-all ${qty > 0 ? "border-orange-400 shadow-orange-100" : "border-gray-100 hover:shadow-md"}`}
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img
                        src={`http://localhost:5000/${d.image}`}
                        alt={d.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className={`absolute top-2 left-2 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${d.type === "veg" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                      >
                        {d.type === "veg" ? (
                          <>
                            <Leaf className="w-2.5 h-2.5" />
                            Veg
                          </>
                        ) : (
                          <>
                            <Drumstick className="w-2.5 h-2.5" />
                            Non-Veg
                          </>
                        )}
                      </div>
                      {qty > 0 && (
                        <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {qty}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-gray-800 text-sm truncate">
                        {d.name}
                      </p>
                      <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-1">
                        {d.description}
                      </p>
                      <div className="flex items-center justify-between mt-2.5">
                        <span className="font-extrabold text-orange-500">
                          ₹{d.price}
                        </span>
                        {qty > 0 ? (
                          <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-1.5 py-1">
                            <button
                              onClick={() => setQty(d._id, qty - 1)}
                              className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-90"
                            >
                              {qty === 1 ? (
                                <Trash2 className="w-3 h-3" />
                              ) : (
                                <Minus className="w-3 h-3" />
                              )}
                            </button>
                            <span className="font-bold text-orange-600 min-w-[14px] text-center text-xs">
                              {qty}
                            </span>
                            <button
                              onClick={() => setQty(d._id, qty + 1)}
                              className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 active:scale-90"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setQty(d._id, 1)}
                            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredDishes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-3xl mb-2">🍽️</p>
                <p className="text-gray-400 font-medium">No dishes found</p>
              </div>
            )}
          </>
        )}

        {/* ══ STEP 3 — SCHEDULE ══ */}
        {step === 3 && selectedCook && (
          <div className="max-w-lg mx-auto space-y-4">
            {/* Cook summary */}
            <div className="bg-white rounded-2xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
              <img
                src={
                  selectedCook.profileImage && selectedCook.profileImage !== "default-avatar.png"
                    ? `http://localhost:5000${selectedCook.profileImage}`
                    : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
                }
                alt={selectedCook.name}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">
                  {selectedCook.name}
                </p>
                <p className="text-gray-400 text-xs">
                  {selectedCook.specialty}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-orange-500 text-xs font-semibold"
              >
                Change
              </button>
            </div>

            {/* Dishes summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-700 text-sm">
                  {mealCount} Dishes Selected
                </h3>
                <button
                  onClick={() => setStep(2)}
                  className="text-orange-500 text-xs font-semibold"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedDishes.map((d) => (
                  <span
                    key={d._id}
                    className="bg-orange-50 text-orange-600 text-[11px] font-medium px-2 py-0.5 rounded-lg"
                  >
                    {d.name} ×{mealItems[d._id]}
                  </span>
                ))}
              </div>
            </div>

            {/* Date & time */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 text-sm mb-3">
                Date & Time
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block">
                    Date
                  </label>

                  <input
                    type="date"
                    min={minDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-semibold mb-1.5 block">
                    Time
                  </label>

                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />

                  {/* AM PM Display */}
                  <p className="text-xs text-gray-500 mt-1">
                    {time && `Selected: ${formatTime(time)}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-700 text-sm mb-3">
                Guests & Occasion
              </h3>
              <div className="flex items-center gap-4 mb-3">
                <button
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                  className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 font-bold text-xl flex items-center justify-center hover:bg-orange-100"
                >
                  −
                </button>
                <div className="text-center">
                  <span className="font-black text-gray-800 text-2xl">
                    {guests}
                  </span>
                  <p className="text-gray-400 text-xs">people</p>
                </div>
                <button
                  onClick={() => setGuests(Math.min(50, guests + 1))}
                  className="w-9 h-9 rounded-xl bg-orange-500 text-white font-bold text-xl flex items-center justify-center hover:bg-orange-600"
                >
                  +
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  "Birthday 🎂",
                  "Anniversary 💍",
                  "House Party 🎉",
                  "Office Lunch 💼",
                  "Family Dinner 🏠",
                  "Casual Meal 🍽️",
                ].map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={`py-2 px-2 rounded-xl text-[11px] font-semibold border transition-all ${occasion === o ? "bg-orange-500 text-white border-orange-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300"}`}
                  >
                    {o}
                  </button>
                ))}
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Special instructions (dietary needs, allergies, preferences)..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none h-20"
              />
            </div>
          </div>
        )}

        {/* ══ STEP 4 — CONFIRM ══ */}
        {step === 4 && selectedCook && (
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-4">
              <h3 className="font-bold text-gray-800 mb-4 text-base">
                Booking Summary
              </h3>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                <img
                  src={
                    selectedCook.profileImage && selectedCook.profileImage !== "default-avatar.png"
                      ? `http://localhost:5000${selectedCook.profileImage}`
                      : "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
                  }
                  alt={selectedCook.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div>
                  <p className="font-bold text-gray-800 text-sm">
                    {selectedCook.name}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {selectedCook.specialty}
                  </p>
                </div>
              </div>

              {/* Dishes */}
              <div className="mb-4 pb-4 border-b border-gray-50">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Your Menu ({mealCount} dishes)
                </p>
                <div className="space-y-1.5">
                  {selectedDishes.map((d) => (
                    <div key={d._id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {d.name}{" "}
                        <span className="text-gray-400">
                          ×{mealItems[d._id]}
                        </span>
                      </span>
                      <span className="font-semibold text-gray-800">
                        ₹{d.price * mealItems[d._id]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {[
                { l: "Date", v: date },
                { l: "Time", v: time },
                { l: "Guests", v: `${guests} people` },
                { l: "Occasion", v: occasion || "General" },
                { l: "Meal Cost", v: `₹${mealCost}` },
                { l: "Chef Fee", v: `₹${cookFee}` },
              ].map((r) => (
                <div
                  key={r.l}
                  className="flex justify-between py-1.5 text-sm border-b border-gray-50 last:border-0"
                >
                  <span className="text-gray-500">{r.l}</span>
                  <span className="font-semibold text-gray-800">{r.v}</span>
                </div>
              ))}
              <div className="flex justify-between pt-4 mt-2 border-t-2 border-dashed border-orange-100">
                <span className="font-bold text-gray-800">Total Payable</span>
                <span className="font-extrabold text-orange-500 text-xl">
                  ₹{total}
                </span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-orange-200 text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                `Confirm & Pay ₹${total}`
              )}
            </button>
            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Secure payment · Free cancellation up to 2h before
            </p>
          </div>
        )}

        {/* ── CONTINUE BUTTON (steps 1-3) ── */}
        {step < 4 && (
          <button
            onClick={goNext}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl mt-5 transition shadow-lg shadow-orange-200 text-base"
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
