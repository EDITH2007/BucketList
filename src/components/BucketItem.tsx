import { useState } from "react";

import { Check, Trash2, Edit2, MapPin, Calendar, DollarSign, Tag, X, Save } from "lucide-react";

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



const categoryIcons: Record<string, string> = {

  adventure: "🏔️",

  culture: "🏛️",

  food: "🍜",

  nature: "🌲",

  relaxation: "🏖️",

  photography: "📸",

};

const priorities = ["must", "should", "nice"] as const;



export default function BucketItemCard({ item }: Props) {

  const [isHovered, setIsHovered] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    title: item.title,
    description: item.description,
    location: item.location,
    priority: item.priority,
    targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : "",
    budget: item.budget?.toString() || "",
    tags: item.tags.join(", "),
  });

  const toggleComplete = useMutation(api.bucketList.toggleComplete);

  const deleteItem = useMutation(api.bucketList.deleteItem);

  const updateItem = useMutation(api.bucketList.updateItem);



  const handleEditClick = () => {
    setEditForm({
      title: item.title,
      description: item.description,
      location: item.location,
      priority: item.priority,
      targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : "",
      budget: item.budget?.toString() || "",
      tags: item.tags.join(", "),
    });
    setIsEditing(true);
    setIsHovered(false);
  };



  const handleCancel = () => {
    setIsEditing(false);
  };



  const handleSave = async () => {
    const parsedTags = editForm.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const parsedBudget = editForm.budget ? parseFloat(editForm.budget) : undefined;

    const parsedTargetDate = editForm.targetDate
      ? new Date(editForm.targetDate).getTime()
      : undefined;

    await updateItem({
      id: item._id,
      updates: {
        title: editForm.title,
        description: editForm.description,
        location: editForm.location,
        priority: editForm.priority as "must" | "should" | "nice",
        targetDate: parsedTargetDate,
        budget: parsedBudget,
        tags: parsedTags,
      },
    });

    setIsEditing(false);
  };



  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };



  // Edit Mode UI
  if (isEditing) {
    return (
      <div className={`travel-card relative p-5 category-${item.category}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-display text-lg font-semibold text-gray-900">Edit Item</h3>
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Cancel"
            >
              <X size={18} />
            </button>
            <button
              onClick={handleSave}
              className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
              title="Save"
            >
              <Save size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Title</label>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => handleFormChange("title", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => handleFormChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
            <textarea
              value={editForm.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
            <select
              value={editForm.priority}
              onChange={(e) => handleFormChange("priority", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {priorities.map((pri) => (
                <option key={pri} value={pri}>
                  {priorityConfig[pri].label}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Budget */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Target Date</label>
              <input
                type="date"
                value={editForm.targetDate}
                onChange={(e) => handleFormChange("targetDate", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Budget</label>
              <input
                type="number"
                value={editForm.budget}
                onChange={(e) => handleFormChange("budget", e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={editForm.tags}
              onChange={(e) => handleFormChange("tags", e.target.value)}
              placeholder="tag1, tag2, tag3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    );
  }



  // Normal View Mode
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

          <button
            onClick={handleEditClick}
            className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
          >

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