export interface Property {
  รหัสทรัพย์: string;
  ชื่ออสังหาริมทรัพย์: string;
  ราคา: string;
  ประเภท: string;
  ความสะดวกโดยรอบ: string;
  รายละเอียดอสังหาฯ: string;
  เกี่ยวกับ: string;
  image: string;
  location: {
    coordinates: [any, any];
    lat: number;
    lng: number;
  }; // ใช้ค่าจาก location.coordinates
  link: string;
  ขนาดพื้นที่: string;
  ห้องนอน: string;
  ห้องน้ำ: string;
}
