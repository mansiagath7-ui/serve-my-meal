import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ChevronLeft, Tag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const navigate = useNavigate();
  const tax = Math.round(total * 0.05);
  const delivery = total > 0 ? (total > 299 ? 0 : 40) : 0;

  return (
    <div className="pb-20 md:pb-6 min-h-screen bg-gray-50">
      <div className="sticky top-14 md:top-16 z-20 bg-white border-b border-orange-50 px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>
          <h1 className="text-xl font-extrabold text-gray-800">My Cart</h1>
          {items.length > 0 && (
            <span className="ml-auto bg-orange-100 text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full">
              {items.reduce((a, i) => a + i.qty, 0)} items
            </span>
          )}
        </div>
      </div>

      <div className="px-4 md:px-6 mt-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-12 h-12 text-orange-300" />
            </div>
            <h2 className="text-lg font-bold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-400 text-sm mt-1 mb-6">Add items to get started</p>
            <button
              onClick={() => navigate("/")}
              className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Delivery notice */}
            {total < 299 && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-4 flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-500" />
                <p className="text-xs text-amber-700 font-medium">
                  Add ₹{299 - total} more for free delivery!
                </p>
              </div>
            )}

            {/* Items */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {items.map((item, idx) => (
                <div key={item.id}>
                  {idx > 0 && <div className="border-t border-gray-50 mx-4" />}
                  <div className="flex items-center gap-3 p-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-sm truncate">{item.name}</h3>
                      <p className="text-orange-500 font-bold text-sm mt-0.5">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-orange-50 rounded-xl px-2 py-1">
                      <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg bg-white shadow flex items-center justify-center">
                        <Minus className="w-3 h-3 text-orange-500" />
                      </button>
                      <span className="font-bold text-gray-700 w-4 text-center text-sm">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg bg-orange-500 shadow flex items-center justify-center">
                        <Plus className="w-3 h-3 text-white" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center ml-1">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bill */}
            <div className="bg-white rounded-2xl p-4 mt-4 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-3">Bill Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span className="font-medium">₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST & Charges</span>
                  <span className="font-medium">₹{tax}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  {delivery === 0 ? (
                    <span className="text-green-500 font-semibold">FREE</span>
                  ) : (
                    <span className="font-medium">₹{delivery}</span>
                  )}
                </div>
                <div className="border-t border-dashed border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
                  <span>Total</span>
                  <span className="text-orange-500">₹{total + tax + delivery}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/payment")}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl mt-4 transition shadow-lg shadow-orange-200 text-base"
            >
              Proceed to Payment → ₹{total + tax + delivery}
            </button>

            <button onClick={clearCart} className="w-full text-gray-400 text-sm py-3 hover:text-red-400 transition">
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
