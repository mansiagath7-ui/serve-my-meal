import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { useAuth } from "../context/AuthContext";

export default function Adminlayout() {
  const [sideOpen, setSideOpen] = useState(false);

  // Handle initial responsive state
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setSideOpen(true);
    }
  }, []);

  const { user } = useAuth();
  console.log("Adminlayout Rendered, sideOpen:", sideOpen);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        sideOpen={sideOpen} 
        onClose={() => setSideOpen(false)} 
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar 
          sideOpen={sideOpen} 
          onToggle={() => setSideOpen(!sideOpen)} 
          user={user} 
        />
        <main className="p-4 md:p-6 lg:p-8 bg-gray-50 flex-1 overflow-y-auto scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
