import { useState, useEffect } from 'react';
import { fetchUserProjects } from '../services/dataService';
import ProjectCard from '../components/ProjectCard';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ดึงข้อมูลมาแสดงผล (คุณพลเปลี่ยน ID ตามจริงในระบบได้เลยครับ)
    fetchUserProjects("user_test_01").then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ padding: '20px' }}>กำลังโหลดข้อมูลพอร์ตลงทุนของคุณพล...</p>;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ color: '#222', borderBottom: '2px solid #28a745', paddingBottom: '10px' }}>
        Dashboard โปรเจกต์หลัก
      </h1>
      <div style={{ marginTop: '20px' }}>
        {projects.length > 0 ? (
          projects.map(proj => <ProjectCard key={proj.id} {...proj} />)
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <p>ยังไม่มีข้อมูลโปรเจกต์ในระบบ</p>
            <small>ระบบพร้อมทำงานแล้ว รอเชื่อมต่อข้อมูลจริงครับ</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

