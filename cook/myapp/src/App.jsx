import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Cooklayout from "./Layout/Cooklayout";

import LiveOrders from "./pages/Liveorders";
import Overview from "./pages/Overview";
import CookBooking from "./pages/Cookbooking";
// import Analytics from "./pages/Analytics";
import MyProducts from "./pages/MyProducts";
import Categories from "./pages/Categories";
import Profile from "./pages/Profile";
import { NotFound } from "./pages/NotFound";

import Login from "./pages/Login";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user && user.role === "cook" ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
};

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default → Login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Login Page */}
        <Route path="/login" element={<Login />} />

        {/* Protected Cook Panel */}
        <Route
          path="/cook"
          element={
            <PrivateRoute>
              <Cooklayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="Liveorders" element={<LiveOrders />} />
          <Route path="Cookbooking" element={<CookBooking />} />
          <Route path="MyProducts" element={<MyProducts />} />
          <Route path="Categories" element={<Categories />} />
          {/* <Route path="Analytics" element={<Analytics />} /> */}

          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
