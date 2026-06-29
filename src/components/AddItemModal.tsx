import { useState } from "react";
import { X, MapPin, DollarSign, Calendar, Tag } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Category, Priority } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

// Helper: Convert number + direction to signed decimal
function toSignedDecimal(value: string, dir: string): number {
  const num = parseFloat(value);
  if (isNaN(num)) return 0;
  return (dir === "S" || dir === "W") ? -num : num;
}

export default function AddItemModal({ isOpen, onClose, userId }: Props) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    country: "",
    category: "adventure" as Category,
    priority: "should" as Priority,
    targetDate: "",
    budget: "",
    currency: "USD",
    tags: "",
    lat: "",
    lng: "",
    latDir: "N",   // NEW: N or S
    lngDir: "E",   // NEW: E or W
  });

  const addItem = useMutation(api.bucketList.addItem);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { lat, lng, latDir, lngDir, budget, targetDate, tags, ...rest } = formData;

    // Convert to signed decimal using the direction
    const latDecimal = toSignedDecimal(lat, latDir);
    const lngDecimal = toSignedDecimal(lng, lngDir);

    await addItem({
      ...rest,
      coordinates: {
        lat: latDecimal,
        lng: lngDecimal,
      },
      targetDate: targetDate ? new Date(targetDate).getTime() : undefined,
      budget: budget ? parseFloat(budget) : undefined,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      userId,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
          <h2 className="font-display text-2xl font-bold text-gray-900">Add New Adventure</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Watch Northern Lights"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
              >
                <option value="adventure">🏔️ Adventure</option>
                <option value="culture">🏛️ Culture</option>
                <option value="food">🍜 Food</option>
                <option value="nature">🌲 Nature</option>
                <option value="relaxation">🏖️ Relaxation</option>
                <option value="photography">📸 Photography</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin size={16} /> Location
              </label>
              <input
                type="text"
                required
                placeholder="City or specific place"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                required
                placeholder="Country name"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Priority</label>
              <select
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                <option value="must">🔴 Must Do</option>
                <option value="should">🟡 Should Do</option>
                <option value="nice">🔵 Nice to Have</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar size={16} /> Target Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign size={16} /> Budget
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Estimated cost"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
                <select
                  className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                  <option>JPY</option>
                  <option>INR</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag size={16} /> Tags
              </label>
              <input
                type="text"
                placeholder="hiking, solo, summer (comma separated)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
          </div>

          {/* ====== UPDATED LATITUDE & LONGITUDE WITH DIRECTION DROPDOWNS ====== */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Latitude</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 36.0423"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  value={formData.lat}
                  onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                />
                <select
                  className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none bg-white"
                  value={formData.latDir}
                  onChange={(e) => setFormData({ ...formData, latDir: e.target.value })}
                >
                  <option value="N">N</option>
                  <option value="S">S</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Longitude</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 138.0838"
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                  value={formData.lng}
                  onChange={(e) => setFormData({ ...formData, lng: e.target.value })}
                />
                <select
                  className="px-3 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 outline-none bg-white"
                  value={formData.lngDir}
                  onChange={(e) => setFormData({ ...formData, lngDir: e.target.value })}
                >
                  <option value="E">E</option>
                  <option value="W">W</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              placeholder="Why do you want to visit this place? What do you want to experience?"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-700 to-orange-600 text-white font-medium hover:from-amber-800 hover:to-orange-700 transition-all shadow-lg"
            >
              Add to Bucket List
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}