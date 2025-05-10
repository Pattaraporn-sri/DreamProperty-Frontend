import { Link, useLocation, useNavigate } from "react-router-dom";
import { Property } from "./Type";
import { Breadcrumb, Table } from "antd";
import ruler from "../img/icons8-ruler-48.png";
import bedroom from "../img/icons8-bedroom-48.png";
import bathtub from "../img/icons8-bathtub-32.png";
import monet from "../img/icons8-money-50.png";
import { HomeOutlined } from "@ant-design/icons";
import heart from "../img/icons8-heart-50.png";

const Compare: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { properties }: { properties: Property[] } = location.state || {
    properties: [],
  }; //รับข้อมูลที่ส่งมาจากหน้า FavoritePage

  //ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!properties || properties.length === 0) {
    return <p>ยังไม่มีรายการเปรียบเทียบ</p>;
  }

  const columns = [
    {
      title: (
        <div className="text-lg text-center text-zinc-700 font-Prompt">
          รูปภาพ
        </div>
      ),
      dataIndex: "image",
      key: "รูปภาพ",
      width: 280,
      render: (image: string) => {
        if (!image) return <span className="text-gray-500">ไม่มีรูป</span>;

        const imageList = image.split(/\*\*+|\*\*\*+/).map((img) => img.trim());
        const firstImage = imageList.find((img) => img.startsWith("http")); //เอารูปที่เป้น URl

        return firstImage ? (
          <img
            src={firstImage}
            alt="property"
            style={{ width: "350px", height: "150px", objectFit: "cover" }}
            className="mx-auto rounded-md"
          />
        ) : (
          <span className="text-gray-500">ไม่มีรูป</span>
        );
      },
    },
    {
      title: (
        <div className="text-lg text-center text-zinc-700">
          ชื่ออสังหาริมทรัพย์
        </div>
      ),
      dataIndex: "ชื่ออสังหาริมทรัพย์",
      key: "ชื่ออสังหาริมทรัพย์",
      className: "font-Prompt",
      render: (_: any, record: Property) => (
        <Link to={`/properties/${record.รหัสทรัพย์}`}>
          <div className="truncate w-[500px] text-sm ml-5">
            {record.ชื่ออสังหาริมทรัพย์}
          </div>
        </Link>
      ),
    },
    {
      title: <div className="text-lg text-center text-zinc-700">ราคา</div>,
      dataIndex: "ราคา",
      key: "ราคา",
      width: 120,
      className: "font-Prompt",
      render: (text: string) => (
        <div className="text-center text-sm flex justify-center items-center">
          <img src={monet} className="h-5 mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: (
        <div className="text-lg text-center text-zinc-700">ขนาดพื้นที่</div>
      ),
      dataIndex: "ขนาดพื้นที่",
      key: "ขนาดพื้นที่",
      className: "font-Prompt",
      width: 120,
      render: (text: string) => (
        <div className="text-center text-sm flex justify-center items-center">
          <img src={ruler} className="h-5 mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: <div className="text-lg text-center text-zinc-700">ห้องนอน</div>,
      dataIndex: "ห้องนอน",
      key: "ห้องนอน",
      className: "font-Prompt",
      width: 120,
      render: (text: string) => (
        <div className="text-center text-sm flex justify-center items-center">
          <img src={bedroom} className="h-5 mr-2" />
          {text}
        </div>
      ),
    },
    {
      title: <div className="text-lg text-center text-zinc-700">ห้องน้ำ</div>,
      dataIndex: "ห้องน้ำ",
      key: "ห้องน้ำ",
      className: "font-Prompt",
      width: 120,
      render: (text: string) => (
        <div className="text-center text-sm flex justify-center items-center">
          <img src={bathtub} className="h-5 mr-2" />
          {text}
        </div>
      ),
    },
  ];

  return (
    <div className="font-Prompt">
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
              <div
                className="flex cursor-pointer"
                onClick={() => navigate("/favorite")}
              >
                <img src={heart} className="h-5" alt="heart icon" />
                <p className="ml-2 text-[#9D9D9D]">รายการโปรด</p>
              </div>
            ),
          },
          {
            title: (
              <div className="flex">
                <p className="text-[#9D9D9D]">
                  เปรียบเทียบรายการอสังหาริมทรัพย์
                </p>
              </div>
            ),
          },
        ]}
      />
      <h1 className="text-2xl text-yellow-900 text-center py-10">
        เปรียบเทียบรายการอสังหาริมทรัพย์
      </h1>

      {properties.length > 1 ? (
        <Table
          columns={columns}
          dataSource={properties.map((prop) => ({
            ...prop,
            key: prop.รหัสทรัพย์,
          }))}
          bordered
          pagination={false}
          className="shadow-lg rounded-xl overflow-auto w-11/12 mx-auto mb-10"
          rowClassName={(_, index) =>
            index % 2 === 0
              ? "bg-gray-100 text-lg font-Prompt truncate"
              : "bg-white text-lg font-Prompt truncate"
          }
          scroll={{ x: "max-content" }}
        />
      ) : (
        <p>กรุณาเลือกอสังหาริมทรัพย์อย่างน้อย 2 รายการ</p>
      )}
    </div>
  );
};

export default Compare;
