// โครงสร้างข้อมูลระบบสมาชิก Stocktrade Pro (6.35 USD/เดือน)
export interface SubscriptionStatus {
  userId: string;
  isActive: boolean;
  planPrice: number; // 6.35 USD
  expiryDate: string;
}

// ฟังก์ชันจำลองการตรวจสอบสถานะการเป็นสมาชิกของผู้ใช้งาน
export const checkSubscriptionStatus = async (userId: string): Promise<SubscriptionStatus> => {
  // ในอนาคตคุณพลสามารถนำส่วนนี้ไปเชื่อมต่อดึงข้อมูลจริงจากระบบฐานข้อมูลหรือ Stripe Atlas ได้ครับ
  return {
    userId: userId,
    isActive: true, // ค่าเริ่มต้นจำลองให้ผ่านก่อนเพื่อใช้ทดสอบระบบ
    planPrice: 6.35,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // บวกเพิ่มไป 30 วัน
  };
};

