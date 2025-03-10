import { Link, Outlet, useLocation } from "react-router-dom";
import logo from "../img/logo.jpg";
import search from "../img/icons8-search-24 (1).png";
import { useState, useEffect, useRef } from "react";
import { Property } from "../component/Type";
import axios from "axios";
import { HeartOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { Skeleton } from "antd";

const MainLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const location = useLocation(); // ใช้ในคอมโพเนนต์เท่านั้น

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

  // ค้นหาอสังหาริมทรัพย์
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProperties([]); // เคลียร์ผลลัพธ์หากไม่มีข้อความค้นหา
      setShowDropdown(false); // ทำให้ dropdown หายไปเมื่อไม่มีข้อความ
    } else {
      const matches = properties.filter((property) => {
        const propertyType = Array.isArray(property["ประเภท"])
          ? property["ประเภท"].map((cat) => cat.toLowerCase()).join(", ")
          : property["ประเภท"]?.toLowerCase() || "";

        const propertyName =
          property["ชื่ออสังหาริมทรัพย์"]?.toLowerCase() || "";

        return (
          propertyType.includes(searchTerm) || propertyName.includes(searchTerm)
        );
      });

      setFilteredProperties(matches);
      setShowDropdown(true); // ทำให้ dropdown แสดงเมื่อมีการค้นหา
    }
  }, [searchTerm, properties]);

  //ปิด dropdown เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading)
    return (
      <div>
        <h2 className="h-full w-full mt-10 ml-10">
          <Skeleton active />
        </h2>
        <h2 className="h-full w-full mt-10 ml-10">
          <Skeleton active />
        </h2>
        <h2 className="h-full w-full mt-10 ml-10">
          <Skeleton active />
        </h2>
      </div>
    );
  if (error) return <h2>{error}</h2>;

  return (
    <>
      <div>
        <div className="flex mt-3">
          <Link to="/" className="hover:text-red-700 ml-10">
            <img src={logo} className="rounded-full w-48 h-24 -ml-1" />
            <div className="absolute text-xl -mt-[55px] ml-10 font-Calistoga text-neutral-600">
              DreamProperty
            </div>
          </Link>

          <div className="flex justify-center w-full ml-10">
            <div className="space-x-5 mt-9 pt-1 text-xl border-2 rounded-r-full rounded-l-full w-[500px] h-14 flex justify-center ml-56 font-Prompt text-neutral-900">
              {[
                { name: "แผนที่", path: "/map" },
                { name: "ซื้อ", path: "/buy" },
                { name: "บ้าน", path: "/house" },
                { name: "คอนโด", path: "/condo" },
                { name: "ทาวน์เฮ้าส์", path: "/townhouse" },
                { name: "ที่ดิน", path: "/land" },
              ].map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `mt-2 ${
                      isActive
                        ? "text-red-700 border-b-2 border-red-700"
                        : "hover:text-red-700"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="text-gray-400 w-56 h-10 flex justify-end items-center mt-10 m-3 hover:text-red-500">
            <Link to="/favorite">
              <HeartOutlined className="text-4xl" />
            </Link>
          </div>

          {/*ค้นหา*/}
          <div ref={searchRef}>
            <input
              type="text"
              placeholder="ค้นหาอสังหาริมทรัพย์"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value.trim().toLowerCase())
              }
              className="border-2 w-72 h-12 mr-6 mt-10 rounded-r-full rounded-l-full px-3 font-Prompt"
              onFocus={() => setShowDropdown(true)}
            />
            <img src={search} className="absolute h-7 right-0 mr-9 -mt-10" />

            {showDropdown && (
              <ul className="absolute z-10 bg-white border w-[270px] mt-3 rounded-xl shadow-lg max-h-96 overflow-y-auto right-0 mr-6">
                {filteredProperties.map((property) => {
                  const images = property.image
                    .split(/\*\*+|\*\*\*+/)
                    .map((img) => img.trim())
                    .filter((img) => img.startsWith("http"));

                  const firstImg = images.length > 0 ? images[0] : null;

                  return (
                    <Link
                      to={`/properties/${property.รหัสทรัพย์}`}
                      key={property.รหัสทรัพย์}
                      className="p-3 cursor-pointer space-x-3"
                      onClick={() => setShowDropdown(false)}
                    >
                      {firstImg && (
                        <img
                          src={firstImg}
                          alt={`property-${property.รหัสทรัพย์}`}
                          className="w-56 h-32 rounded-md ml-2"
                        />
                      )}
                      <div className="font-Prompt mt-5 ">
                        <p className="text-gray-800">
                          {property.ชื่ออสังหาริมทรัพย์ || "-"}
                        </p>
                        <p className="text-gray-700 mt-2">
                          ฿ {property.ราคา?.toLocaleString() || "-"} บาท
                        </p>
                        <p className="text-sm text-gray-500 mt-2 flex flex-col">
                          {Array.isArray(property.ประเภท)
                            ? property.ประเภท.join(", ")
                            : property.ประเภท || "ไม่ระบุประเภท"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <main>
          <Outlet key={location.pathname} />
        </main>
      </div>
    </>
  );
};
export default MainLayout;
