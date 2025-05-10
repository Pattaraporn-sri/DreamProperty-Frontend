import house from "../img/image-Photoroom (6)-Photoroom.png";
import background from "../img/background.jpg";
import home from "../img/icons8-house-60.png";
import Condo from "../img/condo.png";
import land from "../img/icons8-land-50.png";
import townhouse from "../img/townhouse.png";
import { useEffect, useState } from "react";
import { Property } from "./Type";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { HeartOutlined, HeartFilled } from "@ant-design/icons";
import { useFavorites } from "./FavoriteContext";
import facebook from "../img/icons8-facebook-48.png";
import X from "../img/icons8-twitter-50.png";
import ig from "../img/icons8-ig-48.png";
import threads from "../img/icons8-threads-50.png";
import pinterest from "../img/icons8-pinterest-50.png";
import location from "../img/icons8-location-50.png";
import phone from "../img/icons8-phone-24.png";
import email from "../img/icons8-email-24.png";
import { Button, Popover } from "antd";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";
import { Skeleton } from "antd";

const HomePage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const randomProperties = [
    properties[0],
    properties[54],
    properties[65],
    properties[3],
    properties[13],
    properties[10],
  ];

  const randomRecommendProperties = [
    properties[1],
    properties[48],
    properties[24],
    properties[25],
  ];

  const { favorites, toggleFavorite } = useFavorites(); // สถานะเพื่อเช็คว่ากดหรือไม่
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null); // ใช้ string แทน boolean

  const handleOpenChange = (id: string, newOpen: boolean) => {
    setOpenPopoverId(newOpen ? id : null);
  };

  //ฟังก์ชันดึงข้อมู,จาก API
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

  if (loading)
    return (
      <h2>
        <Skeleton />
      </h2>
    );
  if (error) return <h2>{error}</h2>;

  return (
    <div>
      <div className="no-scrollbar">
        <div className=" w-5/6 ml-32 mt-8 bg-gray-200 rounded-xl shadow-lg">
          <img
            src={background}
            className="w-full h-[300px] rounded-xl opacity-15"
          />
          <p className="absolute -mt-60 font-DM text-3xl text-yellow-900 ml-24">
            Welcome to
          </p>
          <p className="absolute -mt-48 font-DM text-6xl text-yellow-900 ml-36">
            Dream Property
          </p>
          <p className="absolute -mt-[95px] font-Prompt text-xs text-gray-500 text-center ml-20 w-[580px]">
            ค้นหาโครงการในฝันของคุณ
            ที่ตอบโจทย์ความต้องการอย่างหลากหลายรูปแบบเพื่อช่วยให้การตัดสินใจมีประสิทธิภาพมากยิ่งขึ้น
            พร้อมทั้งทำเลดีและสิ่งอำนวยความสะดวกครบครัน
            สร้างชีวิตที่คุณฝันถึงได้ที่นี่ !
          </p>
        </div>
        <img
          src={house}
          className="absolute -mt-72 ml-[900px] rounded-md w-[400px] h-[300px]"
        />
        <div className="flex justify-center mt-24 space-x-5 font-Prompt text-gray-600 ml-10">
          <div className="text-center w-56">
            <div className="bg-yellow-700 w-12 h-12 rounded-full ml-20 mb-3 opacity-50"/>
            <img src={home} className="h-7 absolute -mt-[50px] ml-[90px]"/>
            <p className="w-52 text-sm mt-3">
              โครงการบ้านหลากหลายรูปแบบ ตอบโจทย์ทุกไลฟ์สไตล์
            </p>
          </div>

          <div className="text-center w-52">
            <div className="bg-yellow-700 w-12 h-12 rounded-full ml-20 mb-3 opacity-50"></div>
            <img src={Condo} className="h-9 absolute -mt-[58px] ml-[85px]"/>
            <p className="w-52 text-sm mt-3">
              แหล่งรวมโครงการคอนโดมิเนียม ย่านขอนแก่น มีให้เลือกหลายรูปแบบ
            </p>
          </div>

          <div className="text-center w-56">
            <div className="bg-yellow-700 w-12 h-12 rounded-full ml-16 mb-3 opacity-50"></div>
            <img src={land} className="h-7 absolute -mt-[53px] ml-[75px]"/>
            <p className="w-36 ml-5 text-sm mt-3">
              ที่ดินหลากหลายทำเล ตอบโจทย์ความต้องการ
            </p>
          </div>

          <div className="text-center w-56">
            <div className="bg-yellow-700 w-12 h-12 rounded-full ml-[30px] mb-3 opacity-50"></div>
            <img
              src={townhouse}
              className="h-7 absolute -mt-[50px] ml-[40px]"
            />
            <p className="text-sm mt-3 w-56 -ml-10">
              รวมประกาศทาวน์เฮ้าส์ในขอนแก่น ครอบคลุมทุกทำเลในจังหวัดขอนแก่น
            </p>
          </div>
        </div>

        <hr className="border-[1px] border-[#e4d4bc] w-2/3 ml-[260px] mt-10"></hr>

        {/*โครงการใหม่*/}
        <div className="mt-12 font-Prompt text-5xl font-bold text-yellow-900 ml-36">
          โครงการใหม่
        </div>
        <p className="font-Prompt mt-5 ml-40 text-gray-700">
          "สำรวจโครงการใหม่ที่น่าสนใจ"
        </p>

        <div className="grid grid-cols-3 ml-[300px] w-[1000px]">
          {/* แสดง selectedProperties */}
          {randomProperties.map((property, index) => {
            // แยก URL ของรูปภาพออกจากกันโดยใช้ ** หรือ *** เป็นตัวแบ่ง
            const images = property.image
              .split(/\*\*+|\*\*\*+/)
              .map((img) => img.trim())
              .filter((img) => img.startsWith("http"));

            // แสดงแค่รูปแรก
            const firstImage = images[0];

            const handleFavoriteClick = (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault(); // ป้องกันไม่ให้ event bubble ไปที่ Popover

              const isFavorited = favorites[property.รหัสทรัพย์]; // ตรวจสอบสถานะปัจจุบัน
              toggleFavorite(property.รหัสทรัพย์);

              if (!isFavorited) {
                setOpenPopoverId(property.รหัสทรัพย์); // ถ้าเป็นการเพิ่ม (หัวใจแดง) ให้แสดง pop up

                setTimeout(() => {
                  setOpenPopoverId(null);
                }, 2000);
              } else {
                setOpenPopoverId(null);
              }
            };

            return (
              <div key={property.รหัสทรัพย์}>
                <div className="mt-10 bg-gray-100 w-[300px] p-3 px-5 flex flex-wrap text-center rounded-xl shadow-lg">
                  <div className="text-start">
                    <Link
                      to={`/properties/${property.รหัสทรัพย์}`}
                      key={property.รหัสทรัพย์}
                    >
                      <div className="flex hover:scale-105">
                        <Popover
                          title={
                            <div className="font-Prompt ml-5 text-sm -mb-2 text-zinc-600">
                              เพิ่มรายการโปรดแล้ว!
                            </div>
                          }
                          trigger="click"
                          open={openPopoverId === property.รหัสทรัพย์}
                          onOpenChange={(newOpen) =>
                            handleOpenChange(property.รหัสทรัพย์, newOpen)
                          }
                        >
                          <Button
                            onClick={(e) => handleFavoriteClick(e)}
                            className="bg-slate-200 w-8 h-8 p-1 ml-[215px] mt-4 text-xl absolute rounded-full hover:scale-95"
                          >
                            {favorites[property.รหัสทรัพย์] ? (
                              <HeartFilled style={{ color: "red" }} /> // ถ้าคลิกแล้วให้แสดง HeartFilled เป็นสีแดง
                            ) : (
                              <HeartOutlined style={{ color: "gray" }} /> // ถ้ายังไม่คลิกให้แสดง HeartOutlined เป็นสีเทา
                            )}
                          </Button>
                        </Popover>
                        {firstImage && (
                          <img
                            src={firstImage}
                            alt={`property-${property.รหัสทรัพย์}-${index}`}
                            className="w-[260px] h-40 rounded-lg mt-3"
                          />
                        )}
                      </div>
                    </Link>
                    <div className="text-zinc-500 font-Prompt mt-5">
                      <h2 className="text-lg text-gray-700">
                        {property["ชื่ออสังหาริมทรัพย์"]}
                      </h2>
                      <p className="pb-3 pt-5">ราคา {property["ราคา"]} บาท</p>

                      <div className="flex gap-2 mb-5 mt-2">
                        <p className="flex text-xs">
                          <img src={ruler} className="h-6 mr-1" />
                          <p className="w-20 mt-1">{property["ขนาดพื้นที่"]}</p>
                        </p>

                        <p className="flex text-xs">
                          <img src={bedroom} className="h-6 mr-2 " />
                          <p className="w-20 mt-1">{property["ห้องนอน"]}</p>
                        </p>

                        <p className="flex text-xs">
                          <img src={bathtub} className="h-5 mr-2"/>
                          <p className="w-20 mt-1">{property["ห้องน้ำ"]}</p>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {/*แนะนำ*/}
        <div className="font-Prompt text-5xl font-bold text-yellow-900 ml-36 mt-20">
          โครงการแนะนำ
        </div>
        <p className="font-Prompt ml-40 mt-2 text-gray-700">
          "อสังหาริมทรัพย์ที่น่าสนใจ"
        </p>
        <div className="mt-10 ml-16">
          {randomRecommendProperties.map((item, index) => {
            // แยก URL ของรูปภาพออกจากกันโดยใช้ ** หรือ *** เป็นตัวแบ่ง
            const images = item.image
              .split(/\*\*+|\*\*\*+/)
              .map((img) => img.trim())
              .filter((img) => img.startsWith("http"));

            // แสดงแค่รูปแรก
            const firstImage = images[0];

            const handleFavoriteClick = (e: React.MouseEvent<HTMLElement>) => {
              e.preventDefault(); // ป้องกันไม่ให้ event bubble ไปที่ Popover

              const isFavorited = favorites[item.รหัสทรัพย์]; // ตรวจสอบสถานะปัจจุบัน
              toggleFavorite(item.รหัสทรัพย์);

              if (!isFavorited) {
                setOpenPopoverId(item.รหัสทรัพย์); // ถ้าเป็นการเพิ่ม (หัวใจแดง) ให้แสดง pop up

                setTimeout(() => {
                  setOpenPopoverId(null);
                }, 2000);
              } else {
                setOpenPopoverId(null);
              }
            };

            return (
              <div
                key={item.รหัสทรัพย์}
                className="flex items-center p-5 bg-gray-100 ml-24 w-[1250px] rounded-xl font-Prompt mb-8 shadow-lg"
              >
                <div className="text-xl text-gray-500 absolute w-[1200px] flex justify-end -mt-40">
                  <Popover
                    title={
                      <div className="font-Prompt text-sm text-center pt-1 text-zinc-600">
                        เพิ่มรายการโปรดแล้ว!
                      </div>
                    }
                    trigger="click"
                    open={openPopoverId === item.รหัสทรัพย์}
                    onOpenChange={(newOpen) =>
                      handleOpenChange(item.รหัสทรัพย์, newOpen)
                    }
                  >
                    <button onClick={(e) => handleFavoriteClick(e)} className=" text-2xl hover:scale-95">
                      {favorites[item.รหัสทรัพย์] ? (
                        <HeartFilled style={{ color: "red" }} /> // ถ้าคลิกแล้วให้แสดง HeartFilled เป็นสีแดง
                      ) : (
                        <HeartOutlined style={{ color: "gray" }} /> // ถ้ายังไม่คลิกให้แสดง HeartOutlined เป็นสีเทา
                      )}
                    </button>
                  </Popover>
                </div>

                <div className="flex">
                  <Link
                    to={`/properties/${item.รหัสทรัพย์}`}
                    key={item.รหัสทรัพย์}
                  >
                    <div className="flex">
                      {firstImage && (
                        <img
                          src={firstImage}
                          alt={`property-${item.รหัสทรัพย์}-${index}`}
                          className="w-[350px] h-52 rounded-2xl hover:scale-105 p-2"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="ml-10">
                    <h1 className="text-2xl text-gray-800 w-[800px] mt-7 truncate">
                      {item["ชื่ออสังหาริมทรัพย์"]}
                    </h1>
                    <h2 className="mt-5 text-xl text-gray-700">
                      ฿ {item["ราคา"]}
                    </h2>

                    {/*ไอคอน*/}
                    <div className="flex mt-5 gap-5 text-gray-600">
                      <div className="flex">
                        <img src={ruler} className="h-6" />
                        <p className="ml-2">{item["ขนาดพื้นที่"]}</p>
                      </div>

                      {/*แสดงเฉพาะ บ้าน คอนโด ทาวน์เฮ้าส์ */}
                      {item["ประเภท"] !== "ที่ดิน" && (
                        <div className="flex">
                          <div className="flex">
                            <img src={bedroom} className="h-6"/>
                            <p className="ml-3">{item["ห้องนอน"]}</p>
                          </div>
                          <div className="flex ml-4">
                            <img src={bathtub} className="h-6" />
                            <p className="ml-2">{item["ห้องน้ำ"]}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <p className="w-[850px] mt-4 text-sm text-gray-700">
                      {item["เกี่ยวกับ"]}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/*Bottom Nav*/}
        <div className="h-[330px] w-full bg-gray-400 mt-12">
          <div className="ml-36 mt-16 absolute text-4xl font-DM text-slate-700">
            Dream Property
          </div>
          <p className="absolute mt-[130px] ml-[150px] w-[400px] font-Prompt text-slate-700 text-xs">
            พบกับแพลตฟอร์มอสังหาริมทรัพย์ที่ครบวงจร ไม่ว่าคุณจะมองหาบ้าน คอนโด
            ที่ดิน หรือทาวน์เฮ้าส์
            เราช่วยให้คุณค้นหาอสังหาริมทรัพย์ที่ตรงใจได้ง่าย ๆ
            พร้อมข้อมูลครบถ้วน โปร่งใส และเชื่อถือได้
            เพื่อให้คุณค้นหาที่อยู่อาศัยที่ตอบโจทย์ไลฟ์สไตล์และงบประมาณของคุณ
          </p>

          <div className="absolute flex ml-[140px] gap-3 mt-[220px]">
            <img src={facebook} className="h-8" />
            <img src={X} className="h-6 mt-1" />
            <img src={ig} className="h-8" />
            <img src={threads} className="h-8 " />
            <img src={pinterest} className="h-8" />
          </div>

          <div className="absolute mt-16 ml-[700px] text-slate-700 text-xs font-Prompt">
            <p className="font-DM text-4xl text-slate-700 mb-4">Contacts</p>
            <p className="mt-5 flex">
              <img src={location} className="h-6"/>
              <p className="ml-2 mt-1">
                ที่อยู่ 44/8 หมู่1 ถ.ศรีจันทร์ อ.เมือง จ.ขอนแก่น
              </p>
            </p>
            <p className="flex mt-3">
              <img src={phone} className="h-6 mt-1" />
              <p className="ml-2 mt-2">+66-123-456-88</p>
            </p>
            <p className="flex mt-4">
              <img src={email} className="h-6 mt-1" />
              <p className="ml-2 mt-2">Pattaraporn.sri@kkumail.com</p>
            </p>
          </div>

          <div className="absolute mt-16 flex flex-col text-slate-600 font-Prompt ml-[1100px] gap-2 text-xs">
            <p className="font-DM text-4xl text-slate-700 mb-3">Quicklinks</p>
            <p onClick={() => navigate("/map")} className="cursor-pointer">
              แผนที่
            </p>
            <p onClick={() => navigate("/buy")} className="cursor-pointer">
              ซื้อ
            </p>
            <p onClick={() => navigate("/house")} className="cursor-pointer">
              บ้าน
            </p>
            <p onClick={() => navigate("/condo")} className="cursor-pointer">
              คอนโด
            </p>
            <p
              onClick={() => navigate("/townhouse")}
              className="cursor-pointer"
            >
              ทาวน์เฮ้าส์
            </p>
            <p onClick={() => navigate("/land")} className="cursor-pointer">
              ที่ดิน
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
