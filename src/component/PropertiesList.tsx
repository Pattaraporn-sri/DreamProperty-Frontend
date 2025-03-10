interface PropertyListProps {
    properties: any[];
  }
  
  const PropertiesList: React.FC<PropertyListProps> = ({ properties }) => {
    return (
      <div>
        {properties.length > 0 ? (
          properties.map((property) => (
            <div key={property._id} className="border p-4 my-2">
              <h2 className="text-lg font-bold">{property.ชื่ออสังหาริมทรัพย์}</h2>
              <p>ประเภท: {property.type}</p>
              <p>ราคา: {property.ราคา} บาท</p>
              <p>พื้นที่: {property["ขนาดพื้นที่"]}</p>
              <p>ห้องนอน: {property.ห้องนอน}, ห้องน้ำ: {property.ห้องน้ำ}</p>
              <img src={property.image} alt={property.ชื่ออสังหาริมทรัพย์} className="w-full h-48 object-cover" />
            </div>
          ))
        ) : (
          <p>ไม่มีอสังหาริมทรัพย์ที่ตรงกับประเภทที่เลือก</p>
        )}
      </div>
    );
  };
  
  export default PropertiesList;
  