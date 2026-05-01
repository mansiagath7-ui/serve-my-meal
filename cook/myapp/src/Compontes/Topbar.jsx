import React from 'react';
import { Search, Bell, X, ChevronRight, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Topbar({ sideOpen, setSideOpen, user }) {
  const location = useLocation();

  const routeMap = {
    "/cook": "Overview",
    "/cook/Liveorders": "Orders",
    "/cook/Cookbooking": "Cookbooking",
    "/cook/Analytics": "Analytics",
    "/cook/Reviews": "Reviews",
  };

  const currentPath = useLocation().pathname;
  const PageTitle = routeMap[currentPath] || "Dashboard";

  return (
    <header className="bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3 shadow-sm">

      <button
        onClick={() => setSideOpen(!sideOpen)}
        className="w-8 h-8 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center"
      >
        {sideOpen ? (
          <X className="w-4 h-4 text-gray-500" />
        ) : (
          <Menu className="w-4 h-4 text-gray-500" />
        )}
      </button>

      <div className="flex items-center gap-1.5">
        <span className="text-gray-400 text-sm">Cook</span>
        <ChevronRight className="w-3 h-3 text-gray-300" />
        <span className="text-gray-800 font-bold text-sm">
          {PageTitle}
        </span>
      </div>

      <div className="relative ml-auto">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          placeholder={`Search in ${PageTitle}...`}
          className="pl-8 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs w-52 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
      </div>

      <button className="relative w-8 h-8 rounded-xl bg-gray-50 hover:bg-orange-50 flex items-center justify-center">
        <Bell className="w-4 h-4 text-gray-500" />
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
          5
        </span>
      </button>

      <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-300 rounded-xl flex items-center justify-center font-black text-white text-sm">
          {user?.name?.charAt(0) || "C"}
        </div>
        <div className="hidden sm:block">
          <p className="text-xs font-bold text-gray-800">
            {user?.name || "Cook"}
          </p>
          <p className="text-[10px] text-gray-400">
            {user?.email || "cook@servemymeal.com"}
          </p>
        </div>
      </div>

    </header>
  );
}