import React, { useState } from 'react';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    // ตรวจสอบว่ามีการระบุจำนวนเงินหรือไม่
    if (!amount || amount <= 0) {
      return alert("กรุณาระบุจำนวนเงิน");
    }

    setLoading(true);
    try {
      // สั่งให้หน้ามือถือคุยกับ Python (Backend) ที่เราเพิ่งรันสำเร็จ
      const response = await fetch('http://127.0.0.1:5000/api/deposit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount })
      });

      const data = await response.json();

      if (data.status === "success") {
        // ถ้าสำเร็จ รูป QR Code จาก Omise จะถูกส่งมาเก็บที่นี่
        setQrImageUrl(data.qr_url);
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("เชื่อมต่อ Backend ไม่ได้! เช็คว่าหน้า Python ยังเปิดอยู่ไหม?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>เติมเงิน (PromptPay QR)</h2>
      <input 
        type="number" 
        placeholder="ระบุจำนวนเงิน" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: '10px', marginBottom: '10px', width: '80%' }}
      />
      <br />
      <button 
        onClick={handleDeposit} 
        disabled={loading}
        style={{ padding: '10px 20px', cursor: 'pointer' }}
      >
        {loading ? 'กำลังสร้าง QR Code...' : 'ยืนยันการเติมเงิน'}
      </button>

      {qrImageUrl && (
        <div style={{ marginTop: '20px' }}>
          <h3>สแกนเพื่อชำระเงิน</h3>
          <img src={qrImageUrl} alt="QR Code" style={{ width: '250px' }} />
          <p>เมื่อชำระเสร็จแล้ว ระบบจะปรับยอดให้อัตโนมัติ</p>
        </div>
      )}
    </div>
  );
};

export default DepositPage;

