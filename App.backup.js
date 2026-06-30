import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, TextInput, Modal, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://jsdgvmeblkrwvxlcmpta.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_x_B3Uvihjp_d9-1-gvLkgA_vp1ARYCk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_CONTAINER_WIDTH = SCREEN_WIDTH - 50; 

const CAR_BRAND_IMAGES = {
  porsche: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=600',
  ferrari: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600',
  lamborghini: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600',
  mclaren: 'https://images.unsplash.com/photo-1562591188-1077fc4036f0?w=600',
  'aston martin': 'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=600',
  'rolls royce': 'https://images.unsplash.com/photo-1632245889029-e406faaa34cd?w=600',
  bentley: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600',
  bmw: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600',
  'mercedes benz': 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600',
  audi: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600',
  default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600'
};

export default function App() {
  const [search, setSearch] = useState('');
  const [cars, setCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  
  const [downPayment, setDownPayment] = useState('20'); 
  const [months, setMonths] = useState(48); 
  const [monthlyInstallment, setMonthlyInstallment] = useState(0);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const [isSellerPortalVisible, setIsSellerPortalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [carBrandInput, setCarBrandInput] = useState('');
  const [carModelInput, setCarModelInput] = useState('');
  const [carPriceInput, setCarPriceInput] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [sellerAddress, setSellerAddress] = useState('');
  const [engineType, setEngineType] = useState('EV'); 
  const [horsepower, setHorsepower] = useState('');
  const [mileage, setMileage] = useState('');
  const [ownerCount, setOwnerCount] = useState('0');
  const [isAccidentFree, setIsAccidentFree] = useState(true);

  const fetchCarsFromCloud = async () => {
    try {
      const { data, error } = await supabase
        .from('car_specifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error(error);
      } else if (data && data.length > 0) {
        const formattedCars = data.map(car => {
          const brandKey = (car.brand || '').toLowerCase().trim();
          const targetImage = CAR_BRAND_IMAGES[brandKey] || CAR_BRAND_IMAGES.default;
          
          return {
            id: car.id.toString(),
            brand: car.brand || 'Luxury Brand',
            name: car.model_name || 'Premium Model',
            price: car.price || 0,
            status: car.status || 'พร้อมส่งมอบ',
            type: car.engine_type || 'EV',
            mainImage: car.image_url || targetImage,
            images360: [
              car.image_url || targetImage,
              'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600',
              'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=600'
            ],
            horsepower: car.horsepower,
            mileage: car.mileage,
            owner_count: car.owner_count,
            is_accident_free: car.is_accident_free
          };
        });
        setCars(formattedCars);
      } else {
        setCars([{ 
          id: '0', brand: 'Supabase Cloud', name: 'ระบบออนไลน์ | ยังไม่มีข้อมูลในตาราง', price: 0, status: 'ออนไลน์', type: 'Cloud', 
          mainImage: CAR_BRAND_IMAGES.default,
          images360: [CAR_BRAND_IMAGES.default]
        }]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCarsFromCloud();
  }, []);

  const handleScroll360 = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / IMAGE_CONTAINER_WIDTH);
    if (selectedCar && index >= 0 && index < selectedCar.images360.length) {
      setCurrentImgIndex(index);
    }
  };

  const calculateFinance = (carPrice) => {
    const downAmount = carPrice * (parseFloat(downPayment) / 100);
    const loanAmount = carPrice - downAmount;
    const interestRate = 0.03; 
    const totalInterest = loanAmount * interestRate * (months / 12);
    const totalLoan = loanAmount + totalInterest;
    setMonthlyInstallment(Math.round(totalLoan / months));
  };

  // 💳 อัปเดตโมเดลตัดแบ่งส่วนแบ่งผ่าน Stripe Connect เป็น 10%
  const handlePaymentSimulator = (car) => {
    const bookingFee = 50000;
    const commission10Percent = bookingFee * 0.10; // 👈 อัปเดตสูตรหัก 10% ตรงนี้
    Alert.alert(
      '🔒 Stripe Connect Split Payment (10%)',
      `จำลองชำระค่าจองรถหรู\nยอดรวม: ${bookingFee.toLocaleString()} บาท\n\n- GP แพลตฟอร์มของคุณพล (10%): ${commission10Percent.toLocaleString()} บาท\n- โอนเข้าบัญชีดีลเลอร์ (90%): ${(bookingFee - commission10Percent).toLocaleString()} บาท`,
      [
        { text: 'ยกเลิก', style: 'cancel' },
        { 
          text: 'ยืนยันชำระเงิน', 
          onPress: () => {
            Alert.alert('🎉 สำเร็จ!', `ตัดเงินสำเร็จ! โอนส่วนแบ่ง 10% เข้าบัญชีคุณพลเรียบร้อยแล้ว`);
            setSelectedCar(null);
          }
        }
      ]
    );
  };

  const handleSellerSignUp = () => {
    if (email && password.length >= 6) {
      setIsLoggedIn(true);
      Alert.alert('สำเร็จ!', `ยินดีต้อนรับดีลเลอร์เข้าสู่ระบบควบคุม`);
    } else {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่านอย่างน้อย 6 ตัวอักษร');
    }
  };

  const handleSaveDatabaseUI = async () => {
    try {
      const cleanBrand = carBrandInput.trim();
      const brandKey = cleanBrand.toLowerCase();
      const finalImageUrl = CAR_BRAND_IMAGES[brandKey] || CAR_BRAND_IMAGES.default;

      const { error: sellerErr } = await supabase
        .from('sellers')
        .insert([{ 
          company_name: companyName, 
          tax_id: taxId, 
          address_line: sellerAddress 
        }]);

      const { error: specErr } = await supabase
        .from('car_specifications')
        .insert([{
          brand: cleanBrand || 'Luxury Car',
          model_name: carModelInput || 'Custom Model',
          price: parseFloat(carPriceInput) || 0,
          image_url: finalImageUrl,
          engine_type: engineType,
          horsepower: parseInt(horsepower) || 0,
          mileage: parseInt(mileage) || 0,
          owner_count: parseInt(ownerCount) || 0,
          is_accident_free: isAccidentFree
        }]);

      if (sellerErr || specErr) {
        Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลเข้า Cloud ได้');
      } else {
        Alert.alert('🚀 สำเร็จ 100%!', `ส่งข้อมูลรถยนต์แบรนด์ ${cleanBrand} ขึ้นคลาวด์เรียบร้อย!`);
        setCarBrandInput('');
        setCarModelInput('');
        setCarPriceInput('');
        fetchCarsFromCloud();
      }
    } catch (e) {
      Alert.alert('Error', 'การเชื่อมต่อฐานข้อมูลขัดข้อง');
    }
  };

  if (!cars || cars.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f6f7' }}>
        <Text style={{ fontSize: 16, color: '#666', fontWeight: 'bold' }}>📡 กำลังเชื่อมต่อฐานข้อมูล Supabase Cloud...</Text>
      </SafeAreaView>
    );
  }

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(search.toLowerCase()) || 
    car.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>👑 Luxury Showroom Hub</Text>
        <Text style={styles.headerSubtitle}>ศูนย์รวมรถหรูพรีเมียมคอลเลกชัน | ระบบหักค่าบริการแพลตฟอร์ม GP 10%</Text>
        <TouchableOpacity style={styles.portalButton} onPress={() => setIsSellerPortalVisible(true)}>
          <Text style={styles.portalButtonText}>👤 {isLoggedIn ? 'Dashboard ผู้ขาย' : 'สมัครสมาชิกผู้ขาย'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput}
          placeholder="🔍 พิมพ์ค้นหายี่ห้อรถ หรือรุ่นรถยนต์ในคลังประวัติ..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView style={styles.listContainer}>
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerTitle}>📊 รายงานระบบ: คลังแสดงผลรถยนต์หรูประวัติ 10 คันล่าสุด</Text>
          <Text style={styles.bannerSubtitle}>ดึงข้อมูล Realtime ตรงจากระบบคลาวด์ พร้อมหักส่วนแบ่งนักพัฒนา 10% อัตโนมัติเมื่อเกิดการจอง</Text>
        </View>

        {filteredCars.map((car) => (
          <View key={car.id} style={styles.carCard}>
            <Image source={{ uri: car.mainImage }} style={styles.carImage} />
            <View style={styles.carInfo}>
              <View style={styles.badge}><Text style={styles.badgeText}>{car.status}</Text></View>
              <Text style={styles.carBrand}>{car.brand}</Text>
              <Text style={styles.carName}>{car.name}</Text>
              <Text style={styles.carPrice}>ราคา {car.price.toLocaleString()} บาท</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={() => { setSelectedCar(car); setMonthlyInstallment(0); setCurrentImgIndex(0); }}>
              <Text style={styles.buttonText}>ดูรายละเอียดประวัติ & สเปกทางเทคนิค</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* หน้าต่างส่องรายละเอียดเจาะลึก */}
      <Modal visible={selectedCar !== null} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedCar && (
                <>
                  <Text style={styles.sectionTitle}>🔄 แฟ้มภาพประวัติโครงสร้างรถคันจริง</Text>
                  <View style={styles.image360Wrapper}>
                    <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} onScroll={handleScroll360} scrollEventThrottle={16} style={styles.image360Container}>
                      {selectedCar.images360.map((imgUri, idx) => (
                        <Image key={idx} source={{ uri: imgUri }} style={styles.modalImage} />
                      ))}
                    </ScrollView>
                    <View style={styles.view360Badge}>
                      <Text style={styles.view360Text}>📸 ภาพที่ {currentImgIndex + 1}/{selectedCar.images360.length}</Text>
                    </View>
                  </View>

                  <Text style={styles.modalTitle}>{selectedCar.name}</Text>
                  <Text style={styles.modalBrand}>ค่ายรถยนต์มหาอำนาจ: {selectedCar.brand} ({selectedCar.type})</Text>
                  <Text style={styles.modalPrice}>ราคา {selectedCar.price.toLocaleString()} บาท</Text>
                  
                  <View style={styles.resultBox}>
                    <Text style={{fontWeight: 'bold', color: '#111'}}>⚙️ สเปกเทคนิคการบันทึกจากระบบ Cloud:</Text>
                    <Text style={{color: '#555', marginTop: 4}}>• กำลังแรงม้าสูงสุด: {selectedCar.horsepower ? `${selectedCar.horsepower} HP` : 'ไม่มีข้อมูล'}</Text>
                    <Text style={{color: '#555'}}>• เลขไมล์สะสมเดิม: {selectedCar.mileage ? `${selectedCar.mileage.toLocaleString()} KM` : 'ไม่มีข้อมูล'}</Text>
                    <Text style={{color: '#555'}}>• ประวัติเจ้าของลำดับที่: {selectedCar.owner_count ?? '0'} ราย</Text>
                    <Text style={{color: '#555'}}>•  สถานะโครงสร้างรถ: {selectedCar.is_accident_free ? '🟢 ตัวถังเดิมโรงงาน ปราศจากชนหนัก' : '🔴 มีประวัติการซ่อมตัวถัง'}</Text>
                  </View>

                  <View style={styles.divider} />
                  
                  <Text style={styles.sectionTitle}>📊 เครื่องมือคำนวณค่างวดจำลอง (ดอกเบี้ย 3%)</Text>
                  <Text style={styles.label}>วงเงินดาวน์ (%):</Text>
                  <TextInput style={styles.modalInput} keyboardType="numeric" value={downPayment} onChangeText={setDownPayment} />
                  
                  <View style={styles.monthsContainer}>
                    {[48, 60, 72, 84].map((m) => (
                      <TouchableOpacity key={m} style={[styles.monthButton, months === m && styles.monthButtonActive]} onPress={() => setMonths(m)}>
                        <Text style={[styles.monthButtonText, months === m && styles.monthButtonTextActive]}>{m} งวด</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
  <TouchableOpacity style={styles.calcButton} onPress={() => calculateFinance(selectedCar.price)}>
                    <Text style={styles.buttonText}>ประมวลผลค่างวดรายเดือน</Text>
                  </TouchableOpacity>

                  {monthlyInstallment > 0 && (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultText}>ผ่อนชำระประมาณ: <Text style={styles.resultPrice}>{monthlyInstallment.toLocaleString()}</Text> บาท / เดือน</Text>
                    </View>
                  )}

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.stripeButton]} onPress={() => handlePaymentSimulator(selectedCar)}>
                      <Text style={styles.buttonText}>💳 ทำรายการจองออนไลน์ (หัก GP 10% เข้าคุณพล)</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={() => setSelectedCar(null)}>
                      <Text style={styles.buttonText}>ย้อนกลับหน้าแรก</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* แดชบอร์ดบันทึกข้อมูลยิงตรงขึ้นคลาวด์ */}
      <Modal visible={isSellerPortalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlaySeller}>
          <View style={styles.sellerContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {isLoggedIn ? (
                <>
                  <Text style={styles.sellerTitle}>ระบบจัดเก็บแฟ้มประวัติรถหรู</Text>
                  <Text style={styles.sellerSubtitle}>ระบบพาร์ทเนอร์ลงโฆษณาขาย (หักค่าบริการแพลตฟอร์มเข้ากระเป๋าคุณพล 10%)</Text>
                  
                  <View style={styles.dashboardStatBox}>
                    <Text style={styles.statLabel}>GP 10% สะสมสะท้อนเข้าบัญชีคุณพล (฿):</Text>
                    <Text style={styles.statValue}>250,000</Text>
                  </View>

                  <Text style={styles.formSectionHeader}>🏎️ แบบฟอร์มบันทึกข้อมูลรถคันใหม่</Text>
                  
                  <Text style={styles.label}>ยี่ห้อรถยนต์ (เช่น Porsche, Ferrari, BMW):</Text>
                  <TextInput style={styles.formInput} placeholder="กรอกยี่ห้อรถภาษาอังกฤษให้ถูกต้อง" value={carBrandInput} onChangeText={setCarBrandInput} />

                  <Text style={styles.label}>ชื่อรุ่น / โฉมรถยนต์ (เช่น 911 Carrera, F8, M4):</Text>
                  <TextInput style={styles.formInput} placeholder="กรอกรายละเอียดชื่อรุ่น" value={carModelInput} onChangeText={setCarModelInput} />

                  <Text style={styles.label}>ราคาตั้งขายในตู้กระจก (บาท):</Text>
                  <TextInput style={styles.formInput} placeholder="เช่น 12900000" keyboardType="numeric" value={carPriceInput} onChangeText={setCarPriceInput} />

                  <Text style={styles.label}>กำลังแรงม้าสูงสุด (HP):</Text>
                  <TextInput style={styles.formInput} placeholder="เช่น 650" keyboardType="numeric" value={horsepower} onChangeText={setHorsepower} />

                  <Text style={styles.label}>เลขไมล์ปัจจุบัน (KM):</Text>
                  <TextInput style={styles.formInput} placeholder="เช่น 15000" keyboardType="numeric" value={mileage} onChangeText={setMileage} />

                  <Text style={styles.label}>ประเภทขุมพลังขับเคลื่อน:</Text>
                  <View style={styles.typeSelectorContainer}>
                    {['EV', 'Hybrid', 'Gasoline'].map((type) => (
                      <TouchableOpacity key={type} style={[styles.typeSelectButton, engineType === type && styles.typeSelectButtonActive]} onPress={() => setEngineType(type)}>
                        <Text style={[styles.typeSelectText, engineType === type && styles.typeSelectTextActive]}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>ลำดับของเจ้าของรถก่อนหน้า:</Text>
                  <TextInput style={styles.formInput} placeholder="กรอกลำดับเจ้าของ เช่น 1" keyboardType="numeric" value={ownerCount} onChangeText={setOwnerCount} />

                  <Text style={styles.label}>ประวัติการชนค้ำคอร์นเนอร์:</Text>
                  <View style={styles.typeSelectorContainer}>
                    <TouchableOpacity style={[styles.typeSelectButton, isAccidentFree === true && styles.typeSelectButtonActive]} onPress={() => setIsAccidentFree(true)}>
                      <Text style={[styles.typeSelectText, isAccidentFree === true && styles.typeSelectTextActive]}>🟢 โครงสร้างสวยเดิม</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.typeSelectButton, isAccidentFree === false && {backgroundColor: '#e74c3c'}]} onPress={() => setIsAccidentFree(false)}>
                      <Text style={[styles.typeSelectText, isAccidentFree === false && {color: '#fff'}]}>🔴 เคยเกิดอุบัติเหตุ</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.formSectionHeader}>🏢 ข้อมูลนิติบุคคลผู้จัดจำหน่าย</Text>
                  <Text style={styles.label}>ชื่อโชว์รูมพันธมิตร:</Text>
                  <TextInput style={styles.formInput} placeholder="ระบุชื่อบริษัทของคุณ" value={companyName} onChangeText={setCompanyName} />
                  <Text style={styles.label}>เลขประจำตัวผู้เสียภาษี:</Text>
                  <TextInput style={styles.formInput} placeholder="เลขประจำตัว 13 หลัก" keyboardType="numeric" value={taxId} onChangeText={setTaxId} />

                  <TouchableOpacity style={styles.saveDataButton} onPress={handleSaveDatabaseUI}>
                    <Text style={styles.saveDataButtonText}>💾 ยิงข้อมูลขึ้นสาระบบ Cloud Realtime</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.sellerTitle}>เข้าสู่โหมด Dealer ระบบหลังบ้าน</Text>
                  <Text style={styles.sellerSubtitle}>ล็อกอินเพื่อปลดล็อกสิทธิ์นโยบายสิทธิ์ความปลอดภัยเข้าตาราง</Text>
                  <Text style={styles.label}>บัญชีผู้ใช้งาน:</Text>
                  <TextInput style={styles.sellerInput} placeholder="กรอกอีเมลดีลเลอร์ของคุณ" value={email} onChangeText={setEmail} keyboardType="email-address" />
                  <Text style={styles.label}>รหัสผ่านความปลอดภัย:</Text>
                  <TextInput style={styles.sellerInput} placeholder="ขั้นต่ำอย่างน้อย 6 ตัวอักษร" secureTextEntry value={password} onChangeText={setPassword} />
                  <TouchableOpacity style={styles.signUpButton} onPress={handleSellerSignUp}>
                    <Text style={styles.signUpButtonText}>✅ ปลดล็อกระบบ Dashboard</Text>
                  </TouchableOpacity>
                </>
              )}
            </ScrollView>
            <TouchableOpacity style={styles.closeSellerPortal} onPress={() => setIsSellerPortalVisible(false)}>
              <Text style={styles.closePortalText}>ปิดหน้าต่างระบบควบคุม</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f7' },
  header: { padding: 25, backgroundColor: '#111', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 },
  headerTitle: { color: '#d4af37', fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { color: '#bbb', fontSize: 13, marginTop: 5 },
  portalButton: { backgroundColor: '#333', padding: 10, borderRadius: 10, alignSelf: 'flex-start', marginTop: 15 },
  portalButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  searchContainer: { padding: 15 },
  searchInput: { backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0', fontSize: 15, color: '#333' },
  listContainer: { paddingHorizontal: 15 },
  bannerContainer: { backgroundColor: '#111', padding: 18, borderRadius: 15, marginBottom: 20, borderWidth: 1, borderColor: '#d4af37' },
  bannerTitle: { color: '#d4af37', fontWeight: 'bold', fontSize: 14 },
  bannerSubtitle: { color: '#bbb', fontSize: 11, marginTop: 4 },
  carCard: { backgroundColor: '#fff', borderRadius: 15, marginBottom: 20, elevation: 3, overflow: 'hidden' },
  carImage: { width: '100%', height: 190, backgroundColor: '#ddd', resizeMode: 'cover' },
  carInfo: { padding: 15 },
  badge: { backgroundColor: '#e2f0d9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 5, alignSelf: 'flex-start', marginBottom: 5 },
  badgeText: { color: '#385723', fontSize: 11, fontWeight: 'bold' },
  carBrand: { color: '#d4af37', fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' },
  carName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  carPrice: { fontSize: 16, fontWeight: 'bold', color: '#27ae60', marginTop: 5 },
  button: { backgroundColor: '#111', padding: 14, alignItems: 'center', width: '100%' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, maxHeight: '92%' },
  image360Wrapper: { width: '100%', height: 200, position: 'relative', marginBottom: 15 },
  image360Container: { width: '100%', height: '100%' },
  modalImage: { width: IMAGE_CONTAINER_WIDTH, height: 200, borderRadius: 15, resizeMode: 'cover' },
  view360Badge: { position: 'absolute', bottom: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  view360Text: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginTop: 10 },
  modalBrand: { color: '#d4af37', fontWeight: 'bold', marginVertical: 4 },
  modalPrice: { fontSize: 20, fontWeight: 'bold', color: '#27ae60', marginVertical: 5 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 15 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#111', marginBottom: 10 },
  label: { fontSize: 13, color: '#666', marginBottom: 5, marginTop: 5 },
  modalInput: { backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 16 },
  monthsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  monthButton: { flex: 1, backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 2 },
  monthButtonActive: { backgroundColor: '#111' },
  monthButtonText: { color: '#333', fontWeight: 'bold' },
  monthButtonTextActive: { color: '#fff' },
  calcButton: { backgroundColor: '#d4af37', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  resultBox: { backgroundColor: '#e8f8f5', padding: 15, borderRadius: 8, marginBottom: 15 },
  resultText: { fontSize: 15, color: '#16a085', textAlign: 'center', fontWeight: 'bold' },
  resultPrice: { fontSize: 18, color: '#27ae60' },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, marginBottom: 5 },
  modalButton: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  stripeButton: { backgroundColor: '#635bff' }, 
  closeButton: { backgroundColor: '#95a5a6' },
  modalOverlaySeller: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  sellerContent: { backgroundColor: '#fff', width: '94%', maxHeight: '90%', borderRadius: 25, padding: 20 },
  sellerTitle: { color: '#111', fontSize: 20, fontWeight: 'bold' },
  sellerSubtitle: { color: '#666', fontSize: 12, marginTop: 5, marginBottom: 15 },
  sellerInput: { backgroundColor: '#f1f2f6', padding: 12, borderRadius: 10, marginBottom: 15, fontSize: 16 },
  signUpButton: { backgroundColor: '#111', padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  signUpButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  closeSellerPortal: { marginTop: 15, alignItems: 'center' },
  closePortalText: { color: '#95a5a6', fontSize: 14, fontWeight: 'bold' },
  dashboardStatBox: { backgroundColor: '#111', padding: 15, borderRadius: 12, marginBottom: 15 },
  statLabel: { color: '#bbb', fontSize: 11, fontWeight: 'bold' },
  statValue: { color: '#d4af37', fontSize: 28, fontWeight: 'bold', marginTop: 5 },
  formSectionHeader: { fontSize: 15, fontWeight: 'bold', color: '#111', marginTop: 20, marginBottom: 10, backgroundColor: '#f1f2f6', padding: 8, borderRadius: 5 },
  formInput: { backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, marginBottom: 10, fontSize: 14, color: '#333' },
  typeSelectorContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 5 },
  typeSelectButton: { flex: 1, backgroundColor: '#f1f2f6', padding: 10, borderRadius: 8, alignItems: 'center', marginHorizontal: 3 },
  typeSelectButtonActive: { backgroundColor: '#d4af37' },
  typeSelectText: { color: '#333', fontSize: 12, fontWeight: 'bold' },
  typeSelectTextActive: { color: '#000' },
  saveDataButton: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20, marginBottom: 10 },
  saveDataButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});
