import React, { useState } from "react";
import { Plus, Minus, Star, Leaf, Drumstick } from "lucide-react";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { items, addItem, updateQty } = useCart();

  // Normalize backend data
  const normalizedId = product._id || product.id;
  const isVeg = product.type === "veg" || product.veg === true;
  const imageSrc = product.image?.startsWith("http")
    ? product.image
    : `http://localhost:5000/${product.image}`;

  const cartItem = items.find((i) => i.id === normalizedId);

  const handleAdd = () => {
    addItem({ ...product, id: normalizedId, veg: isVeg, image: imageSrc });
    toast.success(`${product.name} added to cart!`, {
      position: "bottom-right",
      duration: 1500,
      icon: "🛒",
      style: { fontSize: "13px", borderRadius: "12px" },
    });
  };

  const handleIncrease = () => updateQty(normalizedId, cartItem.qty + 1);
  const handleDecrease = () => {
    if (cartItem.qty === 1) {
      updateQty(normalizedId, 0);
      toast.error(`${product.name} removed from cart`, {
        position: "bottom-right",
        duration: 1200,
        icon: "🗑️",
        style: { fontSize: "13px", borderRadius: "12px" },
      });
    } else {
      updateQty(normalizedId, cartItem.qty - 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group flex flex-col border border-gray-100">
      {/* Image */}
      <div className="relative overflow-hidden h-36 md:h-40 shrink-0">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80";
          }} // Fallback
        />
        {/* Tag */}
        {product.tag && (
          <span className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.tag}
          </span>
        )}

        {/* Veg badge */}
        <div className="absolute bottom-2 left-2">
          {isVeg ? (
            <span className="bg-green-100/90 text-green-700 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 backdrop-blur-sm">
              <Leaf className="w-2.5 h-2.5" /> Veg
            </span>
          ) : (
            <span className="bg-red-100/90 text-red-700 text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-0.5 backdrop-blur-sm">
              <Drumstick className="w-2.5 h-2.5" /> Non-Veg
            </span>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">
          {product.name}
        </h3>
        <p className="text-gray-400 text-[11px] mt-0.5 mb-2 flex-1 leading-relaxed line-clamp-2">
          {product.description ||
            "Freshly prepared meal with premium ingredients."}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-orange-500 font-extrabold text-base">
            ₹{product.price}
          </span>

          {cartItem ? (
            <div className="flex items-center gap-1.5 bg-orange-50 rounded-xl px-1.5 py-1">
              <button
                onClick={handleDecrease}
                className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors active:scale-90"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="font-bold text-orange-600 min-w-[16px] text-center text-xs">
                {cartItem.qty}
              </span>
              <button
                onClick={handleIncrease}
                className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors active:scale-90"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
