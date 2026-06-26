import { Mountain, Palette, Utensils, TreePine, Waves, Camera } from "lucide-react";
import { Category } from "../types";

interface Props {
  selected: Category | "all";
  onChange: (category: Category | "all") => void;
}

const categories: { id: Category | "all"; label: string; icon: any; color: string }[] = [
  { id: "all", label: "All", icon: Globe, color: "bg-gray-800" },
  { id: "adventure", label: "Adventure", icon: Mountain, color: "bg-orange-600" },
  { id: "culture", label: "Culture", icon: Palette, color: "bg-amber-700" },
  { id: "food", label: "Food", icon: Utensils, color: "bg-red-600" },
  { id: "nature", label: "Nature", icon: TreePine, color: "bg-green-700" },
  { id: "relaxation", label: "Relax", icon: Waves, color: "bg-blue-700" },
  { id: "photography", label: "Photo", icon: Camera, color: "bg-purple-700" },
];

import { Globe } from "lucide-react";

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
            ${selected === cat.id 
              ? `${cat.color} text-white shadow-lg scale-105` 
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
        >
          <cat.icon size={16} />
          {cat.label}
        </button>
      ))}
    </div>
  );
}