import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import { DynamicCategoryPage } from "./pages/Categories";
import VegOnly from "./pages/VegOnly";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import CookBooking from "./pages/CookBooking";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./pages/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";
import { useLocation } from "react-router-dom";
import { NotFound } from "./pages/NotFound";

// Layout
function AppLayout() {
  const location = useLocation();

  const hideFooterRoutes = ["/cart", "/payment", "/login", "/payment-success"];
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Sidebar />

      <main className="pt-14 md:pt-16 flex-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Unified Menu */}
          <Route path="/menu" element={<Menu />} />
          <Route path="/menu/:categoryName" element={<DynamicCategoryPage />} />

          {/* Legacy/Specific Categories - redirecting to unified menu */}
          <Route
            path="/starters"
            element={<Navigate to="/menu/Starters" replace />}
          />
          <Route
            path="/maincourse"
            element={<Navigate to="/menu/Main Course" replace />}
          />
          <Route
            path="/southindian"
            element={<Navigate to="/menu/South Indian" replace />}
          />
          <Route
            path="/indochinese"
            element={<Navigate to="/menu/Indo Chinese" replace />}
          />
          <Route
            path="/dessert"
            element={<Navigate to="/menu/Dessert" replace />}
          />
          <Route
            path="/beverages"
            element={<Navigate to="/menu/Beverages" replace />}
          />

          <Route path="/veg" element={<VegOnly />} />
          <Route path="/profile" element={<Profile />} />

          {/* Cart */}
          <Route path="/cart" element={<Cart />} />

          {/* Payment Protected */}
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-success/:id"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* User */}
          <Route path="/orders" element={<Orders />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/cook-booking" element={<CookBooking />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// Main App
export default function App() {
  console.log("CLIENT APP LOADED");
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
