import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Pressable, StyleSheet, SafeAreaView, 
  ActivityIndicator, Alert, Modal, TextInput, ScrollView 
} from 'react-native';
import { storeApi } from '../../../api/stores'; 
import { Product, CategoryType } from '../../../types/store';
import PointsShopHeader from '../shop/PointsShopHeader';
import { colors } from '../../../styles/colors';

interface AdminStoreScreenProps {
  onClose: () => void;
}

// 백엔드 DTO 및 에넘 기준 카테고리 리스트
const CATEGORIES: CategoryType[] = [
  'ALL', 'COTE', 'WAKE', 'SEATED', 
  'LANG', 'CERT', 'ETC',
];

function AdminStoreScreen({ onClose }: AdminStoreScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  // 입력 폼 상태
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<CategoryType>('ALL');
  const [isAvailable, setIsAvailable] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await storeApi.getAllProductsAdmin();
      if (res.success) {
        setProducts(res.data);
      }
    } catch (error) {
      Alert.alert("에러", "상품 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  // 삭제 함수 추가
  const handleDelete = (productId: number, productName: string) => {
    Alert.alert(
      "상품 삭제",
      `'${productName}' 상품을 정말 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive", 
          onPress: async () => {
            try {
              const res = await storeApi.deleteProduct(productId);
              if (res.success) {
                Alert.alert("완료", "상품이 삭제되었습니다.");
                loadProducts();
              }
            } catch (error) {
              Alert.alert("실패", "삭제 중 오류가 발생했습니다.");
            }
          } 
        }
      ]
    );
  };

  const openModal = (item?: Product) => {
    if (item) {
      setIsEditing(true);
      setSelectedProductId(item.productId);
      setName(item.name);
      setPrice(item.price.toString());
      setCategory(item.category);
      setIsAvailable(item.isAvailable);
    } else {
      setIsEditing(false);
      setName('');
      setPrice('');
      setCategory('ALL');
      setIsAvailable(true);
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!name || !price) {
      Alert.alert("알림", "상품명과 가격을 입력해주세요.");
      return;
    }

    const payload = {
      name,
      price: parseInt(price),
      category,
      isAvailable,
    };

    try {
      if (isEditing && selectedProductId) {
        await storeApi.updateProduct(selectedProductId, payload);
        Alert.alert("완료", "상품이 수정되었습니다.");
      } else {
        await storeApi.createProduct(payload);
        Alert.alert("완료", "새 상품이 등록되었습니다.");
      }
      setModalVisible(false);
      loadProducts();
    } catch (error) {
      Alert.alert("실패", "저장 중 오류가 발생했습니다. (백엔드 메서드 확인 필요)");
    }
  };

  if (loading) return <SafeAreaView style={styles.center}><ActivityIndicator size="large" color={colors.primary} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <PointsShopHeader title="상품 관리" onBack={onClose} />
      
      <View style={styles.content}>
        <Pressable style={styles.addButton} onPress={() => openModal()}>
          <Text style={styles.addText}>+ 새 상품 등록</Text>
        </Pressable>

        <FlatList
          data={products}
          keyExtractor={(item) => item.productId.toString()}
          renderItem={({ item }) => (
            <View style={styles.adminCard}>
              <View style={styles.cardInfo}>
                <View style={styles.badgeRow}>
                  <Text style={styles.categoryBadge}>{item.category}</Text>
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardPrice}>{item.price.toLocaleString()} P</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <Pressable style={styles.editBtn} onPress={() => openModal(item)}>
                  <Text style={styles.editBtnText}>수정</Text>
                </Pressable>
                <Pressable style={styles.deleteBtn} onPress={() => handleDelete(item.productId, item.name)}>
                  <Text style={styles.deleteBtnText}>삭제</Text>
                </Pressable>
              </View>
            </View>
          )}
        />
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>{isEditing ? "상품 수정" : "상품 등록"}</Text>
              
              <Text style={styles.label}>상품명</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
              
              <Text style={styles.label}>가격</Text>
              <TextInput style={styles.input} value={price} onChangeText={setPrice} keyboardType="numeric" />

              <Text style={styles.label}>카테고리</Text>
              <View style={styles.categoryGrid}>
                {CATEGORIES.map((cat) => (
                  <Pressable 
                    key={cat}
                    style={[styles.catItem, category === cat && styles.catItemActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.catText, category === cat && styles.catTextActive]}>
                      {cat}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.label}>판매 여부</Text>
              <Pressable 
                style={[styles.statusToggle, isAvailable ? styles.statusOn : styles.statusOff]}
                onPress={() => setIsAvailable(!isAvailable)}
              >
                <Text style={[styles.statusToggleText, { color: isAvailable ? colors.primary : '#666' }]}>
                  {isAvailable ? "판매 중" : "판매 중지 (숨김)"}
                </Text>
              </Pressable>

              <View style={styles.modalBtns}>
                <Pressable style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.cancelBtnText}>취소</Text>
                </Pressable>
                <Pressable style={styles.saveBtn} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>저장</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  addButton: { backgroundColor: colors.primary, padding: 15, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  addText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  adminCard: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12, alignItems: 'center', justifyContent: 'space-between', elevation: 2 },
  cardInfo: { flex: 1 },
  badgeRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  categoryBadge: { fontSize: 10, color: colors.primary, backgroundColor: '#E8F5E9', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden', fontWeight: '600' },
  hiddenBadge: { fontSize: 10, color: '#FFF', backgroundColor: '#ADB5BD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  cardPrice: { fontSize: 14, color: '#666', marginTop: 2 },
  
  // 버튼 그룹 스타일
  actionButtons: { flexDirection: 'row', gap: 8 },
  editBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#F1F3F5', borderRadius: 8 },
  editBtnText: { fontSize: 13, color: '#495057', fontWeight: '600' },
  deleteBtn: { paddingHorizontal: 12, paddingVertical: 8, backgroundColor: '#FFF5F5', borderRadius: 8 },
  deleteBtnText: { fontSize: 13, color: '#FF6B6B', fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', backgroundColor: '#fff', borderRadius: 24, padding: 24, maxHeight: '85%' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 13, color: '#888', marginBottom: 8, marginTop: 12, fontWeight: '600' },
  input: { backgroundColor: '#F8F9FA', padding: 14, borderRadius: 12, fontSize: 15, borderWidth: 1, borderColor: '#EEE' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  catItem: { width: '48%', paddingVertical: 12, borderRadius: 10, backgroundColor: '#F1F3F5', alignItems: 'center', marginBottom: 10 },
  catItemActive: { backgroundColor: colors.primary },
  catText: { fontSize: 13, color: '#666' },
  catTextActive: { color: '#FFF', fontWeight: 'bold' },
  statusToggle: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  statusOn: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: colors.primary },
  statusOff: { backgroundColor: '#F1F3F5' },
  statusToggleText: { fontSize: 14, fontWeight: '700' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 30, marginBottom: 10 },
  cancelBtn: { flex: 1, padding: 16, alignItems: 'center', borderRadius: 12, backgroundColor: '#F1F3F5' },
  cancelBtnText: { color: '#888', fontWeight: '600' },
  saveBtn: { flex: 1.5, backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: 'bold' },
});

export default AdminStoreScreen;