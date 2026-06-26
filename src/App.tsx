import { useState } from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import Navbar from "./components/Navbar";
import StatsDashboard from "./components/StatsDashboard";
import BucketList from "./components/BucketList";
import AddItemModal from "./components/AddItemModal";
import { Compass } from "lucide-react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

// In production, use your auth provider (Clerk, Auth0, etc.)
const USER_ID = "user_123"; // Replace with actual auth

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ConvexProvider client={convex}>
      <div className="min-h-screen bg-[#F5F1E8]">
        <Navbar />
        
        <main className="max-w-7xl mx-auto px-6 py-8">
          <StatsDashboard userId={USER_ID} />
          <BucketList userId={USER_ID} />
        </main>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-amber-700 to-orange-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-40"
        >
          <Compass size={24} />
        </button>

        <AddItemModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          userId={USER_ID}
        />
      </div>
    </ConvexProvider>
  );
}

export default App;