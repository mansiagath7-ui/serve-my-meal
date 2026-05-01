import React, { useState, useEffect } from "react";
import Sidebar from "../Compontes/Sidebar";
import Topbar from "../Compontes/Topbar";
import { Outlet } from "react-router-dom";

export default function Cooklayout() {
  const [sideOpen, setSideOpen] = useState(false);

  // Handle initial responsive state
  useEffect(() => {
    if (window.innerWidth > 1024) {
      setSideOpen(true);
    }
  }, []);

  const user = {
    name: "Cook",
    email: "Cook@servemymeal.com",
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar sideOpen={sideOpen} setSideOpen={setSideOpen} />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          sideOpen={sideOpen}
          setSideOpen={setSideOpen}
          user={user}
        />
        <main className="p-4 md:p-6 lg:p-8 flex-1 overflow-y-auto scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}