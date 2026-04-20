import React from 'react';

const ScriptPage = () => {
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen font-serif">
      <h1 className="text-3xl font-bold mb-6 border-b border-gray-700 pb-2">
        The Bull Run: Market Maker
      </h1>
      <h2 className="text-xl text-yellow-500 mb-4 font-bold">ฉากที่ 12: การถ่ายทอดคัมภีร์ไร้ชื่อ</h2>
      
      <div className="space-y-6 text-lg leading-relaxed max-w-2xl mx-auto">
        <p className="italic text-gray-400">
          (บรรยากาศ: เสียงรถยนต์วิ่งผ่านบนสะพานลอยดังระงม แสงไฟนีออนสลัวๆ สะท้อนผิวน้ำครำ)
        </p>
        
        <p>
          <span className="font-bold text-blue-400">อาจารย์:</span> 
          "เจ้าเห็นอะไรในเส้นหยักพวกนี้? กำไร? ขาดทุน? หรือแค่ตัวเลขที่วิ่งไปมา?"
        </p>
        
        <p>
          <span className="font-bold text-green-400">พล:</span> 
          "ผมเห็น... ความล้มเหลวครับอาจารย์ ผมทำตามตำราทุกเล่ม แต่มันไม่เคยเป็นอย่างที่คิดเลย"
        </p>
        
        <div className="bg-gray-800 p-6 rounded-lg border-l-4 border-yellow-600 shadow-xl">
          <p className="text-sm text-gray-400 mb-4">อาจารย์หยิบเศษถ่านจากกองไฟใกล้ตัว ขึ้นมาขีดเขียนลงบนพื้นปูนที่สกปรก</p>
          <p>
            <span className="font-bold text-blue-400">อาจารย์:</span> 
            "นี่คือ **คัมภีร์ไร้ชื่อ**... ไม่มีสูตรสำเร็จ ไม่มีอินดิเคเตอร์เทพเจ้า มีแค่ 'จิต' ที่นิ่งพอจะมองเห็นการเคลื่อนที่ของวาฬตัวใหญ่"
          </p>
        </div>
        
        <p>
          <span className="font-bold text-green-400">พล:</span> 
          "มันคือ... กราฟเปล่าเหรอครับ?"
        </p>
        
        <p>
          <span className="font-bold text-blue-400">อาจารย์:</span> 
          "มันคือ 'ความจริง' ที่ซ่อนอยู่หลังม่านเมฆ เมื่อเจ้าไร้ชื่อ เจ้าจะไร้ตัวตน... พอร์ตที่ว่างเปล่า คือจุดเริ่มต้นของกำไรที่ยิ่งใหญ่ที่สุด"
        </p>
      </div>
    </div>
  );
};

export default ScriptPage;

