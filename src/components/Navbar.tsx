import { Globe, MapPin, Compass } from "lucide-react";

interface NavbarProps {
  onNewAdventure: () => void;
}

export default function Navbar({ onNewAdventure }: NavbarProps) {
  return (
    <nav className="glass-panel sticky top-0 z-50 border-b border-amber-900/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-700 to-orange-600 rounded-xl flex items-center justify-center text-white">
            <Globe size={20} />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-amber-900">
              Before I Die
            </h1>
            <p className="text-xs text-amber-700/60 tracking-widest uppercase">
              Live the Story Worth Telling.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm text-amber-800/70">
            <MapPin size={16} />
            <span>Explore the World</span>
          </div>
          <button 
            onClick={onNewAdventure}
            className="bg-amber-800 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-amber-900 transition-colors flex items-center gap-2"
          >
            <Compass size={18} />
            New Adventure
          </button>
        </div>
      </div>
    </nav>
  );
}