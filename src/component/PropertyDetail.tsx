import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Property } from "./Type";
import axios from "axios";
import {
  ShieldCheck,
  Dumbbell,
  TreePalm,
  AirVent,
  DoorOpen,
  Video,
  Home,
  WavesLadder,
  HandHeart,
  CarFront,
} from "lucide-react";
import {
  CheckCircleOutlined,
  HeartFilled,
  HeartOutlined,
} from "@ant-design/icons";
import { useFavorites } from "./FavoriteContext";
import { Popover } from "antd";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";
import { Skeleton, Empty } from "antd";
import MapSingleMarker from "./MapSingleMarker";
import phone from "../img/icons8-phone-24.png";
import email from "../img/icons8-email-24.png";
import line from "../img/icons8-line-50.png";

const iconMap: Record<string, JSX.Element> = {
  กล้องวงจรปิด: <Video size={22} />,
  คลับเฮ้าส์: <Home size={22} />,
  เครื่องปรับอากาศ: <AirVent size={22} />,
  ทางเข้าหลัก: <DoorOpen size={22} />,
  ฟิตเนส: <Dumbbell size={22} />,
  "รักษาความปลอดภัย 24 ชม.": <ShieldCheck size={22} />,
  สระว่ายน้ำ: <WavesLadder size={22} />,
  สวนสาธารณะ: <TreePalm size={22} />,
  ห้องยิมนาสติก: <Dumbbell size={22} />,
  สาธารณูปโภค: <HandHeart size={22} />,
  ที่จอดรถ: <CarFront size={22} />,
  รักษาความปลอดภัย24ชม: <ShieldCheck size={22} />,
};

// Component สำหรับแสดง Convenience และ Detail
const PropertyDetails = ({
  convenience,
  detail,
}: {
  convenience: string;
  detail: string;
}) => {
  const formatText = (text?: string) => {
    if (!text) return <p>ไม่มีข้อมูล</p>;

    const items = text
      .replace(/-/g, "\n")
      .split(/\n|-/) // แยกโดยดูทั้ง newline และ "-"
      .map((item) => item.trim())
      .filter(Boolean);

    const uniqueItems = Array.from(new Set(items)); // กรองค่าไม่ให้ซ้ำ

    return items.length > 1 ? (
      <ul>
        {uniqueItems.map((item, index) => (
          <li key={index} className="flex items-center gap-5">
            {iconMap[item] || "-"}
            {item}
          </li>
        ))}
      </ul>
    ) : (
      <p>{text}</p>
    );
  };

  return (
    <div className="ml-3 mt-10">
      <div>
        <h1 className="font-bold text-3xl text-gray-700">ความสะดวกโดยรอบ</h1>
        <div className="mt-3 text-gray-800 text-xl">
          {formatText(convenience)}
        </div>
      </div>

      <div>
        <h1 className="font-bold text-3xl mt-5 text-gray-700">รายละเอียด</h1>
        <div className="mt-3 text-gray-800 text-xl">{formatText(detail)}</div>
      </div>
    </div>
  );
};

