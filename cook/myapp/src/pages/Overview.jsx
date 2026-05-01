import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FaRupeeSign, FaUser } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { GiCook } from "react-icons/gi";

export default function Overview() {
  const revenueData = [
    { day: "Mon", value: 18000 },
    { day: "Tue", value: 22000 },
    { day: "Wed", value: 20000 },
    { day: "Thu", value: 25000 },
    { day: "Fri", value: 23000 },
    { day: "Sat", value: 30000 },
    { day: "Sun", value: 28000 },
  ];

  const orderData = [
    { name: "Delivered", value: 62, color: "#22c55e" },
    { name: "Preparing", value: 18, color: "#f97316" },
    { name: "On the way", value: 12, color: "#3b82f6" },
    { name: "Cancelled", value: 8, color: "#ef4444" },
  ];

  const orders = []; // Future: Fetch real-time orders
  const products = []; // Future: Fetch top products data

  const statusStyle = {
    Delivered: "bg-green-100 text-green-600",
    Preparing: "bg-orange-100 text-orange-600",
    "On the way": "bg-blue-100 text-blue-600",
    Cancelled: "bg-red-100 text-red-600",
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* 🔥 TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Card */}
        <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <h2 className="text-2xl font-bold mt-2">₹1,52,400</h2>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-xl">
            <FaRupeeSign className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total Orders</p>
            <h2 className="text-2xl font-bold mt-2">1,284</h2>
            <p className="text-xs text-gray-400 mt-1">This month</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <MdShoppingBag className="text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Active Users</p>
            <h2 className="text-2xl font-bold mt-2">842</h2>
            <p className="text-xs text-gray-400 mt-1">Registered</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-xl">
            <FaUser className="text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Active Cooks</p>
            <h2 className="text-2xl font-bold mt-2">18</h2>
            <p className="text-xs text-gray-400 mt-1">Online now</p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <GiCook className="text-green-500" />
          </div>
        </div>

      </div>

      
      </div>
       );
}