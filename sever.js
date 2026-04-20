const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Project Resurrect - Official Site</title>
            <style>
                body {
                    margin: 0; padding: 0;
                    background: #050a10; 
                    /* ใส่ภาพ Concept Art เป็นพื้นหลัง */
                    background-image: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://r.jina.ai/i/057d549045b141e6a1213bc547901869');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color: #00f2ff;
                    font-family: 'Segoe UI', sans-serif;
                    display: flex; justify-content: center; align-items: center;
                    min-height: 100vh; text-align: center;
                }
                .container { 
                    border: 2px solid #00f2ff; padding: 30px; 
                    box-shadow: 0 0 30px #00f2ff; background: rgba(5, 10, 16, 0.8);
                    width: 85%; max-width: 700px; border-radius: 10px;
                }
                h1 { font-size: 2.5rem; margin: 0; letter-spacing: 5px; text-transform: uppercase; text-shadow: 0 0 10px #00f2ff; }
                .sub { color: #ff0055; font-weight: bold; margin-bottom: 20px; letter-spacing: 2px; }
                
                .audio-section { margin: 20px 0; padding: 15px; border: 1px dashed #00f2ff; }
                audio { width: 100%; filter: invert(100%) hue-rotate(180deg); }

                .btn-sub {
                    display: inline-block; padding: 12px 25px;
                    background: #ff0000; color: white;
                    text-decoration: none; font-weight: bold; border-radius: 5px;
                    box-shadow: 0 0 15px #ff0000; transition: 0.3s;
                }
                .btn-sub:hover { transform: scale(1.05); box-shadow: 0 0 25px #ff0000; }
                
                .status-box { font-size: 0.9rem; margin-top: 20px; color: #00ff00; }
                .loading { font-size: 0.7rem; margin-top: 10px; opacity: 0.6; animation: blink 1s infinite; }
                @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="loading">SATELLITE LINK ESTABLISHED...</div>
                <h1>PROJECT RESURRECT</h1>
                <div class="sub">รหัสกู้คืนหัวใจ</div>

                <div class="audio-section">
                    <p style="font-size: 0.8rem; margin-bottom: 10px;">SOUNDTRACK: MEMORY FRAGMENTS</p>
                    <audio controls autoplay loop>
                        <source src="https://r.jina.ai/m/d7e179e88d0149959e9921782239d10e" type="audio/mpeg">
                        เบราว์เซอร์ของคุณไม่รองรับการเล่นเพลง
                    </audio>
                </div>

                <div class="status-box">
                    <p>SYSTEM STATUS: <span style="text-decoration: underline;">DECRYPTING MEMORIES</span></p>
                </div>

                <p style="font-size: 0.9rem; margin: 20px 0;">"เมื่อความทรงจำคือรหัสลับเดียวที่เหลืออยู่..."</p>
                
                <a href="#" class="btn-sub">JOIN THE RESISTANCE</a>
                
                <div class="loading" style="margin-top: 30px;">© 2026 MAESTRO-BRIDGE.12 ALL RIGHTS RESERVED.</div>
            </div>
        </body>
        </html>
    `);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