// Main Component สำหรับแสดงข้อมูลของบ้าน
const PropertyDetail = () => {
  const { propertyId } = useParams();
  const [house, setHouse] = useState<Property | null>(null); // สถานะบ้านที่ต้องการ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean

  //สุ่มข้อมูลนายหน้าแค่ครั้งเดียว
  const randomAgentRef = useRef<any | null>(null); //สร้าง state สำหรับเก้บนายหน้าที่สุ่ม

  useEffect(() => {
    // ดึงข้อมูลจากไฟล์ JSON หรือ API
    fetch("/propertiesData.json") // หรือใช้ API แทน
      .then((response) => response.json())
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (!propertyId) {
      setError("ไม่พบรหัสทรัพย์");
      setLoading(false);
      return;
    }

    const fetchHouse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/properties/${propertyId}`
        );

        const agentsRespone = await axios.get("http://localhost:3002/agents");

        if (response.data) {
          setHouse(response.data);

          //สุ่มนายหน้าหนึ่งครั้งเมื่อโหลดข้อมูลสำเร็จ
          if (!randomAgentRef.current && agentsRespone.data.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * agentsRespone.data.length
            );
            randomAgentRef.current = agentsRespone.data[randomIndex];
          }
        } else {
          setError("ไม่พบข้อมูลบ้าน");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("ไม่สามารถงข้อมูลบ้านได้");
      } finally {
        setLoading(false);
      }
    };
    fetchHouse();
  }, [propertyId]); //ทำงานเฉพาะเมื่อ propertyId เปลี่ยนแปลง

  if (loading)
    return (
      <div>
        <Skeleton active />
      </div>
    );
  if (error) return <h2>{error}</h2>;
  if (!house)
    return (
      <h2>
        <Empty />
      </h2>
    );

  const latlngRaw = house?.["lat,lng"];

  const latlng = latlngRaw?.split(",").map(Number);

  //ตรวจสอบว่าพิกัดถูกต้องก่อนส่งไปยัง Map
  if (!latlng || latlng.length !== 2 || isNaN(latlng[0]) || isNaN(latlng[1])) {
    console.error("Invalid latlng:", latlng);
  } else {
  }

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLElement>,
  ) => {
    e.preventDefault(); // ป้องกันไม่ให้ event bubble ไปที่ Popover
    const isFavorited = favorites[house.รหัสทรัพย์]; // ตรวจสอบสถานะปัจจุบัน
    toggleFavorite(house.รหัสทรัพย์);

    if (!isFavorited) {
      setOpenPopoverId(house.รหัสทรัพย์); // ถ้าเป็นการเพิ่ม (หัวใจแดง) ให้แสดง pop up

      setTimeout(() => {
        setOpenPopoverId(null);
      }, 2000);
    } else {
      setOpenPopoverId(null);
    }
  };

  const handleOpenChange = (id: string, newOpen: boolean) => {
    setOpenPopoverId(newOpen ? id : null);
  };

  return (
    <div className="font-Prompt mt-10 ml-10">
      <div className="flex justify-center gap-4 mr-5">
        {house.image.split(/\*\*+|\s+/).map((imgUrl) => {
          const cleanUrl = imgUrl.trim();

          return cleanUrl && cleanUrl.startsWith("http") ? (
            <div key={cleanUrl} className="flex">
              <img
                src={cleanUrl}
                alt={`property-${house.รหัสทรัพย์}`}
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          ) : null;
        })}
      </div>

      <div className="font-Prompt">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold ml-3 mt-14 w-[1270px] text-gray-700">
            {house["ชื่ออสังหาริมทรัพย์"]}
          </h1>

          <div className="absolute text-gray-500 ml-[1550px] mt-14">
            <Popover
              title={
                <div className="font-Prompt ml-5 text-zinc-600">
                  เพิ่มรายการโปรดแล้ว!
                </div>
              }
              trigger="click"
              open={openPopoverId === house.รหัสทรัพย์}
              onOpenChange={(newOpen) =>
                handleOpenChange(house.รหัสทรัพย์, newOpen)
              }
            >
              <div
                onClick={handleFavoriteClick}
                className="text-5xl text-gray-500 absolute flex justify-end "
              >
                {favorites[house.รหัสทรัพย์] ? (
                  <HeartFilled style={{ color: "red" }} /> // ถ้าคลิกแล้วให้แสดง HeartFilled เป็นสีแดง
                ) : (
                  <HeartOutlined style={{ color: "gray" }} /> // ถ้ายังไม่คลิกให้แสดง HeartOutlined เป็นสีเทา
                )}
              </div>
            </Popover>
          </div>

          {/*ข้อมูลนายหน้า*/}
          <div className="absolute ml-[1650px] mt-10 bg-slate-100 w-[550px] p-5 rounded-xl shadow-lg">
            {randomAgentRef.current ? (
              <div
                className="font-Prompt text-gray-600"
                key={randomAgentRef.current?.id || randomAgentRef.current?.name}
              >
                <div className="flex">
                  <img
                    src={randomAgentRef.current.image}
                    className="rounded-xl w-48 h-36"
                  />
                  <div>
                    <p className="mt-3 ml-5 text-2xl">
                      {randomAgentRef.current.name}
                      <CheckCircleOutlined className="text-base text-gray-500 ml-3" />
                    </p>

                    <div className="mt-4 ml-5 flex">
                      <img src={phone} />
                      <p className="ml-4">{randomAgentRef.current.phone}</p>
                    </div>
                    <div className="ml-5 mt-1 flex">
                      <img src={email} />
                      <p className="ml-4">{randomAgentRef.current.email}</p>
                    </div>
                    <div className="ml-5 mt-1 flex">
                      <img src={line} className="h-7" />
                      <p className="ml-4">{randomAgentRef.current.line}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>ไม่พบข้อมูลนายหน้า</p>
            )}
          </div>

          {/* แสดงแผนที่โดยส่งพิกัดจาก lat,lng */}
          <div className="ml-[1205px] w-[1000px] mt-36 mb-10">
            <h2 className="mt-8 mb-2 text-2xl text-gray-700 font-bold">
              ตำแหน่งบนแผนที่
            </h2>
            <div>
              {latlng && latlng.length === 2 && (
                <div style={{ width: "100%", height: "500px" }}>
                  <MapSingleMarker latlng={latlng} />
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="ralative ml-3 -mt-[750px] text-3xl text-gray-600">
          ราคา {house["ราคา"]} บาท
        </p>

        <div className="flex mt-5 mb-8 text-xl text-gray-500">
          <p className="ml-5 flex">
            <img src={ruler} className="h-9" />
            <p className="mt-2 ml-2">ขนาดพื้นที่ {house["ขนาดพื้นที่"]}</p>
          </p>

          {/*แสดงเฉพาะประเภท บ้าน คอนโด ทาวน์เฮ้าส์*/}
          {house["ประเภท"] !== "ที่ดิน" && (
            <div className="flex">
              <p key={house["รหัสทรัพย์"]} className="ml-5 flex">
                <img src={bedroom} className="h-9" />
                <p className="ml-5 mt-2">{house["ห้องนอน"] ?? "-"}</p>
              </p>
              <p key={house["รหัสทรัพย์"]} className="ml-5 flex">
                <img src={bathtub} className="h-9" />
                <p className="ml-5 mt-2">{house["ห้องน้ำ"] ?? "-"}</p>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ใช้ PropertyDetails เพื่อแสดงข้อมูลสะดวกและรายละเอียด */}
      <PropertyDetails
        convenience={house["ความสะดวกโดยรอบ"] || "-"}
        detail={house["รายละเอียดอสังหาฯ"] || "-"}
      />

      <div className="ml-3 mt-7 mb-5 text-gray-700 text-lg w-[1000px] bg-gray-100 rounded-lg p-5 shadow-lg">
        <p className="text-xl">{house["เกี่ยวกับ"]}</p>
      </div>
    </div>
  );
};

export default PropertyDetail;
