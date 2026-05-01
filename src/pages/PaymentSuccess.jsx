import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CheckCircle, ArrowRight, Package, Home, ChefHat } from "lucide-react";
import toast from "react-hot-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("verifying");
  const navigate = useNavigate();

  const orderId = searchParams.get("order_id");
  const bookingId = searchParams.get("booking_id");

  useEffect(() => {
    const verify = async () => {
      if (!orderId && !bookingId) {
        setStatus("error");
        setLoading(false);
        return;
      }

      try {
        const response = await api(`/payments/verify`, {
          method: "POST",
          body: {
            order_id: orderId,
            booking_id: bookingId,
          },
        });

        if (response.success) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification failed", err);
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [orderId, bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Verifying Payment Status...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    const isBooking = !!bookingId;
    const displayId = orderId || bookingId;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-xl text-center space-y-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>

          <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">
              Payment Successful!
            </h1>
            <p className="text-gray-500 mt-2">
              {isBooking
                ? "Your chef booking has been confirmed. The chef will be notified!"
                : "Your order has been placed and is being prepared."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-4 text-left">
            <div className="flex justify-between text-sm py-1">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                {isBooking ? "Booking" : "Order"} ID
              </span>
              <span className="text-gray-800 font-black tracking-tight">
                {displayId.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="flex justify-between text-sm py-1 border-t border-gray-100">
              <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">
                Status
              </span>
              <span className="text-green-500 font-black uppercase text-[10px]">
                Paid
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button
              onClick={() => navigate(isBooking ? "/orders" : "/orders")}
              className="w-full bg-gray-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-black transition-all group"
            >
              {isBooking ? <ChefHat size={18} /> : <Package size={18} />}
              {isBooking ? "View My Bookings" : "Track My Order"}
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-white text-gray-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:text-orange-500 transition-all"
            >
              <Home size={18} />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] p-8 shadow-xl text-center">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="text-red-500 w-12 h-12" />
        </div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">
          Payment Not Verified
        </h1>
        <p className="text-gray-400 mt-2 mb-8 text-sm">
          We couldn't confirm your payment status. If the amount was deducted,
          please check your history in 5 minutes.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
        >
          Check History
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
