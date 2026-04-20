'use client';
import React, { useEffect, useRef } from 'react';

export default function Godfather() {
  // ใส่ any เพื่อตัดปัญหาเรื่องประเภทข้อมูลใน Termux
  const container = useRef<any>(null);

  useEffect(() => {
    // เช็คว่า container มีอยู่จริง และยังไม่มี script ข้างใน
    if (container && container.current && !container.current.querySelector('script')) {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": "BINANCE:BTCUSDT",
        "interval": "1",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      });
      container.current.appendChild(script);
    }
  }, []);

  return (
    <div style={{ backgroundColor: '#000', color: '#0f0', minHeight: '100vh', padding: '10px', fontFamily: 'monospace' }}>
      <header style={{ borderBottom: '1px solid #0f0', paddingBottom: '5px', marginBottom: '10px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>STOCKTRADE PRO | LIVE TERMINAL</h2>
        <p style={{ fontSize: '0.8rem', color: '#888' }}>OPERATOR: PHOL | STATUS: ONLINE</p>
      </header>

      {/* ส่วนของกราฟ */}
      <div style={{ height: '450px', width: '100%', marginBottom: '20px', border: '1px solid #333' }}>
        <div ref={container} style={{ height: "100%", width: "100%" }}>
          <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        </div>
      </div>

      {/* ปุ่มกดซื้อขาย */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <button onClick={() => alert('BUY Order Placed!')} style={{
          backgroundColor: '#052205', color: '#0f0', border: '1px solid #0f0', padding: '15px', fontWeight: 'bold', cursor: 'pointer'
        }}>BUY / LONG</button>
        
        <button onClick={() => alert('SELL Order Placed!')} style={{
          backgroundColor: '#220505', color: '#f00', border: '1px solid #f00', padding: '15px', fontWeight: 'bold', cursor: 'pointer'
        }}>SELL / SHORT</button>
      </div>

      <footer style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.7rem', color: '#444' }}>
        TRADINGVIEW ENGINE ACTIVE | DISK: 12GB OK
      </footer>
    </div>
  );
}
o
