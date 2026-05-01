import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Truck,
  BarChart3,
  LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Adminlayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition";

  const activeClass = "bg-orange-500 text-white";
  const inactiveClass = "text-gray-600 hover:bg-gray-100";

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4 flex flex-col">
        <h2 className="text-xl font-bold text-orange-500 mb-6">
          Admin Panel
        </h2>

        <nav className="flex flex-col gap-2 flex-1">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <ShoppingCart size={18} />
            Orders
          </NavLink>

          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Package size={18} />
            Products
          </NavLink>

          <NavLink
            to="/admin/providers"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Truck size={18} />
            Providers
          </NavLink>

          <NavLink
            to="/admin/customers"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <Users size={18} />
            Customers
          </NavLink>

          <NavLink
            to="/admin/analytics"
            className={({ isActive }) =>
              `${linkClass} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <BarChart3 size={18} />
            Analytics
          </NavLink>
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold text-gray-700">
            Admin Dashboard
          </h1>

          <div className="text-sm text-gray-500">
            Welcome, Admin 👋
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>

      </div>
    </div>
  );
}