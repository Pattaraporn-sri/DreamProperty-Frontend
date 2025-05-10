import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl"; // ใช้ MapLibre
import { Property } from "./Type";
import axios from "axios";
import { Breadcrumb, Drawer, Popover } from "antd";
import { Select } from "antd";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "./FavoriteContext";
import { HeartFilled, HeartOutlined, HomeOutlined } from "@ant-design/icons";
import "./Map.css";
import styles from "./Switcher.module.css"; // หรือไฟล์ CSS Module ที่คุณใช้
import mapimg from "../img/icons8-map-marker-48.png";

const baseMaps: Record<string, string> = {
  Streets: "https://tiles.stadiamaps.com/styles/alidade_bright.json",
  Satellite:
    "https://api.maptiler.com/maps/hybrid/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
};

const Map: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("ทั้งหมด");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [markers, setMarkers] = useState<maplibregl.Marker[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  ); //ข้อมูลที่เลือก
  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean
  const [tooltip, setTooltip] = useState<maplibregl.Popup | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null); // ใช้ ref เก็บ div
  const [activeStyle, setActiveStyle] = useState(Object.keys(baseMaps)[0]); // ใช้สำหรับเปลี่ยนสไตล์แผนที่
  const [map, setMap] = useState<maplibregl.Map | null>(null); // ใช้สำหรับเปลี่ยนสไตล์แผนที่
  const navigate = useNavigate();

  //ฟังก์ชันดึงข้อมูลจาก API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get("http://localhost:3002/properties");
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

    //กรองตามประเภท
    if (selectedType !== "ทั้งหมด") {
      filtered = filtered.filter((p) => p.ประเภท === selectedType);
    }

    //กรองตามช่วงราคา
    if (selectedPriceRange !== "ทั้งหมด") {
      filtered = filtered.filter((p) => {
        const price = parseFloat(p.ราคา.replace(/[^0-9.]/g, "")); //แปลงราคาเป็นตัวเลข
        if (selectedPriceRange === "ต่ำกว่า 1 ล้าน") return price < 1_000_000;
        if (selectedPriceRange === "1 - 3 ล้าน")
          return price >= 1_000_000 && price <= 3_000_000;
        if (selectedPriceRange === "3 - 5 ล้าน")
          return price > 3_000_000 && price <= 5_000_000;
        if (selectedPriceRange === "5 - 10 ล้าน")
          return price > 5_000_000 && price <= 10_000_000;
        if (selectedPriceRange === "มากกว่า 10 ล้าน") return price > 10_000_000;
        return true;
      });
    }
    setFilteredProperties(filtered);
  }, [selectedType, selectedPriceRange, properties]);

  //โหลดแผนที่เมื่อคอมโพแนนต์ถูกโหลดครั้งแรก
  useEffect(() => {
    if (!map && mapContainerRef.current) {
      // สร้างแผนที่เมื่อคอมโพเนนต์ถูกโหลด
      const newMap = new maplibregl.Map({
        container: mapContainerRef.current, //mapContainerRef ถูกใช้งานที่นี้
        style: baseMaps[activeStyle], //ใช้เพื่อสลับแผนที่
        center: [102.8236, 16.4322], // จุดเริ่มต้น (Lng, Lat)
        zoom: 12, // ระดับซูมเริ่มต้น
        pitch: 60,
        bearing: 82,
        cooperativeGestures: true, //fullscreen
      });

      newMap.addControl(new maplibregl.FullscreenControl()); //เพิ่มปุ่ม Fullscreen
      newMap.addControl(new maplibregl.NavigationControl(), "top-right"); //เพิ่มการควบคุมการซูมและการหมุน

      // หลังจากแผนที่โหลดแล้ว เราจะเพิ่ม layer สำหรับแสดงอาคาร 3D
      newMap.on("load", () => {
        const layers = newMap.getStyle().layers;
        let labelLayerId; // ค้นหาชั้น layer ที่แสดง label (เช่น ชื่อสถานที่)
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

        //------- เพิ่ม layer 3D สำหรับอาคาร ----------
        if (labelLayerId) {
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
        }

        //เพิ่มหมุดจาก filteredProperties
        if (filteredProperties.length > 0) {
          const newMarkers: maplibregl.Marker[] = [];
          filteredProperties.forEach((property) => {
            if (property.location?.coordinates) {
              const [lng, lat] = property.location.coordinates;

              const marker = new maplibregl.Marker({ color: "red"})
                .setLngLat([lng, lat])
                .addTo(newMap);

              const defaultImage =
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"; // รูปเริ่มต้น กรณีไม่มีรูป

              const popup = new maplibregl.Popup({
                offset: 25,
                closeButton: false,
              }).setLngLat([lng, lat]).setHTML(`<div border-radius: 20px;">
                <img src="${
                  property.image
                    ? property.image.split(/\*\*+|\*\*\*+/)[0].trim()
                    : defaultImage
                }"
              alt="property-image" 
              style="width: 250px; height: 100px; object-fit: cover; border-radius: 3px;" 
              onerror="this.onerror=null; this.src='${defaultImage}';"
            />
            <p style="font-size: 13px; font-family: Prompt; font-weight: bold; color:#4b5563; margin-top: 10px;">${
              property.ชื่ออสังหาริมทรัพย์
            }</p>
            <p style="color: #4b5563; font-size: 12px; font-family: Prompt;">${
              property.ราคา
            } ฿</p>
            <p style="color: #4b5563; font-size: 12px; font-family: Prompt;">${
              property.ประเภท
            }</p>
          </div>`);

              marker.getElement().addEventListener("mouseenter", () => {
                setTooltip(popup);
                popup.addTo(newMap);
              });

              marker.getElement().addEventListener("mouseleave", () => {
                popup.remove(); // ซ่อน tooltip เมื่อไม่ hover
              });

              marker.getElement().addEventListener("click", () => {
                //ซูมเข้าไปที่หมุดก่อน
                newMap.flyTo({
                  center: [lng, lat],
                  zoom: 18,
                  essential: true, //ทำให้การซูมเป้นส่วนสำคัญของแอนิเมชั่น
                });

                //เมื่อการซูมเสร็จแล้ว ให้เปิด drawer
                newMap.once("moveend", () => {
                  setSelectedProperty(property);
                  setOpen(true);
                });
              });

              newMarkers.push(marker);
            }
          });
          setMarkers((prevMarkers) => [...prevMarkers, ...newMarkers]);
        }
      });

      return () => {
        newMap.remove();
        setMap(null);
      };
    }
  }, [activeStyle, filteredProperties]); //ทำให้แผนที่อัพเดตตามค่า filteredProperties

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

  //ควบคุมการกดหัวใจ
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
      <Breadcrumb
        className="ml-5 font-Prompt"
        items={[
          {
            title: (
              <div
                className="cursor-pointer flex"
                onClick={() => navigate("/")}
              >
                <HomeOutlined
                  style={{ fontSize: "15px", marginLeft: "20px" }}
                />
                <p className="ml-2">หน้าแรก</p>
              </div>
            ),
          },
          {
            title: (
              <div className="flex">
                <img src={mapimg} className="h-5 ml-1" alt="แผนที่" />
                <p className="ml-2 text-[#9D9D9D]">แผนที่</p>
              </div>
            ),
          },
        ]}
      />

      {/* สวิตช์เลอร์แผนที่ */}
      <div className={styles.switcher + " absolute bottom-8 left-10 z-10"}>
        {Object.keys(baseMaps).map((name) => (
          <button
            key={name}
            className={`${styles.basemap} ${
              activeStyle === name ? styles.active : ""
            }`}
            onClick={() => setActiveStyle(name)} // เมื่อคลิกที่แผนที่, สลับไปใช้สไตล์นั้น
            aria-label={`Switch to ${name} map`} // เพิ่ม aria-label เพื่อให้สามารถเข้าถึงได้
          >
            <img
              src={`https://cloud.maptiler.com/static/img/maps/${name.toLowerCase()}.png`}
              alt={name}
            />
          </button>
        ))}
      </div>

      {/*แผนที่*/}
      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height: "84.5vh",
          position: "relative",
          marginTop: "15px",
        }}
      >
        {/* Dropdown กรองช่วงราคา */}
        <Select
          value={selectedPriceRange}
          onChange={(value) => setSelectedPriceRange(value)}
          style={{ width: 200 }}
          className="z-10 font-Prompt rounded-lg top-4 left-5 h-7"
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
        {/* ปุ่มเลือกประเภทอสังหา */}
        <div className="absolute top-4 left-60 z-10 bg-white p-2 rounded-lg shadow-lg flex gap-2">
          {["ทั้งหมด", "บ้าน", "คอนโด", "ที่ดิน", "ทาวน์เฮ้าส์"].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2 py-2 text-xs font-Prompt rounded-lg transition-all duration-300 ${
                selectedType === type
                  ? "bg-gray-400 shadow-lg scale-105"
                  : "bg-gray-200 hover:bg-gray-500 hover:scale-105"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <Drawer
        title=""
        placement="right"
        onClose={closeDrawer}
        open={open}
        width={450}
      >
        {selectedProperty && (
          <div>
            <div className="absolute bg-slate-200 rounded-full w-10 h-10 flex justify-center items-center ml-[350px] mt-3">
              <Popover
                title={
                  <div className="font-Prompt text-center -mb-2 text-sm text-zinc-600">
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
                  className="text-xl "
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
                    width: "400px",
                    height: "200px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    marginBottom: "10px",
                  }}
                />
              )}

            {/*ข้อมูลอสังหาริมทรัพย์*/}
            <div className="text-gray-600 font-Prompt">
              <p className="text-xl mt-5 font-bold">
                {selectedProperty.ชื่ออสังหาริมทรัพย์}
              </p>
              <p className="text-lg mt-4">฿ {selectedProperty.ราคา}</p>

              <div className="flex mt-5 text-xs">
                <div className="flex gap-2">
                  <img src={ruler} className="h-5" />
                  <p className="mt-1">{selectedProperty.ขนาดพื้นที่}</p>
                </div>
                <div className="flex ml-5 gap-2">
                  <img src={bedroom} className="h-5" />
                  <p className="mt-1">{selectedProperty.ห้องนอน}</p>
                </div>
                <div className="flex ml-5 gap-2">
                  <img src={bathtub} className="h-5" />
                  <p className="mt-1">{selectedProperty.ห้องน้ำ}</p>
                </div>
              </div>

              <p className="text-sm mt-3">{selectedProperty.เกี่ยวกับ}</p>
              <p className="text-sm mt-3">{selectedProperty.ประเภท}</p>
              <div className="absolute bottom-5">
                <Link
                  to={`/properties/${selectedProperty.รหัสทรัพย์}`}
                  key={selectedProperty.รหัสทรัพย์}
                >
                  <button className="bg-slate-300 hover:bg-slate-400 text-sm w-16 h-8 rounded-xl">
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
