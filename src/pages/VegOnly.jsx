import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import CategoryPage from "../components/CategoryPage";
import api from "../utils/api";

export default function VegOnly() {
  const [vegCount, setVegCount] = useState(0);

  // We can just use CategoryPage without passing items, 
  // and we'll update CategoryPage to handle a 'vegOnly' filter if needed.
  // Or simpler: pass a special categoryName or prop to CategoryPage.
  
  return (
    <div>
      <div className="sticky top-14 md:top-16 z-20 bg-green-500 px-4 md:px-8 py-3 flex items-center gap-2">
        <Leaf className="w-4 h-4 text-white" />
        <span className="text-white font-bold text-sm">Pure Vegetarian Menu</span>
      </div>
      {/* CategoryPage without categoryName will fetch ALL products, 
          and the internal state 'filter' can be defaulted to 'veg' 
          or we can add a 'defaultFilter' prop. */}
      <CategoryPage title="Only Veg" type="veg" /> 
    </div>
  );
}
