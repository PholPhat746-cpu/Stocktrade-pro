const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html lang="th">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>โครงการ: ฟื้นคืนชีพ (PROJECT RESURRECT)</title>
            <style>
                body { background-color: #000; color: #0f0; font-family: 'Courier New', Courier, monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; overflow: hidden; }
                .container { text-align: center; border: 2px solid #0f0; padding: 20px; box-shadow: 0 0 20px #0f0; width: 90%; max-width: 800px; }
                h1 { text-shadow: 0 0 10px #0f0; font-size: 1.5rem; }
                iframe { width: 100%; aspect-ratio: 16/9; border: 1px solid #0f0; margin: 20px 0; }
                .status { color: #ff0000; animation: blink 1s infinite; font-weight: bold; }
                @keyframes blink { 50% { opacity: 0; } }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>[ ระบบเข้าถึงข้อมูล: THE CRADLE ]</h1>
                <p class="status">สถานะ: กำลังกู้คืนไฟล์ส่วนบุคคลของพ่อ...</p>
                
                <iframe src="https://www.youtube.com/embed/XIfEG22RP-I?autoplay=1&mute=0" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                
                <p>>_ ระบบตอบสนอง: การเชื่อมต่อผ่าน Cloudflare สำเร็จแล้ว</p>
                <p>>_ ยินดีต้อนรับกลับมาครับ คุณ Phol</p>
            </div>
        </body>
        </html>
    `);
});

server.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
});




