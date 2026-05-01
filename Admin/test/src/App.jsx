import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Adminlayout from "./layout/Adminlayout";
import Dashboard from "./Pages/AdminDashboard";
import Orders from "./Pages/Orders";
import Products from "./Pages/Products";
import Providers from "./Pages/Providers";
import Customers from "./Pages/Customers";
// import Analytics from "./Pages/Anlytics";
import Category from "./Pages/Category";
import AdminProfile from "./Pages/AdminProfile";
import AdminLogin from "./Pages/AdminLogin";
import Bookings from "./pages/Bookings";
import ProtectedRoute from "./Routes/ProtectedRoutes";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";
import { NotFound } from "./Pages/NotFound";

function App() {
  console.log("ADMIN APP LOADED");
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Routes>
          {/* Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/admin" />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Adminlayout />
              </ProtectedRoute>
            }
          >
            {/* Redirect /admin → /admin/dashboard */}
            <Route index element={<Dashboard />} />

            {/* Pages */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="products" element={<Products />} />
            <Route path="providers" element={<Providers />} />
            <Route path="customers" element={<Customers />} />
            <Route path="category" element={<Category />} />
            {/* <Route path="analytics" element={<Analytics />} /> */}
            <Route path="profile" element={<AdminProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
