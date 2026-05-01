import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, Home, UtensilsCrossed, ArrowLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Animated Icon Cluster */}
        <div className="relative h-48 flex items-center justify-center">
          <div className="absolute inset-0 bg-orange-100 rounded-full blur-3xl opacity-50 animate-pulse" />

          <div className="relative flex items-center gap-4">
            <UtensilsCrossed
              className="w-16 h-16 text-orange-200 -rotate-12 animate-bounce"
              style={{ animationDelay: "0.2s" }}
            />
            <ChefHat className="w-32 h-32 text-orange-500 drop-shadow-2xl animate-bounce" />
            <UtensilsCrossed
              className="w-16 h-16 text-orange-200 rotate-12 animate-bounce"
              style={{ animationDelay: "0.4s" }}
            />
          </div>

          {/* Floating 404 Text */}
          <h1 className="absolute -bottom-4 font-black text-8xl text-gray-800 tracking-tighter opacity-10 select-none">
            404
          </h1>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black text-gray-800">
            Oops! This page is missing from our menu.
          </h2>
          <p className="text-gray-500 text-lg">
            It seems the dish you're looking for was never prepared or has been
            removed from the kitchen.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-8 py-4 bg-orange-500 text-white font-bold rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 active:scale-95 group"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Back to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white text-gray-700 font-bold rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:text-orange-500 transition-all active:scale-95 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
        </div>

        {/* Footer Hint */}
        <p className="text-sm text-gray-400 font-medium pt-8">
          Need help?{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Contact the head chef
          </a>
        </p>
      </div>
    </div>
  );
};
