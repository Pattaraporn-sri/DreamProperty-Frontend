// import { createContext, useContext, useRef } from "react";
// import maplibregl from "maplibre-gl";

// type MapContextType = {
//   map: maplibregl.Map | null;
//   mapContainerRef: React.RefObject<HTMLDivElement>;
// };

// const MapContext = createContext<MapContextType | null>(null);

// export const MapProvider = ({ children }: { children: React.ReactNode }) => {
//   const mapRef = useRef<maplibregl.Map | null>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);

//   return (
//     <MapContext.Provider value={{ map: mapRef.current, mapContainerRef }}>
//       {children}
//     </MapContext.Provider>
//   );
// };

// export const useMap = () => {
//   const context = useContext(MapContext);
//   if (!context) throw new Error("useMap must be used within a MapProvider");
//   return context;
// };
