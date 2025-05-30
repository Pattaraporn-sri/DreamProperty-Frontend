import { Breadcrumb } from "antd";
import { useFavorites } from "./FavoriteContext";
import { HeartFilled, HomeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import heart from "../img/icons8-heart-50.png";
import { Property } from "./Type";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";

const FavoritePage: React.FC = () => {
  const { favorites, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const [favoriteProperties, setFavoriteProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("http://localhost:3002/properties")
      .then((response) => response.json())
      .then((data: Property[]) => {
        const filteredFavorites = data.filter(
          (property) => favorites[property.รหัสทรัพย์]
        );
        setFavoriteProperties(filteredFavorites);
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, [favorites]);

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
    images: string[]
  ) => {
    const target = e.target as HTMLImageElement;
    const currentIndex = images.indexOf(target.src);

    if (currentIndex < images.length - 1) {
      target.src = images[currentIndex + 1];
    } else {
      target.src =
        "https://th1-cdn.pgimgs.com/listing/11694849/UPHO.126248215.V800/ASHTON-Chula-Silom-%E0%B9%81%E0%B8%AD%E0%B8%8A%E0%B8%95%E0%B8%B1%E0%B8%99-%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2-%E0%B8%AA%E0%B8%B5%E0%B8%A5%E0%B8%A1-%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%A3%E0%B8%B1%E0%B8%81-Thailand.jpg";
    }
  };

  const handleCompare = () => {
    if (favoriteProperties.length > 1) {
      navigate("/favorite/compare", {
        state: { properties: favoriteProperties },
      });
    } else {
      alert("กรุณาเลือกอสังหาริมทรัพย์อย่างน้อย 2 รายการสำหรับการเปรียบเทียบ");
    }
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
                <img src={heart} className="h-5" alt="heart icon" />
                <p className="ml-2 text-[#9D9D9D]">รายการโปรด</p>
              </div>
            ),
          },
        ]}
      />

      <button
        className="font-Prompt fixed bottom-10 right-10 text-sm bg-yellow-800 text-white px-2 py-3 rounded-lg shadow-md z-10"
        onClick={handleCompare}
      >
        เปรียบเทียบรายการอสังหาริมทรัพย์
      </button>

      <h1 className="text-2xl font-Prompt text-yellow-900 flex justify-center mt-5">
        รายการโปรดของคุณ
      </h1>

      <div className="flex flex-wrap ml-20 mb-10">
        {favoriteProperties.length > 0 ? (
          favoriteProperties.map((property) => (
            <div key={property.รหัสทรัพย์} className="m-2">
              <div className="bg-gray-100 w-[300px] max-h-[550px] p-5 rounded-xl ml-5 shadow-lg relative mt-8">
                <Link
                  to={`/properties/${property.รหัสทรัพย์}`}
                  key={property.รหัสทรัพย์}
                >
                  <div className="mt-5">
                    {property.image &&
                      property.image
                        .split(/\*\*+|\*\*\*+/)
                        .map((imgUrl, idx, images) => {
                          const firstImage = imgUrl.trim();
                          if (firstImage.startsWith("http")) {
                            return (
                              <img
                                key={idx}
                                src={imgUrl}
                                alt={`property-${idx}`}
                                onError={(e) => handleImageError(e, images)}
                                style={{
                                  width: "350px",
                                  height: "150px",
                                  // margin: "5px",
                                  borderRadius: "5px",
                                }}
                              />
                            );
                          }
                          return null;
                        })[0]}
                  </div>
                </Link>
                <HeartFilled
                  style={{
                    color: "red",
                    cursor: "pointer",
                    position: "absolute",
                    top: "10px",
                    right: "15px",
                    fontSize: "20px",
                  }}
                  onClick={() => toggleFavorite(property.รหัสทรัพย์)}
                />
                <div className="font-Prompt text-gray-700">
                  <h2 className="text-xl ml-2 mt-5 truncate">
                    {property["ชื่ออสังหาริมทรัพย์"]}
                  </h2>
                  <p className="text-sm mt-2 ml-1">ราคา {property["ราคา"]}</p>

                  <div className="flex text-gray-700 mt-4 text-xs ml-2">
                    <div className="flex">
                      <img src={ruler} className="h-5" />
                      <p className="ml-1 mt-1">{property["ขนาดพื้นที่"]}</p>
                    </div>

                    {property["ประเภท"] !== "ที่ดิน" && (
                      <div className="flex">
                        <div className="flex">
                          <img src={bedroom} className="h-5 ml-2" />
                          <p className="ml-2 mt-1">{property["ห้องนอน"]}</p>
                        </div>
                        <div className="flex">
                          <img src={bathtub} className="h-5 ml-2" />
                          <p className="ml-2 mt-1">{property["ห้องน้ำ"]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 w-full flex justify-center mt-5 font-Prompt">
            ยังไม่มีรายการโปรด!!
          </p>
        )}
      </div>
    </div>
  );
};

export default FavoritePage;
