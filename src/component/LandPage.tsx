import React, { useState, useEffect } from "react";
import { Property } from "./Type";
import { Link, useNavigate } from "react-router-dom";
import { Breadcrumb, Popover } from "antd";
import { HeartFilled, HeartOutlined, HomeOutlined } from "@ant-design/icons";
import Land from "../img/icons8-land-50 (1).png";
import { useFavorites } from "./FavoriteContext";
import ruler from "../img/icons8-ruler-48.png";

const PropertyList: React.FC = () => {
  const [lands, setLands] = useState<Property[]>([]);
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean

  // ฟังก์ชันกรองข้อมูลบ้าน
  useEffect(() => {
    fetch("http://localhost:3002/properties")
      .then((response) => response.json())
      .then((data) => {
        // ตรวจสอบว่า data ไม่เป็น null หรือ undefined และมีข้อมูลที่เป็น array
        if (data && Array.isArray(data)) {
          const filteredLands = data.filter(
            (land: { ประเภท: string }) => land.ประเภท === "ที่ดิน"
          );
          // ตรวจสอบข้อมูลหลังจากกรองแล้ว

          // อัพเดต state ให้มีข้อมูลบ้าน
          setLands(filteredLands);
        } else {
          console.error("Invalid data received from API");
        }
      })
      .catch((error) => console.error("Error fetching lands:", error));
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

  return (
    <div>
      <Breadcrumb
        className="mt-3 ml-5 font-Prompt"
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
                <img src={Land} className="h-6 ml-1 -mt-1" alt="ที่ดิน" />
                <p className="ml-2 text-[#9D9D9D]">รายการที่ดิน</p>
              </div>
            ),
          },
        ]}
      />

      <h1 className="text-2xl text-center font-Prompt mt-3 mb-8 text-yellow-900">
        รายการที่ดิน
      </h1>

      {lands.length > 0 &&
        lands.map((land) => (
          <div className="ml-32">
            <div className="absolute ml-[1250px]">
              <Popover
                title={
                  <div className="font-Prompt text-center -mb-2 text-sm text-zinc-600">
                    เพิ่มรายการโปรดแล้ว!
                  </div>
                }
                trigger="click"
                open={openPopoverId === land.รหัสทรัพย์}
                onOpenChange={(newOpen) =>
                  handleOpenChange(land.รหัสทรัพย์, newOpen)
                }
              >
                <div
                  key={land.รหัสทรัพย์}
                  className="text-2xl text-gray-500 flex justify-end mt-7"
                >
                  {favorites[land.รหัสทรัพย์] ? (
                    <HeartFilled
                      style={{ color: "red" }}
                      onClick={() => toggleFavorite(land.รหัสทรัพย์)}
                    /> // ถ้าคลิกแล้วให้แสดง HeartFilled เป็นสีแดง
                  ) : (
                    <HeartOutlined
                      style={{ color: "gray" }}
                      onClick={() => toggleFavorite(land.รหัสทรัพย์)}
                    /> // ถ้ายังไม่คลิกให้แสดง HeartOutlined เป็นสีเทา
                  )}
                </div>
              </Popover>
            </div>

            <div className="flex mb-5 bg-gray-100 w-[1300px] p-5 rounded-2xl shadow-lg font-Prompt ">
              <div className="flex">
                <Link
                  to={`/properties/${land.รหัสทรัพย์}`}
                  key={land.รหัสทรัพย์}
                >
                  <div>
                    {land.image &&
                      land.image
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
                  </div>
                </Link>

                <div
                  key={land.รหัสทรัพย์}
                  className="ml-5 w-[500px] flex flex-col items-start text-gray-700"
                >
                  <h2 className="mt-6 text-xl text-start w-[800px]">
                    {land["ชื่ออสังหาริมทรัพย์"]}
                  </h2>
                  <p className="mt-5 text-lg">ราคา {land["ราคา"]} บาท</p>

                  <div className="flex gap-5 text-gray-700 mt-5 text-sm">
                    <div className="flex">
                      <img src={ruler} className="h-6" />
                      <p className="mt-1 ml-2">{land["ขนาดพื้นที่"]}</p>
                    </div>
                  </div>

                  <p className="text-start mt-4 mb-5 text-sm w-[800px]">
                    {land["เกี่ยวกับ"]}
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
