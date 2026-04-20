import React from 'react';

const ProjectCard = ({ title, status, lastUpdate }) => {
  return (
    <div style={{ 
      padding: '16px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      marginBottom: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
    }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>{title}</h3>
      <p style={{ margin: '0', color: '#28a745', fontWeight: 'bold' }}>สถานะ: {status}</p>
      <small style={{ color: '#888' }}>อัปเดตล่าสุด: {lastUpdate}</small>
    </div>
  );
};

export default ProjectCard;

