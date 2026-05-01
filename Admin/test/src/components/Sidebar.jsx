import {
  LayoutDashboard,
  ShoppingBag,
  Utensils,
  ChefHat,
  Users,
  Tag,
  BarChart2,
  LogOut,
  Calendar,
  X,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar({ sideOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Handle closing of sidebar
  const handleClose = () => {
    if (typeof onClose === "function") {
      onClose();
    }
  };

  const menu = [
    { name: "Overview", icon: LayoutDashboard, path: "/admin" },
    { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
    { name: "Bookings", icon: Calendar, path: "/admin/bookings" },
    { name: "Products", icon: Utensils, path: "/admin/products" },
    { name: "Providers", icon: ChefHat, path: "/admin/providers" },
    { name: "Category", icon: Tag, path: "/admin/category" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
  ];

  return (
    <>
      {/* Backdrop for Mobile */}
      {sideOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={handleClose}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 h-screen bg-[#0f172a] text-white flex flex-col justify-between border-r border-gray-800 z-50 transition-all duration-300 ease-in-out transform
        ${sideOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:w-0 lg:opacity-0 lg:pointer-events-none"}
      `}
      >
        <div className="flex-1 overflow-y-auto scrollbar-none">
          <div className="flex items-center justify-between px-6 py-8 border-b border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg shadow-orange-500/20">
                🍴
              </div>
              <div>
                <h1 className="font-black text-sm tracking-tight text-white">
                  ServeMyMeal
                </h1>
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">
                  Admin Panel
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={handleClose}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center bg-gray-800 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="mt-6 px-4 space-y-2">
            {menu.map((item) => {
              const active = location.pathname === item.path;

              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    if (window.innerWidth < 1024) {
                      handleClose();
                    }
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-sm font-bold transition-all
                  ${
                    active
                      ? "bg-orange-500 text-white shadow-xl shadow-orange-500/20"
                      : "text-gray-400 hover:bg-gray-800/50 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-800/50">
          <button className="flex items-center gap-3 w-full px-4 py-4 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-bold group">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
