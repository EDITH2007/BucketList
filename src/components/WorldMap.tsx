import { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import { BucketItem } from "../types";

interface Props {
  items: BucketItem[];
}

export default function WorldMap({ items }: Props) {
  const globeRef = useRef<any>();
  const [countries, setCountries] = useState({ features: [] });

  // Fetch country boundaries for the polygon layer
  useEffect(() => {
    fetch("https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson")
      .then((res) => res.json())
      .then((data) => setCountries(data));
  }, []);

  // Center on first item and lock zoom
  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().enableZoom = false;

      if (items.length > 0) {
        const firstItem = items[0];
        globeRef.current.pointOfView({
          lat: firstItem.coordinates.lat,
          lng: firstItem.coordinates.lng,
          altitude: 2.0,
        }, 1000);
      }
    }
  }, [items]);

  // Prepare data for points (exact coordinate markers)
  const pointsData = items.map((item) => ({
    ...item,
    lat: item.coordinates.lat,
    lng: item.coordinates.lng,
    color: item.completed ? "#16a34a" : "#ea580c", // green = completed, orange = wishlist
    altitude: 0.01, // Slightly above surface for visibility
  }));

  // Prepare data for HTML markers (custom pins)
  const htmlMarkersData = items.map((item) => ({
    ...item,
    lat: item.coordinates.lat,
    lng: item.coordinates.lng,
    altitude: 0.05, // Higher above surface for the pin
  }));

  return (
    <div className="travel-card p-6 mb-8 relative overflow-hidden bg-white rounded-2xl shadow-md border border-amber-100 max-w-4xl mx-auto">
      <h3 className="font-display text-xl text-amber-900 mb-4 flex items-center gap-2 font-semibold">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
        Your Interactive World Globe
      </h3>

      <div className="relative w-full aspect-[4/3] bg-sky-50/50 rounded-xl overflow-hidden border border-amber-200/40 flex justify-center items-center cursor-grab active:cursor-grabbing">
        <Globe
          ref={globeRef}
          width={800}
          height={600}
          backgroundColor="rgba(0,0,0,0)"
          
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-day.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          
          // Country Polygons
          polygonsData={countries.features}
          polygonAltitude={0.005}
          polygonSideColor={() => "rgba(0, 0, 0, 0)"}
          polygonStrokeColor={() => "rgba(255, 255, 255, 0.4)"}
          polygonCapColor={() => "rgba(255, 255, 255, 0)"}
          
          // EXACT COORDINATE MARKERS — 3D Points on the surface
          pointsData={pointsData}
          pointLat="lat"
          pointLng="lng"
          pointColor="color"
          pointAltitude="altitude"
          pointRadius={0.25}
          pointResolution={8}
          
          // HTML MARKERS — Custom pins above the points
          htmlElementsData={htmlMarkersData}
          htmlLat="lat"
          htmlLng="lng"
          htmlAltitude="altitude"
          htmlElement={(d: any) => {
            const el = document.createElement("div");
            el.innerHTML = `
              <div style="
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                transform: translate(-50%, -100%);
                filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
              ">
                <div style="
                  background: ${d.completed ? "#16a34a" : "#ea580c"};
                  color: white;
                  padding: 2px 8px;
                  border-radius: 12px;
                  font-size: 11px;
                  font-weight: 600;
                  white-space: nowrap;
                  margin-bottom: 2px;
                  font-family: system-ui, sans-serif;
                ">
                  ${d.location}
                </div>
                <svg width="20" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
                    fill="${d.completed ? "#16a34a" : "#ea580c"}" 
                    stroke="white" 
                    stroke-width="1.5"/>
                  <circle cx="12" cy="9" r="2.5" fill="white"/>
                </svg>
              </div>
            `;
            return el;
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-4 text-sm text-amber-800 font-medium">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-orange-600" />
          <span>Wishlist ({items.filter((i) => !i.completed).length})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-600" />
          <span>Completed ({items.filter((i) => i.completed).length})</span>
        </div>
      </div>
    </div>
  );
}