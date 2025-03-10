import { useEffect, useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css"; // สไตล์ของ MapLibre
import maplibregl from "maplibre-gl";

const MapSingleMarker = ({ latlng }: { latlng: number[] }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null); //Ref สำหรับเก็บ container ของแผนที่

  useEffect(() => {
    if (!mapContainer.current) return;

    //ตรวจสอบค่าพิกัดก่อนใช้งาน
    if (
      !latlng ||
      latlng.length !== 2 ||
      typeof latlng[0] !== "number" ||
      typeof latlng[1] !== "number"
    ) {
      console.error("Invalid latlng:", latlng);
      return;
    }

    const [lat, lng] = latlng; //ดึงค่าพิกัดจาก prop

    // ✅ ตรวจสอบค่าพิกัดก่อนสร้างแผนที่
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      console.error("Invalid lat/lng values:", { lng, lat });
      return;
    }

    // สร้างแผนที่
    const map = new maplibregl.Map({
      container: mapContainer.current!, // container ที่จะใส่แผนที่
      style:
        "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
      center: [lng, lat], // ตำแหน่งศูนย์กลาง
      zoom: 14, // ระดับการซูม
    });

    //Add zoom and rotation controls to the map
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // เพิ่ม Marker ไปยังแผนที่
    new maplibregl.Marker()
      .setLngLat([lng, lat]) // ตั้งตำแหน่งของ Marker
      .addTo(map); // เพิ่ม Marker ลงในแผนที่

    return () => {
      map.remove(); // ทำความสะอาดเมื่อคอมโพแนนต์ unmount
    };
  }, [latlng]);

  return <div ref={mapContainer} style={{ width: "100%", height: "100%", borderRadius: "5px" }} />; // กำหนดขนาดของแผนที่
};

export default MapSingleMarker;
