export default function Analytics() {
  return (
    <div className="bg-gray-100 min-h-screen p-6">

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Monthly Revenue</p>
          <h2 className="text-2xl font-bold mt-2">₹1,52,400</h2>
          <p className="text-xs text-gray-400">vs last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold mt-2">1,284</h2>
          <p className="text-xs text-gray-400">vs last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">New Users</p>
          <h2 className="text-2xl font-bold mt-2">142</h2>
          <p className="text-xs text-gray-400">vs last month</p>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Avg Order Value</p>
          <h2 className="text-2xl font-bold mt-2">₹342</h2>
          <p className="text-xs text-gray-400">vs last month</p>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">

        {/* Orders Chart */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Daily Orders — This Week
          </h2>

          {/* Placeholder */}
          <div className="h-40 flex items-center justify-center text-gray-400">
            Chart goes here
          </div>
        </div>

        {/* Revenue Category */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-4">
            Revenue by Category
          </h2>

          {[
            { name: "Main Course", value: 38, color: "bg-orange-500" },
            { name: "Starters", value: 22, color: "bg-blue-500" },
            { name: "South Indian", value: 18, color: "bg-purple-500" },
            { name: "Beverages", value: 11, color: "bg-green-500" },
            { name: "Dessert", value: 7, color: "bg-yellow-500" },
            { name: "Indo Chinese", value: 4, color: "bg-red-500" },
          ].map((item, index) => (
            <div key={index} className="mb-4">
              
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span>{item.value}%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}