import React, { useEffect, useState } from "react";
import MapSingleMarker from "./MapSingleMarker";
import { property } from "./Data";

interface Property {
  latLng: string;
}

const PropertyList: React.FC = () => {
  const [propertyData, setPropertyData] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:3002/api/properties");
        if (!response.ok) throw new Error("Failed to fetch properties");

        const data = await response.json();
        console.log("Data from API:", data);
        setPropertyData(data);
      } catch (error) {
        setError("ไ่สามารถโหลดข้อมูลได้");
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  return (
    <div>
      <h2>ตำแหน่งบนแผนที่</h2>
      <div>
        {loading ? (
          <p>กำลังโหลดข้อมูล</p>
        ) : error ? (
          <p>{error}</p>
        ) : propertyData.length > 0 ? (
          propertyData.map((property, idx) => {
            if (!property.latLng) return null;

            const [lat, lng] = property.latLng.split(",").map(Number);
            if (isNaN(lat) || isNaN(lng)) return null;

            return <MapSingleMarker key={idx} latlng={[lat, lng]} />;
          })
        ) : (
          <p> ไม่พบข้อมูล</p>
        )}
      </div>
    </div>
  );
};

export default PropertyList;
