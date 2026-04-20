import requests

def get_btc_price():
    try:
        print("\n--- 📈 กำลังเช็คราคา BTC จาก Binance ---")
        # ดึงราคาโดยตรงจาก API ของ Binance (เสถียรที่สุด)
        url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
        response = requests.get(url)
        data = response.json()
        
        price = float(data['price'])
        print(f"✅ ราคา BTC ตอนนี้: ${price:,.2f}")
        print("--- 🤖 ระบบทำงานสำเร็จแล้วครับ! ---")
    except Exception as e:
        print(f"❌ เกิดข้อผิดพลาด: {e}")

if __name__ == "__main__":
    get_btc_price()
