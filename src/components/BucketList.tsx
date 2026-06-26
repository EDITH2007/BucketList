import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Category } from "../types";
import BucketItemCard from "./BucketItem";
import CategoryFilter from "./CategoryFilter";
import WorldMap from "./WorldMap";

interface Props {
  userId: string;
}

export default function BucketList({ userId }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [showCompleted, setShowCompleted] = useState(true);
  
  const items = useQuery(api.bucketList.getItems, { userId });

  const filteredItems = items?.filter((item) => {
    if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
    if (!showCompleted && item.completed) return false;
    return true;
  });

  return (
    <div>
      <WorldMap items={items || []} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <CategoryFilter selected={selectedCategory} onChange={setSelectedCategory} />
        
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={(e) => setShowCompleted(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-amber-700 focus:ring-amber-500"
          />
          Show completed adventures
        </label>
      </div>

      {filteredItems?.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="font-display text-xl text-gray-900 mb-2">No adventures found</h3>
          <p className="text-gray-500">Start planning your next journey!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems?.map((item) => (
            <BucketItemCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}