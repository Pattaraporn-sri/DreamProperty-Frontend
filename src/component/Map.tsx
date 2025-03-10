import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl"; // ใช้ MapLibre
import { Property } from "./Type";
import axios from "axios";
import { Drawer, Popover } from "antd";
import { Select } from "antd";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";
import { Link } from "react-router-dom";
import { useFavorites } from "./FavoriteContext";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";

const Map: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("ทั้งหมด");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [markers, setMarkers] = useState<maplibregl.Marker[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // ใช้ ref เก็บ div
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  ); //ข้อมูลที่เลือก
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean

  //ฟังก์ชันดึงข้อมูลจาก API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:3002/properties");
        console.log("Fetched properties:", response.data);
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("ไม่สามารถดึงข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const priceRange = [
    { lable: "ทั้งหมด", value: "ทั้งหมด" },
    { label: "ต่ำกว่า 1 ล้าน", value: "ต่ำกว่า 1 ล้าน" },
    { label: "1 - 3 ล้าน", value: "1 - 3 ล้าน" },
    { label: "3 - 5 ล้าน", value: "3 - 5 ล้าน" },
    { label: "5 -10 ล้าน", value: "5 - 10 ล้าน" },
    { label: "มากกว่า 10 ล้าน", value: "มากกว่า 10 ล้าน" },
  ];

  const [selectedPriceRange, setSelectedPriceRange] =
    useState<string>("เรทราคา");

  useEffect(() => {
    let filtered = properties;

    // //กรองตามประเภท
    if (selectedType !== "ทั้งหมด") {
      filtered = filtered.filter((p) => p.ประเภท === selectedType);
    }

    //กรองตามช่วงราคา
    if (selectedPriceRange !== "ทั้งหมด") {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.ราคา.replace(/[^0-9.]/g, "")); //แปลงราคาเป็นตัวเลข
        if (selectedPriceRange === "ต่ำกว่า 1 ล้าน") return price < 1_000_000;
        if (selectedPriceRange === "1-3 ล้าน")
          return price >= 1_000_000 && price <= 3_000_000;
        if (selectedPriceRange === "3-5 ล้าน")
          return price > 3_000_000 && price <= 5_000_000;
        if (selectedPriceRange === "5-10 ล้าน")
          return price > 5_000_000 && price <= 10_000_000;
        if (selectedPriceRange === "มากกว่า 10 ล้าน") return price > 10_000_000;
        return true;
      });
    }

    setFilteredProperties(filtered);
  }, [selectedType, selectedPriceRange, properties]);

  // อัปเดต filteredProperties ตามประเภทที่เลือก
  useEffect(() => {
    const filtered =
      selectedType === "ทั้งหมด"
        ? properties
        : properties.filter((p) => p.ประเภท === selectedType);

    setFilteredProperties(filtered);
  }, [selectedType, properties]);

  //โหลดแผนที่เมื่อคอมโพแนนต์ถูกโหลดครั้งแรก
  useEffect(() => {
    if (!mapContainerRef.current) return; //ป้องกัน error

    if (!mapRef.current) {
      // สร้างแผนที่เมื่อคอมโพเนนต์ถูกโหลด
      const newMap = new maplibregl.Map({
        container: mapContainerRef.current,
        style: "https://tiles.stadiamaps.com/styles/alidade_bright.json", // รูปแบบแผนที่
        center: [102.8236, 16.4322], // จุดเริ่มต้น (Long, Lat)
        zoom: 13, // ระดับซูมเริ่มต้น
        pitch: 60,
        bearing: 82,
      });

      //เพิ่มการควบคุมการซูมและการหมุน
      newMap.addControl(new maplibregl.NavigationControl(), "top-right");

      // หลังจากแผนที่โหลดแล้ว เราจะเพิ่ม layer สำหรับแสดงอาคาร 3D
      newMap.on("load", () => {
        const layers = newMap.getStyle().layers;

        // ค้นหาชั้น layer ที่แสดง label (เช่น ชื่อสถานที่)
        let labelLayerId;
        for (let i = 0; i < layers.length; i++) {
          if (
            layers[i].type === "symbol" &&
            layers[i].layout &&
            (layers[i].layout as any)["text-field"]
          ) {
            labelLayerId = layers[i].id;
            break;
          }
        }

        // เพิ่ม layer 3D สำหรับอาคาร
        newMap.addLayer(
          {
            id: "3d-buildings",
            source: "openmaptiles",
            "source-layer": "building",
            filter: ["!", ["to-boolean", ["get", "hide_3d"]]],
            type: "fill-extrusion",
            minzoom: 13,
            paint: {
              "fill-extrusion-color": "lightgray",
              "fill-extrusion-height": [
                "interpolate",
                ["linear"],
                ["zoom"],
                13,
                0,
                16,
                ["get", "render_height"],
              ],
              "fill-extrusion-base": [
                "case",
                [">=", ["get", "zoom"], 16],
                ["get", "render_min_height"],
                0,
              ],
            },
          },
          labelLayerId // เพิ่มชั้นนี้ตรงใต้ label
        );
      });

      mapRef.current = newMap;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [filteredProperties]); //ทำให้แผนที่อัพเดตตามค่า filteredProperties

  //อัปเดตหมุดเมื่อ filterPropertied เปลี่ยนแปลง
  useEffect(() => {
    if (!mapRef.current) return; //ถ้าแผนที่ยังไม่โหลด ไม่ต้องทำอะไร

    //ลบหมุดเก่าก่อน
    markers.forEach((marker) => marker.remove());
    const newMarkers: maplibregl.Marker[] = [];

    filteredProperties.forEach((property) => {
      if (!property.location || !property.location.coordinates) return;

      const [lng, lat] = property.location.coordinates;

      const marker = new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapRef.current!);

      marker.getElement().addEventListener("click", () => {
        //ซูมเข้าไปที่หมุดก่อน
        mapRef.current?.flyTo({
          center: [lng, lat],
          zoom: 18,
          essential: true, //ทำให้การซูมเป้นส่วนสำคัญของแอนิเมชั่น
        });

        //เมื่อการซูมเสร็จแล้ว ให้เปิด drawer
        mapRef.current?.once("moveend", () => {
          setSelectedProperty(property);
          setOpen(true);
        });
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
  }, [filteredProperties]);

  // ฟังก์ชันจัดการการแสดงผลรูปภาพหลายรูป
  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    images: string[]
  ) => {
    const target = e.target as HTMLImageElement;
    const currentIndex = images.indexOf(target.src);

    // ถ้าเป็นรูปภาพแรกที่เกิดปัญหา ให้ลองใช้รูปถัดไป
    if (currentIndex < images.length - 1) {
      target.src = images[currentIndex + 1]; // ใช้รูปภาพถัดไป
    } else {
      target.src =
        "https://th1-cdn.pgimgs.com/listing/11694849/UPHO.126248215.V800/ASHTON-Chula-Silom-%E0%B9%81%E0%B8%AD%E0%B8%8A%E0%B8%95%E0%B8%B1%E0%B8%99-%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2-%E0%B8%AA%E0%B8%B5%E0%B8%A5%E0%B8%A1-%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81-Thailand.jpg"; // กำหนดภาพสำรองหากทุกรูปภาพไม่สามารถโหลดได้
    }
  };

  //ปิด Drawer
  const closeDrawer = () => {
    setOpen(false);
    setSelectedProperty(null);
  };

  const handleOpenChange = (id: string, newOpen: boolean) => {
    setOpenPopoverId(newOpen ? id : null);
  };

  //ควรคุมการกดหัวใจ
  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    e.preventDefault(); // ป้องกันไม่ให้ event bubble ไปที่ Popover

    // const isFavorited = !!favorites[id]; // ตรวจสอบสถานะปัจจุบัน
    toggleFavorite(id);

    if (!favorites[id]) {
      setOpenPopoverId(id); // ถ้าเป็นการเพิ่ม (หัวใจแดง) ให้แสดง pop up

      setTimeout(() => {
        setOpenPopoverId(null);
      }, 2000);
    } else {
      setOpenPopoverId(null);
    }
  };

  if (loading) return <p>กำลังโหลดแผนที่...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {/*แผนที่*/}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "86.8vh",
          position: "relative",
        }}
      >
        {/* ปุ่มเลือกประเภทอสังหา */}
        <div className="absolute top-4 left-60 z-10 bg-white p-2 rounded-lg shadow-lg flex gap-2">
          {["ทั้งหมด", "บ้าน", "คอนโด", "ที่ดิน", "ทาวน์เฮ้าส์"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 text-base font-Prompt rounded-lg transition-all duration-300 ${
                selectedType === type
                  ? "bg-gray-400 shadow-lg scale-105"
                  : "bg-gray-200 hover:bg-gray-500 hover:scale-105"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Dropdown กรองช่วงราคา */}
        <Select
          value={selectedPriceRange}
          onChange={(value) => setSelectedPriceRange(value)}
          style={{ width: 200 }}
          className="z-10 font-Prompt rounded-lg top-4 left-5 h-10"
        >
          {priceRange.map((range) => (
            <Select.Option
              key={range.value}
              value={range.value}
              className="font-Prompt"
            >
              {range.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Drawer
        title=""
        placement="right"
        onClose={closeDrawer}
        open={open}
        width={600}
      >
        {selectedProperty && (
          <div>
            <div className="absolute bg-slate-200 rounded-full w-14 h-14 flex justify-center items-center ml-[480px] mt-3">
              <Popover
                title={
                  <div className="font-Prompt ml-2 mt-2 text-lg text-zinc-600">
                    เพิ่มรายการโปรดแล้ว!
                  </div>
                }
                trigger="click"
                open={openPopoverId === selectedProperty.รหัสทรัพย์}
                onOpenChange={(newOpen) =>
                  handleOpenChange(selectedProperty.รหัสทรัพย์, newOpen)
                }
              >
                <div
                  key={selectedProperty.รหัสทรัพย์}
                  className="text-4xl "
                  onClick={(e) =>
                    handleFavoriteClick(e, selectedProperty.รหัสทรัพย์)
                  }
                >
                  {favorites[selectedProperty.รหัสทรัพย์] ? (
                    <HeartFilled style={{ color: "red" }} /> // ถ้าคลิกแล้วให้แสดง HeartFilled เป็นสีแดง
                  ) : (
                    <HeartOutlined style={{ color: "gray" }} /> // ถ้ายังไม่คลิกให้แสดง HeartOutlined เป็นสีเทา
                  )}
                </div>
              </Popover>
            </div>
            {selectedProperty.image &&
              selectedProperty.image
                .split(/\*\*+|\*\*\*+/)[0]
                .startsWith("http") && (
                <img
                  src={selectedProperty.image.split(/\*\*+|\*\*\*+/)[0].trim()}
                  alt="property-image"
                  onError={(e) =>
                    handleImageError(
                      e,
                      selectedProperty.image.split(/\*\*+|\*\*\*+/)
                    )
                  }
                  style={{
                    width: "100%",
                    height: "350px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}

            {/*ข้อมูลอสังหาริมทรัพย์*/}
            <div className="text-gray-600 font-Prompt">
              <p className="text-4xl mt-5 font-bold">
                {selectedProperty.ชื่ออสังหาริมทรัพย์}
              </p>
              <p className="text-2xl mt-4">฿ {selectedProperty.ราคา}</p>

              <div className="flex mt-5 text-lg">
                <div className="flex gap-3">
                  <img src={ruler} className="h-8" />
                  <p className="mt-1">{selectedProperty.ขนาดพื้นที่}</p>
                </div>
                <div className="flex ml-5 gap-3">
                  <img src={bedroom} className="h-8" />
                  <p className="mt-1">{selectedProperty.ห้องนอน}</p>
                </div>
                <div className="flex ml-5 gap-3">
                  <img src={bathtub} className="h-8" />
                  <p className="mt-1">{selectedProperty.ห้องน้ำ}</p>
                </div>
              </div>

              <p className="text-lg mt-3">{selectedProperty.เกี่ยวกับ}</p>
              <p className="text-base mt-3">{selectedProperty.ประเภท}</p>
              <div className="absolute bottom-5">
                <Link
                  to={`/properties/${selectedProperty.รหัสทรัพย์}`}
                  key={selectedProperty.รหัสทรัพย์}
                >
                  <button className="bg-slate-300 hover:bg-slate-400 text-base w-20 h-10 rounded-xl">
                    เพิ่มเติม
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Map;
