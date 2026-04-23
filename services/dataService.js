// ฟังก์ชันสำหรับดึงข้อมูลโปรเจกต์ของผู้ใช้
export const fetchUserProjects = async (userId) => {
  try {
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

// ฟังก์ชันสำหรับดึงราคาสินทรัพย์
export const getStockData = async (symbol) => {
  try {
    console.log(`Fetching data for: ${symbol}`);
    // ใส่ Logic การดึงราคาหุ้นหรือคริปโตตรงนี้ได้ในอนาคต
    return { symbol, price: 0 };
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

