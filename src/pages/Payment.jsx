import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  CreditCard,
  Smartphone,
  Banknote,
  CheckCircle,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-hot-toast";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { total, clearCart, items } = useCart();
  const { user } = useAuth();

  const tax = Math.round(total * 0.05);
  const delivery = total > 299 ? 0 : 40;
  const grandTotal = total + tax + delivery;

  const [method, setMethod] = useState("upi");
  const [done, setDone] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);
  
  // Address State
  const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddr?._id || "manual");
  const [isAddingAddress, setIsAddingAddress] = useState(!defaultAddr);
  const [addressForm, setAddressForm] = useState({
    fullAddress: defaultAddr ? `${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.zip}` : "",
  });

  useEffect(() => {
    if (defaultAddr && selectedAddressId !== "manual") {
      const addr = user.addresses.find(a => a._id === selectedAddressId);
      if (addr) {
        setAddressForm({
          fullAddress: `${addr.street}, ${addr.city}, ${addr.state} - ${addr.zip}`
        });
        setIsAddingAddress(false);
      }
    }
  }, [selectedAddressId, user?.addresses]);

  /* ================= PAYMENT HANDLER ================= */
  const handlePay = async () => {
    try {
      setProcessing(true);

      if (!addressForm.fullAddress) {
        toast.error("Please add a delivery address first!");
        setProcessing(false);
        return;
      }

      // 1. Create Order in Backend
      const orderData = {
        items,
        totalAmount: grandTotal,
        deliveryAddress: addressForm.fullAddress,
        paymentMethod: method,
      };

      const orderRes = await api("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });

      if (!orderRes.success) {
        throw new Error(orderRes.message || "Failed to create order");
      }

      const orderId = orderRes.data._id;

      if (method === "cod") {
        // Direct Success for COD
        setFinalAmount(grandTotal);
        setDone(true);
        clearCart();
        toast.success("Order placed successfully! 🎉");
      } else {
        // UPI or Card -> Open Cashfree
        const sessionRes = await api("/payments/create-session", {
          method: "POST",
          body: JSON.stringify({
            orderId: orderId,
            amount: grandTotal,
          }),
        });

        if (sessionRes.success) {
          const cashfree = window.Cashfree({
            mode: "sandbox", // Use 'production' for live
          });

          let checkoutOptions = {
            paymentSessionId: sessionRes.data.payment_session_id,
            redirectTarget: "_self", 
          };

          cashfree.checkout(checkoutOptions);
        } else {
          throw new Error("Failed to initialize payment");
        }
      }
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error(err.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };
  /* ================= SUCCESS SCREEN ================= */
  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>

        <h1 className="text-2xl font-black text-gray-800">
          Order Confirmed! 🎉
        </h1>

        <p className="text-gray-400 mt-2 text-center text-sm">
          Your food is being prepared.
          <br />
          Estimated delivery: 25–35 mins
        </p>

        <div className="bg-orange-50 rounded-2xl p-5 mt-6 w-full max-w-sm">
          <p className="text-center font-bold text-orange-600 text-lg">
           ₹{finalAmount}
          </p>
          <p className="text-center text-gray-400 text-xs mt-1">
            Paid via {method.toUpperCase()}
          </p>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-orange-500 text-white font-bold px-10 py-3 rounded-2xl hover:bg-orange-600 transition"
        >
          Back to Home
        </button>

        <button
          onClick={() => navigate("/orders")}
          className="mt-3 text-orange-500 font-semibold text-sm"
        >
          Track Order →
        </button>
      </div>
    );
  }

  const methods = [
    {
      id: "upi",
      label: "UPI / GPay",
      icon: Smartphone,
      sub: "Pay using any UPI app",
    },
    {
      id: "card",
      label: "Credit / Debit Card",
      icon: CreditCard,
      sub: "Visa, Mastercard, RuPay",
    },
    {
      id: "cod",
      label: "Cash on Delivery",
      icon: Banknote,
      sub: "Pay when your order arrives",
    },
  ];

  const savedUser = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* HEADER */}
      <div className="sticky top-14 md:top-16 z-20 bg-white border-b border-orange-50 px-4 md:px-6 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-orange-500" />
          </button>

          <h1 className="text-xl font-extrabold text-gray-800">Payment</h1>

          <Lock className="w-4 h-4 text-green-500 ml-auto" />
          <span className="text-xs text-green-600 font-medium">Secure</span>
        </div>
      </div>

      <div className="px-4 md:px-6 mt-4 max-w-lg mx-auto">
        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <h3 className="font-bold text-gray-700 text-sm mb-3">
            Order Summary
          </h3>

          {items.slice(0, 3).map((i) => (
            <div
              key={i.id}
              className="flex justify-between text-sm text-gray-600 py-1"
            >
              <span>
                {i.name} × {i.qty}
              </span>
              <span className="font-medium">
                ₹{i.price * i.qty}
              </span>
            </div>
          ))}

          {items.length > 3 && (
            <p className="text-xs text-gray-400 mt-1">
              +{items.length - 3} more items
            </p>
          )}

          <div className="border-t border-dashed border-gray-200 mt-3 pt-3 flex justify-between font-bold text-gray-800">
            <span>Total Payable</span>
            <span className="text-orange-500">₹{grandTotal}</span>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700 text-sm">
              Delivery Address
            </h3>
            {!isAddingAddress && (
              <button 
                onClick={() => setIsAddingAddress(true)}
                className="text-xs font-bold text-orange-500 hover:text-orange-600"
              >
                Change
              </button>
            )}
          </div>

          {user?.addresses?.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-3 scrollbar-hide">
              {user.addresses.map((a) => (
                <button
                  key={a._id}
                  onClick={() => setSelectedAddressId(a._id)}
                  className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 ${
                    selectedAddressId === a._id
                      ? "border-orange-500 bg-orange-50 text-orange-600 shadow-sm"
                      : "border-gray-100 bg-white text-gray-500 hover:border-orange-200"
                  }`}
                >
                  {a.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setSelectedAddressId("manual");
                  setIsAddingAddress(true);
                  setAddressForm({ fullAddress: "" });
                }}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border-2 border-dashed ${
                  selectedAddressId === "manual"
                    ? "border-orange-500 bg-orange-50 text-orange-600"
                    : "border-gray-200 text-gray-400 hover:border-orange-300"
                }`}
              >
                + New
              </button>
            </div>
          )}

          {isAddingAddress ? (
            <div className="space-y-3 animation-fade-in">
              <textarea
                className="w-full p-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none text-sm min-h-[80px]"
                placeholder="Write your complete delivery address here..."
                value={addressForm.fullAddress}
                onChange={(e) => setAddressForm({ ...addressForm, fullAddress: e.target.value })}
              />
              <button
                onClick={() => {
                  if (addressForm.fullAddress.trim().length > 10) {
                    setIsAddingAddress(false);
                    toast.success("Address selected for this order! 📍");
                  } else {
                    toast.error("Please enter a valid complete address");
                  }
                }}
                className="w-full bg-orange-500 text-white font-bold py-2 rounded-xl text-xs hover:bg-orange-600 transition-colors shadow-sm"
              >
                Use This Address
              </button>
            </div>
          ) : (
            <div className="flex items-start gap-3 p-3 bg-orange-50/50 rounded-xl border border-orange-100/50">
              <span className="text-xl">📍</span>
              <div className="flex-1">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {addressForm.fullAddress}
                </p>
                <button 
                  onClick={() => setIsAddingAddress(true)}
                  className="text-[10px] font-bold text-orange-500 mt-1 uppercase tracking-tight hover:underline"
                >
                  Edit for this order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <h3 className="font-bold text-gray-700 text-sm mb-3">
            Payment Method
          </h3>

          <div className="space-y-2">
            {methods.map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  method === m.id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-100 hover:border-orange-200"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    method === m.id
                      ? "bg-orange-500"
                      : "bg-gray-100"
                  }`}
                >
                  <m.icon
                    className={`w-5 h-5 ${
                      method === m.id
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  />
                </div>

                <div className="text-left">
                  <p className="text-sm font-bold text-gray-700">
                    {m.label}
                  </p>
                  <p className="text-xs text-gray-400">{m.sub}</p>
                </div>

                <div
                  className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    method === m.id
                      ? "border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {method === m.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PAY BUTTON */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-orange-200 text-base"
        >
          {processing
            ? "Processing Payment..."
            : `Pay ₹${grandTotal}`}
        </button>
      </div>
    </div>
  );
}