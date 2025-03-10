import React, { useEffect, useState } from "react";
import axios from "axios";

const AgentList: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]); //กำหนด state สำหรับเก็บข้อมูลนายหน้า
  const [loading, setLoading] = useState<boolean>(true); //ใช้สำหรับเช็คว่าโหลดข้อมูลเสร็จหรือยัง
  const [error, setError] = useState<string>(""); //ใช้สำหรับเก้บ error หากเกิดปัญหาในการดึงข้อมูล

  //ฟังก์ชันดึข้อมูลนายหน้าจาก API
  const fetchAgents = async () => {
    try {
      const response = await axios.get("http://localhost:3002/agents"); //ส่งคำขอ GET ไปที่ API
      setAgents(response.data); //เก็บข้อมูลที่ได้จาก API ลงใน state
      setLoading(false); //เมื่อโหลดเสร็จให้ set Loading เป็น false
    } catch (error) {
      setError("Failed to fetch agents");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents(); //เรียกฟังก์ชัน fetch เมื่อคอมโพแนนต์ถูก mount
  }, []); //[] หมายความว่า effect จะทำงานแค่ครั้งเดียวหลังจากคอมโพแนนต์ mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1> Agent List</h1>
      <div>
        {agents.map((agent) => (
          <div key={agent.id}>
            <div>{agent.name}</div>
            <div>{agent.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentList;
