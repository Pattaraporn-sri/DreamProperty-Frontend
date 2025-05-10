import React, { useState, useEffect } from "react";
import { Property } from "./Type";
import { Link } from "react-router-dom";
import { HeartFilled, HeartOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import basket from "../img/icons8-basket-48 (1).png";
import { useFavorites } from "./FavoriteContext";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";

const PropertyList: React.FC = () => {
  const [buys, setBuys] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const apiUrl = "http://localhost:3002/properties";
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล" + response.status);
        }

        const data = await response.json();
        setBuys(data);
      } catch (error) {
        console.error("API Error:", error);
        setError("ไม่สามารถโหลดข้อมูลอสังหาริมทรัพย์ได้");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <h2>กำลังโหลดข้อมูล...</h2>;
  if (error) return <h2>{error}</h2>;

  const handleOpenChange = (id: string, newOpen: boolean) => {
    setOpenPopoverId(newOpen ? id : null);
  };

  const handleFavoriteClick = (
    e: React.MouseEvent<HTMLElement>,
    id: string
  ) => {
    e.preventDefault(); // ป้องกันไม่ให้ event bubble ไปที่ Popover

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

  return (
    <div className="font-Prompt">
      <Breadcrumb className="mt-3 ml-5 font-Prompt">
        <Breadcrumb.Item
          onClick={() => navigate("/")}
          className="cursor-pointer flex"
        >
          <HomeOutlined style={{ fontSize: "15px", marginLeft: "20px" }} />
          <p className="ml-2">หน้าแรก</p>
        </Breadcrumb.Item>
        <Breadcrumb.Item className="flex">
          <img src={basket} className="h-5" />
          <p className="ml-2 text-[#9D9D9D]">รายการซื้อ</p>
        </Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-2xl text-center font-Prompt mt-3 mb-8 text-yellow-900">
        รายการซื้ออสังหาริมทรัพย์
      </h1>

      {buys.length > 0 &&
        buys.map((buy) => {
          const propertyId = String(buy.รหัสทรัพย์);

          return (
            <div key={propertyId} className="flex ml-32">
              {/* Pop-up หัวใจรายการโปรด */}
              <div className="absolute ml-[1250px]">
                <Popover
                  title={
                    <div className="font-Prompt text-center -mb-2 text-sm text-zinc-600">
                      เพิ่มรายการโปรดแล้ว!
                    </div>
                  }
                  trigger="click"
                  open={openPopoverId === propertyId}
                  onOpenChange={(newOpen) =>
                    handleOpenChange(propertyId, newOpen)
                  }
                >
                  <div
                    className="text-2xl text-gray-500 flex justify-end mt-7 cursor-pointer"
                    onClick={(e) => handleFavoriteClick(e, propertyId)}
                  >
                    {favorites[propertyId] ? (
                      <HeartFilled style={{ color: "red" }} />
                    ) : (
                      <HeartOutlined style={{ color: "gray" }} />
                    )}
                  </div>
                </Popover>
              </div>

              <div className="flex mb-5 bg-gray-100 w-[1300px] p-5 rounded-2xl shadow-lg">
                <Link to={`/properties/${propertyId}`} key={propertyId}>
                  <div className="">
                    {/* แสดงรูปภาพจาก URL */}
                    {buy.image &&
                      buy.image.split(/\*\*+|\*\*\*+/).map((imgUrl, idx) => {
                        // แยก URL ของรูปภาพออกจากกันโดยใช้ ** หรือ *** เป็นตัวแบ่ง
                        const firstImage = imgUrl.trim();
                        if (firstImage.startsWith("http")) {
                          return (
                            <img
                              key={idx}
                              src={firstImage}
                              alt={`property-${propertyId}-${idx}`}
                              style={{
                                width: "350px",
                                height: "200px",
                                margin: "10px",
                                borderRadius: "5px",
                              }}
                            />
                          );
                        }
                        return null;
                      })[0]}
                    {/*แสดงแค่รูปแรกเท่านั้น*/}
                  </div>
                </Link>

                <div className="ml-8 w-[500px] flex flex-col items-start">
                  <h2 className="mt-10 text-xl text-start text-gray-700 w-[800px]">
                    {buy["ชื่ออสังหาริมทรัพย์"]}
                  </h2>
                  <p className="mt-5 text-gray-700 text-lg">
                    ราคา {buy["ราคา"]} บาท
                  </p>

                  <div className="flex gap-5 text-gray-700 mt-5 text-sm">
                    <div className="flex">
                      <img src={ruler} className="h-6" />
                      <p className="mt-1 ml-2">{buy["ขนาดพื้นที่"]}</p>
                    </div>

                    {/*แสดงทุกประเภท ยกเว้นประเภทที่ดิน*/}
                    {buy["ประเภท"] !== "ที่ดิน" && (
                      <div className="flex">
                        <div className="flex">
                          <img src={bedroom} className="h-6" />
                          <p className="mt-1 ml-3">{buy["ห้องนอน"]}</p>
                        </div>
                        <div className="flex ml-4">
                          <img src={bathtub} className="h-6" />
                          <p className="mt-1 ml-3">{buy["ห้องน้ำ"]}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-start mt-4 mb-5 text-gray-700 text-sm w-[800px]">
                    {buy["เกี่ยวกับ"]}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PropertyList;
