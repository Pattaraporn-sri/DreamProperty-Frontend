import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Map from "./Map";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import map from "../img/icons8-map-marker-48.png";

const MapPage = () => {
  const location = useLocation();
  const { lat, lng } = location.state || { lat: 16.4322, lng: 102.8236 }; // ค่าเริ่มต้น
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`/api/properties`);
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.log("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <Breadcrumb className="mt-3 ml-5 font-Prompt">
        <Breadcrumb.Item
          onClick={() => navigate("/")}
          className="cursor-pointer flex"
        >
          <HomeOutlined style={{ fontSize: "20px", marginLeft: "20px" }} />
          <p className="ml-2">หน้าแรก</p>
        </Breadcrumb.Item>

        <Breadcrumb.Item className="flex">
          <img src={map} className="h-7 ml-1 -mt-1" />
          <p className="ml-2 text-[#9D9D9D]">แผนที่</p>
        </Breadcrumb.Item>
      </Breadcrumb>

      <div>
        <Map latlng={[lat, lng]} properties={properties} />
      </div>
    </div>
  );
};

export default MapPage;
