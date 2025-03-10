import React, { useState, useEffect } from "react";
import { Property } from "./Type";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Popover } from "antd";
import { HeartFilled, HeartOutlined, HomeOutlined } from "@ant-design/icons";
import Townhouse from "../img/icons8-apartment-64.png";
import { useFavorites } from "./FavoriteContext";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";

const PropertyList: React.FC = () => {
  const [townhouses, setTownhouse] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean

  // ฟังก์ชันกรองข้อมูลบ้าน
  useEffect(() => {
    fetch("http://localhost:3002/properties")
      .then((response) => response.json())
      .then((data) => {
        console.log("API response data:", data); // ตรวจสอบข้อมูลจาก API

        // ตรวจสอบว่า data ไม่เป็น null หรือ undefined และมีข้อมูลที่เป็น array
        if (data && Array.isArray(data)) {
          const filteredTownhouse = data.filter(
            (townhouse: { ประเภท: string }) =>
              townhouse.ประเภท === "ทาวน์เฮ้าส์"
          );
          // ตรวจสอบข้อมูลหลังจากกรองแล้ว
          console.log("Filtered townhouse:", filteredTownhouse);

          // อัพเดต state ให้มีข้อมูลบ้าน
          setTownhouse(filteredTownhouse);
        } else {
          console.error("Invalid data received from API");
        }
      })
      .catch((error) => console.error("Error fetching townhouse:", error));
  }, []);

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

  const handleOpenChange = (id: string, newOpen: boolean) => {
    setOpenPopoverId(newOpen ? id : null);
  };

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
          <img src={Townhouse} className="h-7 ml-1 -mt-1" />
          <p className="ml-2 text-[#9D9D9D]">รายการทาวน์เฮ้าส์</p>
        </Breadcrumb.Item>
      </Breadcrumb>

      <h1 className="text-3xl text-center font-Prompt mt-3 mb-8 text-yellow-900">
        รายการทาวน์เฮ้าส์
      </h1>

      {townhouses.length > 0 &&
        townhouses.map((townhouse) => (
          <div className="ml-44">
            <div className="absolute ml-[1750px]">
              <Popover
                title={
                  <div className="font-Prompt ml-2 mt-2 text-lg text-zinc-600">
                    เพิ่มรายการโปรดแล้ว!
                  </div>
                }
                trigger="click"
                open={openPopoverId === townhouse.รหัสทรัพย์}
                onOpenChange={(newOpen) =>
                  handleOpenChange(townhouse.รหัสทรัพย์, newOpen)
                }
              >
                <div
                  key={townhouse.รหัสทรัพย์}
                  className="text-4xl text-gray-500 flex justify-end mt-7"
                  onClick={(e) => handleFavoriteClick(e, townhouse.รหัสทรัพย์)}
                >
                  {favorites[townhouse.รหัสทรัพย์] ? (
                    <HeartFilled style={{ color: "red" }} /> // ถ้าคลิกแล้วให้แสดง HeartFilled เป็นสีแดง
                  ) : (
                    <HeartOutlined style={{ color: "gray" }} /> // ถ้ายังไม่คลิกให้แสดง HeartOutlined เป็นสีเทา
                  )}
                </div>
              </Popover>
            </div>

            <div className="flex mb-5 bg-gray-100 w-[1850px] p-5 rounded-2xl shadow-lg font-Prompt ">
              <div className="flex">
                <Link
                  to={`/properties/${townhouse.รหัสทรัพย์}`}
                  key={townhouse.รหัสทรัพย์}
                >
                  <div>
                    {townhouse.image &&
                      townhouse.image
                        .split(/\*\*+|\*\*\*+/)
                        .map((imgUrl, idx, images) => {
                          const firstImage = imgUrl.trim();
                          if (firstImage.startsWith("http")) {
                            return (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`property-${idx}-${idx}`}
                                onError={(e) => handleImageError(e, images)}
                                style={{
                                  width: "500px",
                                  height: "280px",
                                  margin: "10px",
                                  borderRadius: "5px",
                                }}
                              />
                            );
                          }
                          return null;
                        })[0]}
                  </div>
                </Link>

                <div
                  key={townhouse.รหัสทรัพย์}
                  className="ml-5 w-[1000px] flex flex-col items-start text-gray-700"
                >
                  <h2 className="mt-10 text-4xl text-start w-[1200px]">
                    {townhouse["ชื่ออสังหาริมทรัพย์"]}
                  </h2>
                  <p className="mt-5 text-3xl">ราคา {townhouse["ราคา"]} บาท</p>

                  <div className="flex gap-5 text-gray-700 mt-5 text-lg">
                    <div className="flex">
                      <img src={ruler} className="h-9" />
                      <p className="mt-2 ml-2">{townhouse["ขนาดพื้นที่"]}</p>
                    </div>
                    <div className="flex">
                      <img src={bedroom} className="h-9" />
                      <p className="mt-2 ml-3">{townhouse["ห้องนอน"]}</p>
                    </div>
                    <div className="flex">
                      <img src={bathtub} className="h-9" />
                      <p className="mt-2 ml-3">{townhouse["ห้องน้ำ"]}</p>
                    </div>
                  </div>

                  <p className="text-start mt-4 mb-5 text-xl w-[1250px]">
                    {townhouse["เกี่ยวกับ"]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default PropertyList;
