import { FaRupeeSign, FaUser } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { GiCook } from "react-icons/gi";
import { Tag } from "lucide-react";

export default function Overview() {
  const stats = [
    {
      id: 1,
      label: "Total Revenue",
      value: "₹1,52,400",
      sub: "This month",
      Icon: FaRupeeSign,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      id: 2,
      label: "Total Orders",
      value: "1,284",
      sub: "This month",
      Icon: MdShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      id: 3,
      label: "Active Users",
      value: "842",
      sub: "Registered",
      Icon: FaUser,
      color: "text-purple-500",
      bg: "bg-purple-100",
    },
    {
      id: 4,
      label: "Active Cooks",
      value: "18",
      sub: "Online now",
      Icon: GiCook,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      id: 5,
      label: "Active Categories",
      value: "6",
      sub: "Total listed",
      Icon: Tag,
      color: "text-pink-500",
      bg: "bg-pink-100",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {stats.map((s) => {
          const Icon = s.Icon;

          return (
            <div
              key={s.id}
              className="bg-white p-5 rounded-2xl shadow flex justify-between items-start hover:shadow-md transition"
            >
              <div>
                <p className="text-gray-500 text-sm">{s.label}</p>
                <h2 className="text-2xl font-bold mt-2">{s.value}</h2>
                <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
              </div>

              <div className={`${s.bg} p-3 rounded-xl`}>
                <Icon className={s.color} size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}