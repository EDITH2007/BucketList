import { MapPin, CheckCircle, Globe, Wallet,} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Stats } from "../types";

interface Props {
  userId: string;
}

export default function StatsDashboard({ userId }: Props) {
  const stats = useQuery(api.bucketList.getStats, { userId }) as Stats | undefined;

  if (!stats) return <div className="h-32 animate-pulse bg-amber-100/50 rounded-2xl" />;

  const cards = [
    { 
      icon: Globe, 
      label: "Countries", 
      value: `${stats.countriesVisited}/${stats.totalCountries}`,
      sub: "Visited / Planned",
      color: "text-blue-700 bg-blue-50" 
    },
    { 
      icon: CheckCircle, 
      label: "Completed", 
      value: `${stats.completionRate}%`,
      sub: `${stats.completed} of ${stats.total} adventures`,
      color: "text-green-700 bg-green-50" 
    },
    { 
      icon: MapPin, 
      label: "Pending", 
      value: stats.pending.toString(),
      sub: "Dreams to chase",
      color: "text-orange-700 bg-orange-50" 
    },
    { 
      icon: Wallet, 
      label: "Budget", 
      value: `$${(stats.totalBudget / 1000).toFixed(1)}k`,
      sub: "Total estimated",
      color: "text-amber-700 bg-amber-50" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div key={card.label} className="travel-card p-5 relative overflow-hidden">
          <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
            <card.icon size={24} />
          </div>
          <h3 className="text-3xl font-display font-bold text-gray-900">{card.value}</h3>
          <p className="text-sm font-medium text-gray-600 mt-1">{card.label}</p>
          <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          
          {/* Decorative background element */}
          <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-gradient-to-br from-gray-100 to-transparent opacity-50" />
        </div>
      ))}
    </div>
  );
}