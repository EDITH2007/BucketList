import { useState } from "react";
import { Check, Trash2, Edit2, MapPin, Calendar, DollarSign, Tag } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BucketItem as BucketItemType } from "../types";

interface Props {
  item: BucketItemType;
}

const priorityConfig = {
  must: { label: "Must Do", color: "bg-red-100 text-red-700 border-red-200" },
  should: { label: "Should Do", color: "bg-amber-100 text-amber-700 border-amber-200" },
  nice: { label: "Nice to Have", color: "bg-blue-100 text-blue-700 border-blue-200" },
};

const categoryIcons = {
  adventure: "🏔️",
  culture: "🏛️",
  food: "🍜",
  nature: "🌲",
  relaxation: "🏖️",
  photography: "📸",
};

export default function BucketItemCard({ item }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const toggleComplete = useMutation(api.bucketList.toggleComplete);
  const deleteItem = useMutation(api.bucketList.deleteItem);

  return (
    <div 
      className={`travel-card relative p-5 category-${item.category} ${item.completed ? 'opacity-75' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {item.completed && (
        <div className="stamp-complete">
          Visited
        </div>
      )}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[item.category]}</span>
          <div>
            <h3 className={`font-display text-lg font-semibold ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
              <MapPin size={14} />
              <span>{item.location}, {item.country}</span>
            </div>
          </div>
        </div>
        
        <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${priorityConfig[item.priority].color}`}>
          {priorityConfig[item.priority].label}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {item.tags.map((tag) => (
          <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md flex items-center gap-1">
            <Tag size={10} />
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex gap-4 text-xs text-gray-500">
          {item.targetDate && (
            <span className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(item.targetDate).toLocaleDateString()}
            </span>
          )}
          {item.budget && (
            <span className="flex items-center gap-1">
              <DollarSign size={14} />
              {item.budget.toLocaleString()}
            </span>
          )}
        </div>

        <div className={`flex gap-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => toggleComplete({ id: item._id })}
            className={`p-2 rounded-lg transition-colors ${item.completed 
              ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' 
              : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
          >
            <Check size={18} />
          </button>
          <button className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors">
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => deleteItem({ id: item._id })}
            className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}