import { useLocation } from "react-router-dom";
import { Property } from "./Type";
import { Table } from "antd";

const Compare: React.FC = () => {
  const location = useLocation();
  const { properties }: { properties: Property[] } = location.state || {
    properties: [],
  }; //รับข้อมูลที่ส่งมาจากหน้า FavoritePage

  //ตรวจสอบว่ามีข้อมูลหรือไม่
  if (!properties || properties.length === 0) {
    return <p>ยังไม่มีรายการเปรียบเทียบ</p>;
  }

  const columns = [
    {
      title: "ชื่ออสังหาริมทรัพย์",
      dataIndex: "ชื่ออสังหาริมทรัพย์",
      key: "ชื่ออสังหาริมทรัพย์",
    },
    {
      title: "ราคา",
      dataIndex: "ราคา",
      key: "ราคา",
    },
    {
      title: "ขนาดพื้นที่",
      dataIndex: "ขนาดพื้นที่",
      key: "ขนาดพื้นที่",
    },
    {
      title: "ห้องนอน",
      dataIndex: "ห้องนอน",
      key: "ห้องนอน",
    },
    {
      title: "ห้องน้ำ",
      dataIndex: "ห้องน้ำ",
      key: "ห้องน้ำ",
    },
  ];

  return (
    <div>
      <h1>เปรียบเทียบอสังหาริมทรัพย์</h1>

      {properties.length > 1 ? (
        <Table
          columns={columns}
          dataSource={properties.map((prop) => ({
            ...prop,
            key: prop.รหัสทรัพย์,
          }))}
          bordered
          pagination={false}
        />
      ) : (
        <p>กรุณาเลือกอสังหาริมทรัพย์อย่างน้อย 2 รายการ</p>
      )}
    </div>
  );
};

export default Compare;
