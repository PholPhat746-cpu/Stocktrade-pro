import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, SafeAreaView, Platform, StatusBar, Linking, Modal, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage'; // คงไว้: ระบบจัดการความจำเครื่อง
import { checkSubscriptionStatus, SubscriptionStatus } from '../services/subscription/tracking';

const { width: screenWidth } = Dimensions.get('window');

export default function StocktradePro() {
  const [selectedSymbol, setSelectedSymbol] = useState('NASDAQ:AAPL');
  const [subStatus, setSubStatus] = useState<SubscriptionStatus | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // โค้ดใหม่ที่สอดแทรก: ระบบ Modal เลือกโบรกเกอร์
  const [brokerModalVisible, setBrokerModalVisible] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  // คงไว้: State สำหรับผูกกับกล่องข้อความ Journal
  const [entry, setEntry] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    checkSubscriptionStatus('user_phol_001').then((status) => {
      setSubStatus(status);
    });
    loadSavedData(selectedSymbol);
    checkBrokerStatus(); // ตรวจสอบสถานะโบรกเกอร์เมื่อแอปเปิด
  }, [selectedSymbol]);

  // ฟังก์ชันสอดแทรก: เช็กว่าเคยเลือกโบรกเกอร์หรือยัง
  const checkBrokerStatus = async () => {
    const broker = await AsyncStorage.getItem('user_broker');
    if (!broker) {
      setBrokerModalVisible(true);
    } else {
      setSelectedBroker(broker);
    }
  };

  // ฟังก์ชันสอดแทรก: บันทึกโบรกเกอร์ที่เลือก
  const handleSelectBroker = async (name: string) => {
    await AsyncStorage.setItem('user_broker', name);
    setSelectedBroker(name);
    setBrokerModalVisible(false);
    alert(`ยินดีด้วย! คุณได้เลือก ${name} เป็นพันธมิตรเรียบร้อยครับ`);
  };

  const saveJournalEntry = async () => {
    const data = { entry, stopLoss, note };
    try {
      await AsyncStorage.setItem(`journal_${selectedSymbol}`, JSON.stringify(data));
      alert(`บันทึกแผนเทรดของ ${cleanSymbolName(selectedSymbol)} เรียบร้อยครับ!`);
    } catch (e) {
      alert('บันทึกข้อมูลล้มเหลวครับ');
    }
  };

  const loadSavedData = async (symbol: string) => {
    try {
      const saved = await AsyncStorage.getItem(`journal_${symbol}`);
      if (saved) {
        const { entry, stopLoss, note } = JSON.parse(saved);
        setEntry(entry);
        setStopLoss(stopLoss);
        setNote(note);
      } else {
        setEntry('');
        setStopLoss('');
        setNote('');
      }
    } catch (e) {
      console.error('โหลดข้อมูลผิดพลาด:', e);
    }
  };

  const cleanSymbolName = (symbol: string) => {
    return symbol.includes(':') ? symbol.split(':')[1] : symbol;
  };

  // คงไว้: รายชื่อหุ้นระดับโลกครบถ้วนตามสั่ง
  const watchList = [
    { name: 'AAPL', value: 'NASDAQ:AAPL' },
    { name: 'TSLA', value: 'NASDAQ:TSLA' },
    { name: 'NVDA', value: 'NASDAQ:NVDA' },
    { name: 'BTC', value: 'BINANCE:BTCUSDT' },
    { name: 'GOOGL', value: 'NASDAQ:GOOGL' },
    { name: 'MSFT', value: 'NASDAQ:MSFT' },
    { name: 'META', value: 'NASDAQ:META' },
  ];

  // คงไว้: ข้อมูลข่าวสาร MockNews ชุดเดิมทั้งหมด
  const getMockNews = (symbol: string) => {
    const name = cleanSymbolName(symbol);
    return [
      { id: '1', title: `วิเคราะห์แนวโน้มราคา ${name} ล่าสุดหลังตลาดปิด`, source: 'Bloomberg', time: '10 นาทีที่แล้ว', url: 'https://www.bloomberg.com' },
      { id: '2', title: `จับตาแรงซื้อขายบิ๊กล็อตในหุ้น ${name} วันนี้`, source: 'Reuters', time: '1 ชม. ที่แล้ว', url: 'https://www.reuters.com' },
      { id: '3', title: `ข่าวเด่นข่าวด่วนที่มีผลกระทบต่อจิตวิทยาการเทรด ${name}`, source: 'MarketWatch', time: '2 ชม. ที่แล้ว', url: 'https://www.marketwatch.com' },
    ];
  };

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
        
        {/* ================= ส่วนบน: กราฟ TRADINGVIEW + แถบสลับหุ้น ================= */}
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

        {/* ================= ส่วนล่าง: TRADE JOURNAL + ข่าวหุ้นเดิมครบถ้วน ================= */}
        <View style={styles.journalWrapper}>
          
          <View style={styles.headerRow}>
            {/* โค้ดใหม่สอดแทรก: แสดงโบรกเกอร์ข้างหัวข้อ หรือกดเปิดซ้ำเพื่อเปลี่ยนได้ */}
            <TouchableOpacity onPress={() => setBrokerModalVisible(true)}>
              <Text style={styles.journalTitle}>📝 JOURNAL ({selectedBroker || 'ยังไม่เลือกโบรกเกอร์'})</Text>
            </TouchableOpacity>
            
            {/* คงไว้: ปุ่ม Premium สีเหลืองตามเดิมเป๊ะ */}
            {!subStatus?.isActive ? (
              <TouchableOpacity style={styles.premiumBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.premiumBtnText}>🚀 อัปเกรด Premium</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Premium ${subStatus.planPrice}/mo</Text>
              </View>
            )}
          </View>
          
          <ScrollView style={styles.journalScroll} contentContainerStyle={styles.journalContent}>
            
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
                  <TextInput 
                    value={entry} 
                    onChangeText={setEntry} 
                    placeholder="0.00" 
                    placeholderTextColor="#475569" 
                    style={styles.input} 
                    keyboardType="numeric" 
                  />
                </View>
                <View style={styles.flex1}>
                  <Text style={styles.label}>Stop Loss</Text>
                  <TextInput 
                    value={stopLoss} 
                    onChangeText={setStopLoss} 
                    placeholder="0.00" 
                    placeholderTextColor="#475569" 
                    style={styles.input} 
                    keyboardType="numeric" 
                  />
                </View>
              </View>

              <View>
                <Text style={styles.label}>บันทึกแผนและเหตุผลการเข้าเทรด</Text>
                <TextInput 
                  value={note}
                  onChangeText={setNote}
                  placeholder={`พิมพ์โน้ตวิเคราะห์หุ้น ${cleanSymbolName(selectedSymbol)} ...`} 
                  placeholderTextColor="#475569" 
                  style={[styles.input, styles.textArea]} 
                  multiline 
                  numberOfLines={2} 
                />
              </View>

              <TouchableOpacity 
                style={styles.saveButton}
                onPress={saveJournalEntry}
              >
                <Text style={styles.saveButtonText}>บันทึกคำสั่งซื้อขายลงคลัง</Text>
              </TouchableOpacity>
            </View>

            {/* คงไว้: ข่าวสาร 3 แถวเต็ม รูปแบบเดิมทุกประการ */}
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

        {/* Modal สอดแทรก: หน้าต่างเลือกโบรกเกอร์พันธมิตรผู้ร่วมลงทุน */}
        <Modal animationType="fade" transparent={true} visible={brokerModalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🤝 ร่วมเป็นพันธมิตรกับเรา</Text>
              <Text style={styles.modalDesc}>กรุณาเลือกโบรกเกอร์ของคุณ เพื่อเชื่อมต่อรับสิทธิพิเศษในการส่งสัญญาณเทรด:</Text>
              {['Interactive Brokers', 'eToro', 'Finansia'].map((brokerName) => (
                <TouchableOpacity 
                  key={brokerName} 
                  style={styles.brokerSelectBtn} 
                  onPress={() => handleSelectBroker(brokerName)}
                >
                  <Text style={styles.saveButtonText}>{brokerName}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        {/* คงไว้: Modal สมัครสมาชิกพรีเมียมราคา $6.35 ของเดิมเป๊ะ */}
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>สมัครสมาชิก Premium</Text>
              <Text style={styles.modalPrice}>$6.35 / เดือน</Text>
              <Text style={styles.modalDesc}>- เข้าถึงข้อมูลอินพุตและกราฟเชิงลึก{'\n'}- ไม่มีโฆษณากวนใจ{'\n'}- ข่าวสารหุ้นเสิร์ฟตรงแบบ Real-time</Text>
              <TouchableOpacity style={styles.payButton} onPress={() => alert('ระบบชำระเงิน Google Play กำลังทำงาน...')}>
                <Text style={styles.saveButtonText}>สมัครสมาชิกตอนนี้</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>ไว้ทีหลัง</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#020617',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 15,
    width: screenWidth,
  },
  container: { 
    flex: 1, 
    flexDirection: 'column', 
    backgroundColor: '#0f172a',
    width: screenWidth,
  },
  chartContainer: { flex: 55, borderBottomWidth: 1, borderBottomColor: '#334155', width: '100%' }, 
  topBar: { paddingVertical: 6, paddingHorizontal: 12, backgroundColor: '#020617', flexDirection: 'row', alignItems: 'center', width: '100%' },
  barText: { fontSize: 11, color: '#94a3b8', marginRight: 8, fontWeight: 'bold' },
  watchListScroll: { flexDirection: 'row', gap: 6 },
  button: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 5 },
  activeButton: { backgroundColor: '#2563eb' },
  inactiveButton: { backgroundColor: '#1e293b' },
  activeButtonText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  inactiveButtonText: { color: '#cbd5e1', fontSize: 11 },
  webViewWrapper: { flex: 1, width: '100%' },
  
  journalWrapper: { flex: 45, backgroundColor: '#1e293b', paddingHorizontal: 10, paddingVertical: 6, width: '100%' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, paddingHorizontal: 4 },
  journalTitle: { fontSize: 11, fontWeight: 'bold', color: '#60a5fa' },
  
  premiumBtn: { backgroundColor: '#eab308', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 5 },
  premiumBtnText: { color: '#000', fontSize: 10, fontWeight: 'bold' },
  badge: { backgroundColor: '#22c55e', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  
  journalScroll: { flex: 1 },
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
  newsTime: { color: '#64748b', fontSize: 9 },

  modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' },
  modalContent: { backgroundColor: '#1e293b', margin: 20, padding: 25, borderRadius: 15, alignItems: 'center' },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalPrice: { color: '#22c55e', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  modalDesc: { color: '#cbd5e1', textAlign: 'center', marginBottom: 20 },
  payButton: { backgroundColor: '#2563eb', padding: 12, width: '100%', borderRadius: 6, alignItems: 'center' },
  
  // สไตล์สำหรับปุ่มเลือกโบรกเกอร์โดยเฉพาะ
  brokerSelectBtn: { backgroundColor: '#1e293b', padding: 12, width: '100%', borderRadius: 6, alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#334155' },
  cancelButton: { marginTop: 15 },
  cancelText: { color: '#94a3b8' }
});

