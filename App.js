import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAR_DATA = [
  { 
    id: '1', 
    name: 'Premium Sedan X1', 
    price: 1490000, 
    priceText: '1,490,000 บาท',
    type: 'EV Electric', 
    brand: 'Tesla',
    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=500',
    detail: 'รถยนต์ไฟฟ้าอัจฉริยะ ขับเคลื่อนอัตโนมัติ ชาร์จเต็มวิ่งได้ไกลกว่า 600 กิโลเมตร ดีไซน์หรูหรารอบคัน'
  },
  { 
    id: '2', 
    name: 'Sport SUV Ultra', 
    price: 2190000, 
    priceText: '2,190,000 บาท',
    type: 'Hybrid', 
    brand: 'Toyota',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500',
    detail: 'SUV สายลุย ขุมพลังไฮบริดประหยัดน้ำมันสูงสุด เบาะนั่งกว้างขวาง 7 ที่นั่ง เหมาะสำหรับครอบครัว'
  },
  { 
    id: '3', 
    name: 'Eco Hatchback City', 
    price: 599000, 
    priceText: '599,000 บาท',
    type: 'Gasoline', 
    brand: 'Honda',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500',
    detail: 'รถซิตี้คาร์ไซส์กะทัดรัด คล่องตัวในเมืองใหญ่ อัตราเร่งแซงทันใจ ฟังก์ชันความปลอดภัยครบครัน'
  },
];

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  
  const [downPayment, setDownPayment] = useState('20'); 
  const [months, setMonths] = useState(48); 
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);

  const calculateFinance = (carPrice) => {
    const downAmount = carPrice * (parseFloat(downPayment) / 100);
    const loanAmount = carPrice - downAmount;
    const interestRate = 0.03; 
    const totalInterest = loanAmount * interestRate * (months / 12);
    const totalLoan = loanAmount + totalInterest;
    const monthly = totalLoan / months;
    
    setMonthlyInstallment(Math.round(monthly));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🚗 Car Showroom</Text>
        <Text style={styles.headerSubtitle}>ค้นหารถยนต์ที่คุณชอบได้ง่ายๆ</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="🔍 ค้นหายี่ห้อ หรือรุ่นรถ..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.listContainer}>
        {CAR_DATA.filter(car => car.name.toLowerCase().includes(search.toLowerCase()) || car.brand.toLowerCase().includes(search.toLowerCase())).map((car) => (
          <View key={car.id} style={styles.carCard}>
            <Image source={{ uri: car.image }} style={styles.carImage} />
            <View style={styles.carInfo}>
              <Text style={styles.carBrand}>{car.brand}</Text>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carType}>🔌 ระบบ: {car.type}</Text>
              <Text style={styles.carPrice}>{car.priceText}</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => { setSelectedCar(car); setMonthlyInstallment(0); }}>
              <Text style={styles.buttonText}>ดูรายละเอียด</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal visible={selectedCar !== null} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCar && (
                <>
                  <Image source={{ uri: selectedCar.image }} style={styles.modalImage} />
                  <Text style={styles.modalTitle}>{selectedCar.name}</Text>
                  <Text style={styles.modalBrand}>แบรนด์: {selectedCar.brand} ({selectedCar.type})</Text>
                  <Text style={styles.modalDetail}>{selectedCar.detail}</Text>
                  <Text style={styles.modalPrice}>ราคา {selectedCar.priceText}</Text>
                  
                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionTitle}>📊 เครื่องคำนวณค่างวดเบื้องต้น (ดอกเบี้ย 3%)</Text>
                  
                  <Text style={styles.label}>เงินดาวน์ (%):</Text>
                  <TextInput 
                    style={styles.modalInput}
                    keyboardType="numeric"
                    value={downPayment}
                    onChangeText={setDownPayment}
                    placeholder="เช่น 15, 20, 25"
                  />

                  <Text style={styles.label}>ระยะเวลาผ่อนชำระ (เดือน):</Text>
                  <View style={styles.monthsContainer}>
                    {[48, 60, 72, 84].map((m) => (
                      <TouchableOpacity 
                        key={m} 
                        style={[styles.monthButton, months === m && styles.monthButtonActive]}
                        onPress={() => setMonths(m)}
                      >
                        <Text style={[styles.monthButtonText, months === m && styles.monthButtonTextActive]}>{m} งวด</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.calcButton} onPress={() => calculateFinance(selectedCar.price)}>
                    <Text style={styles.buttonText}>คำนวณค่างวด</Text>
                  </TouchableOpacity>

                  {monthlyInstallment > 0 && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultText}>ค่างวดประมาณ: <Text style={styles.resultPrice}>{monthlyInstallment.toLocaleString()}</Text> บาท / เดือน</Text>
                    </View>
                  )}

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.bookButton]} onPress={() => { alert('ส่งคำขอจองสำเร็จ! เจ้าหน้าที่จะติดต่อกลับโดยเร็วที่สุด'); setSelectedCar(null); }}>
                      <Text style={styles.buttonText}>จองรถคันนี้</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setSelectedCar(null)}>
                      <Text style={styles.buttonText}>ปิดหน้าต่าง</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: { padding: 25, backgroundColor: '#111', borderBottomLeftRadius: 15, borderBottomRightRadius: 15 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: 'bold' },
  headerSubtitle: { color: '#bbb', fontSize: 14, marginTop: 5 },
  searchContainer: { padding: 15 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', fontSize: 16 },
  listContainer: { paddingHorizontal: 15 },
  carCard: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 5, overflow: 'hidden' },
  carImage: { width: '100%', height: 180, backgroundColor: '#ddd' },
  carInfo: { padding: 15 },
  carBrand: { color: '#e67e22', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  carName: { fontSize: 20, fontWeight: 'bold', marginVertical: 4, color: '#2c3e50' },
  carType: { color: '#7f8c8d', fontSize: 14 },
  carPrice: { fontSize: 18, fontWeight: 'bold', color: '#27ae60', marginTop: 8 },
  button: { backgroundColor: '#2980b9', padding: 12, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '90%' },
  modalImage: { width: '100%', height: 200, borderRadius: 15, marginBottom: 15 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  modalBrand: { color: '#e67e22', fontWeight: 'bold', marginVertical: 5 },
  modalDetail: { color: '#555', fontSize: 15, lineHeight: 22, marginVertical: 10 },
  modalPrice: { fontSize: 22, fontWeight: 'bold', color: '#27ae60', marginVertical: 5 },
  
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 10 },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  modalInput: { backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 16 },
  monthsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  monthButton: { flex: 1, backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
  monthButtonActive: { backgroundColor: '#2980b9' },
  monthButtonText: { color: '#333', fontWeight: 'bold' },
  monthButtonTextActive: { color: '#fff' },
  calcButton: { backgroundColor: '#e67e22', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  resultBox: { backgroundColor: '#e8f8f5', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#a3e4d7' },
  resultText: { fontSize: 16, color: '#16a085', textAlign: 'center', fontWeight: 'bold' },
  resultPrice: { fontSize: 20, color: '#27ae60' },

  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 15 },
  modalButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center', marginHorizontal: 5 },
  bookButton: { backgroundColor: '#27ae60' },
  closeButton: { backgroundColor: '#95a5a6' }
});
