import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Platform, StatusBar, Linking } from 'react-native';
import { WebView } from 'react-native-webview';

export default function StocktradePro() {
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:AAPL');

  const cleanSymbolName = (symbol: string) => {
    return symbol.includes(':') ? symbol.split(':')[1] : symbol;
  };

  const watchList = [
    { name: 'AAPL', value: 'NASDAQ:AAPL' },
    { name: 'TSLA', value: 'NASDAQ:TSLA' },
    { name: 'NVDA', value: 'NASDAQ:NVDA' },
    { name: 'BTC', value: 'BINANCE:BTCUSDT' },
  ];

  // จำลองข้อมูลข่าวสารพร้อมลิงก์สำหรับกดเข้าไปอ่าน (ในอนาคตคุณพลเปลี่ยนเป็น URL ข่าวจริงจาก API ได้เลยครับ)
  const getMockNews = (symbol: string) => {
    const name = cleanSymbolName(symbol);
    return [
      { id: '1', title: `วิเคราะห์แนวโน้มราคา ${name} ล่าสุดหลังตลาดปิด`, source: 'Bloomberg', time: '10 นาทีที่แล้ว', url: 'https://www.bloomberg.com' },
      { id: '2', title: `จับตาแรงซื้อขายบิ๊กล็อตในหุ้น ${name} วันนี้`, source: 'Reuters', time: '1 ชม. ที่แล้ว', url: 'https://www.reuters.com' },
      { id: '3', title: `ข่าวเด่นข่าวด่วนที่มีผลกระทบต่อจิตวิทยาการเทรด ${name}`, source: 'MarketWatch', time: '2 ชม. ที่แล้ว', url: 'https://www.marketwatch.com' },
    ];
  };

  // ฟังก์ชันสำหรับกดแล้วลิงก์ออกไปเปิดเบราว์เซอร์เพื่ออ่านข่าวตัวเต็ม
  const handleOpenNews = (url: string) => {
    Linking.openURL(url).catch((err) => alert('ไม่สามารถเปิดลิงก์ข่าวได้ครับ: ' + err));
  };

  const tradingViewHtml = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background-color: #0f172a; }
        </style>
      </head>
      <body>
        <iframe 
          src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${selectedSymbol}&interval=D&theme=dark"
          width="100%" height="100%" frameborder="0" allowfullscreen>
        </iframe>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* ================= ส่วนบน: กราฟ TRADINGVIEW ================= */}
        <View style={styles.chartContainer}>
          <View style={styles.topBar}>
            <Text style={styles.barText}>สลับกราฟ:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.watchListScroll}>
              {watchList.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => setSelectedSymbol(item.value)}
                  style={[
                    styles.button,
                    selectedSymbol === item.value ? styles.activeButton : styles.inactiveButton
                  ]}
                >
                  <Text style={selectedSymbol === item.value ? styles.activeButtonText : styles.inactiveButtonText}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.webViewWrapper}>
            <WebView
              originWhitelist={['*']}
              source={{ html: tradingViewHtml }}
              style={{ backgroundColor: '#0f172a' }}
            />
          </View>
        </View>

        {/* ================= ส่วนล่าง: TRADE JOURNAL + ข่าวหุ้น ================= */}
        <View style={styles.journalWrapper}>
          <Text style={styles.journalTitle}>📝 TRADE JOURNAL & REAL-TIME NEWS</Text>
          
          <ScrollView style={styles.journalScroll} contentContainerStyle={styles.journalContent}>
            
            {/* 1. ฟอร์มบันทึกการเทรด */}
            <View style={styles.formBox}>
              <View style={styles.row}>
                <View style={styles.flex1}>
                  <Text style={styles.label}>หุ้นปัจจุบัน</Text>
                  <View style={styles.symbolDisplay}>
                    <Text style={styles.symbolText}>{cleanSymbolName(selectedSymbol)}</Text>
                  </View>
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Entry</Text>
                  <TextInput placeholder="0.00" placeholderTextColor="#475569" style={styles.input} keyboardType="numeric" />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Stop Loss</Text>
                  <TextInput placeholder="0.00" placeholderTextColor="#475569" style={styles.input} keyboardType="numeric" />
                </View>
              </View>

              <View>
                <Text style={styles.label}>บันทึกแผนและเหตุผลการเข้าเทรด</Text>
                <TextInput 
                  placeholder={`พิมพ์โน้ตวิเคราะห์หุ้น ${cleanSymbolName(selectedSymbol)} ...`} 
                  placeholderTextColor="#475569" 
                  style={[styles.input, styles.textArea]} 
                  multiline 
                  numberOfLines={2} 
                />
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={() => alert(`บันทึกแผนเทรดของ ${cleanSymbolName(selectedSymbol)} สำเร็จ`)}
              >
                <Text style={styles.saveButtonText}>บันทึกคำสั่งซื้อขายลงคลัง</Text>
              </TouchableOpacity>
            </View>

            {/* 2. ฟีดข่าวสารเพิ่มเติมด้านล่าง (เปลี่ยนการ์ดข่าวเป็นปุ่มกดได้) */}
            <View style={styles.newsSection}>
              <Text style={styles.newsSectionTitle}>📰 ข่าวสารและบทวิเคราะห์ล่าสุด ({cleanSymbolName(selectedSymbol)})</Text>
              {getMockNews(selectedSymbol).map((news) => (
                <TouchableOpacity 
                  key={news.id} 
                  style={styles.newsCard}
                  onPress={() => handleOpenNews(news.url)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.newsTitle} numberOfLines={2}>{news.title}</Text>
                  <View style={styles.newsMeta}>
                    <Text style={styles.newsSource}>{news.source}</Text>
                    <Text style={styles.newsTime}>{news.time}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

          </ScrollView>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#020617',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 15,
  },
  container: { flex: 1, flexDirection: 'column', backgroundColor: '#0f172a' },
  chartContainer: { flex: 55, borderBottomWidth: 1, borderBottomColor: '#334155' }, 
  topBar: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#020617', flexDirection: 'row', alignItems: 'center' },
  barText: { fontSize: 11, color: '#94a3b8', marginRight: 8, fontWeight: 'bold' },
  watchListScroll: { flexDirection: 'row', gap: 6 },
  button: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 5 },
  activeButton: { backgroundColor: '#2563eb' },
  inactiveButton: { backgroundColor: '#1e293b' },
  activeButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  inactiveButtonText: { color: '#cbd5e1', fontSize: 11 },
  webViewWrapper: { flex: 1 },
  
  journalWrapper: { flex: 45, backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6 },
  journalTitle: { fontSize: 11, fontWeight: 'bold', color: '#60a5fa', marginBottom: 6, paddingHorizontal: 4 },
  journalScroll: { flex: 1 },
  
  // ปรับขอบด้านล่างลดลง 3 มิลลิเมตร (จากเดิม paddingBottom 20 เหลือ 10) เพื่อดึงเนื้อหาข่าวให้แสดงได้ลึกและกว้างเต็มจอขึ้น
  journalContent: { paddingBottom: 10 }, 
  
  formBox: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8, gap: 8, borderWidth: 1, borderColor: '#334155' },
  label: { fontSize: 10, color: '#94a3b8', marginBottom: 2 },
  symbolDisplay: { backgroundColor: '#020617', paddingVertical: 5, borderRadius: 6, borderWidth: 1, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', height: 32 },
  symbolText: { color: '#4ade80', fontWeight: 'bold', fontSize: 11 },
  row: { flexDirection: 'row', gap: 6 },
  flex1: { flex: 1 },
  input: { backgroundColor: '#020617', color: '#fff', fontSize: 11, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, borderWidth: 1, borderColor: '#334155', height: 32 },
  textArea: { height: 42, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#2563eb', paddingVertical: 8, borderRadius: 6, alignItems: 'center', marginTop: 2 },
  saveButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },

  newsSection: { marginTop: 14, gap: 8 },
  newsSectionTitle: { fontSize: 11, fontWeight: 'bold', color: '#94a3b8', paddingHorizontal: 4, marginBottom: 2 },
  newsCard: { backgroundColor: '#0f172a', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#334155' },
  newsTitle: { color: '#f8fafc', fontSize: 11, fontWeight: '500', lineHeight: 16 },
  newsMeta: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, alignItems: 'center' },
  newsSource: { color: '#38bdf8', fontSize: 9, fontWeight: 'bold' },
  newsTime: { color: '#64748b', fontSize: 9 }
});

