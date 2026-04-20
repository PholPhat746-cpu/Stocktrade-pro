// services/dataService.js

// ฟังก์ชันสำหรับดึงข้อมูลโปรเจกต์ของผู้ใช้
export const fetchUserProjects = async (userId) => {
    try {
        // ในที่นี้คือตัวอย่างการดึงข้อมูล ถ้ามี API จริงให้เปลี่ยน URL ตรงนี้ครับ
        console.log(`Fetching projects for user: ${userId}`);
        
        // สมมติข้อมูลที่ส่งกลับมา
        const projects = [
            { id: 1, name: 'Stocktrade Pro', status: 'Active' },
            { id: 2, name: 'World Translator', status: 'Completed' }
        ];
        
        return projects;
    } catch (error) {
        console.error("Error fetching user projects:", error);
        throw error;
    }
};

// พลสามารถเพิ่มฟังก์ชันอื่นๆ ต่อท้ายตรงนี้ได้ครับ
export const getStockData = async (symbol) => {
    // โค้ดสำหรับดึงราคาหุ้นหรือเหรียญคริปโต
    console.log(`Fetching data for: ${symbol}`);
};

