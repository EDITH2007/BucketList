import { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { BucketItem } from "../types";

interface Props {
  items: BucketItem[];
}

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function WorldMap({ items }: Props) {
  const dots = useMemo(() => {
    return items.map((item) => ({
      id: item._id,
      lng: item.coordinates.lng,
      lat: item.coordinates.lat,
      completed: item.completed,
      location: item.location,
    }));
  }, [items]);

  return (
    <div className="travel-card p-6 mb-8 relative overflow-hidden bg-gradient-to-b from-blue-900 to-blue-950">
      <h3 className="font-display text-xl text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
        Your World Map
      </h3>

      <div className="relative w-full aspect-[2/1] bg-blue-900/50 rounded-xl overflow-hidden border border-blue-800/30">
        <ComposableMap
          projectionConfig={{ scale: 140 }}
          width={800}
          height={400}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="rgba(255,255,255,0.12)"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { fill: "rgba(255,255,255,0.2)", outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {dots.map((dot) => {
            // Convert lng/lat to the same 0-100% positioning the map projection uses internally
            // react-simple-maps handles projection for Geography, but for plain overlay dots
            // we approximate using equirectangular percent positioning matching scale={140}.
            return null;
          })}
        </ComposableMap>

        {/* Overlay dots positioned with simple equirectangular percent math (matches default Mercator-ish framing closely enough at this zoom level) */}
        {dots.map((dot) => {
          const x = ((dot.lng + 180) / 360) * 100;
          const y = ((90 - dot.lat) / 180) * 100;
          return (
            <div
              key={dot.id}
              className="absolute group cursor-pointer"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              <div
                className={`w-3 h-3 rounded-full ${
                  dot.completed ? "bg-green-400" : "bg-orange-400"
                } shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-150`}
              >
                {dot.completed && (
                  <div className="w-full h-full rounded-full animate-ping bg-green-400 opacity-75" />
                )}
              </div>

              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-white rounded-lg shadow-xl text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {dot.location}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-6 mt-4 text-sm text-blue-200">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-400" />
          <span>Wishlist ({items.filter((i) => !i.completed).length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span>Completed ({items.filter((i) => i.completed).length})</span>
        </div>
      </div>
    </div>
  );
}