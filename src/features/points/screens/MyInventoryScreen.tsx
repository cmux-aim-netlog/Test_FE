import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, Pressable, Alert, ActivityIndicator, 
  StyleSheet, SafeAreaView, Image 
} from 'react-native';
import { storeApi } from '../../../api/stores'; 
import { UserItem } from '../../../types/store';
import PointsShopHeader from '../shop/PointsShopHeader';
import { colors } from '../../../styles/colors';

interface MyInventoryScreenProps {
  onClose: () => void;
}

function MyInventoryScreen({ onClose }: MyInventoryScreenProps) {
  const [items, setItems] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await storeApi.getMyInventory();
      if (response.success) {
        setItems(response.data.items);
      }
    } catch (error) {
      Alert.alert("오류", "인벤토리를 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const handleDelete = (item: UserItem) => {
    Alert.alert(
      "아이템 삭제",
      `'${item.name}'을(를) 정말 삭제하시겠습니까?\n삭제된 아이템은 복구되지 않습니다.`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: async () => {
            try {
              await storeApi.deleteUserItem(item.productItemId);
              Alert.alert("완료", "아이템이 제거되었습니다.");
              fetchInventory();
            } catch (error) {
              Alert.alert("실패", "삭제 중 오류가 발생했습니다.");
            }
          } 
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}> 
      <PointsShopHeader title="내 인벤토리" onBack={onClose} />
      
      <FlatList
        data={items}
        numColumns={2} // 상점처럼 2열로 배치
        keyExtractor={(item) => item.productItemId.toString()}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            {/* 아이템 이미지 섹션 */}
            <View style={styles.imageContainer}>
              <Image 
                source={require('../../../assets/ticket/ticket.png')} // 상점에서 쓰던 그 이미지
                style={styles.itemIcon}
                resizeMode="contain"
              />
              <View style={styles.quantityBadge}>
                <Text style={styles.quantityText}>x{item.quantity}</Text>
              </View>
            </View>

            {/* 정보 섹션 */}
            <View style={styles.infoContainer}>
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
              
              {/* 작고 깔끔한 삭제 버튼 */}
              <Pressable 
                style={styles.deleteIconButton} 
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteIconText}>삭제</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>보유한 아이템이 없어요. 😢</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  listContent: { padding: 16, paddingBottom: 40 },
  columnWrapper: { justifyContent: 'space-between' },
  
  itemCard: {
    width: '48%', // 2열 구성을 위해 48%
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    // 그림자 효과 (iOS)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    // 그림자 효과 (Android)
    elevation: 3,
    overflow: 'hidden'
  },
  imageContainer: {
    height: 100,
    backgroundColor: '#F1F3F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  itemIcon: { width: 60, height: 40 },
  quantityBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8
  },
  quantityText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  
  infoContainer: { padding: 12, alignItems: 'center' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 8 },
  
  deleteIconButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF4D4D',
    backgroundColor: '#FFF5F5'
  },
  deleteIconText: { color: '#FF4D4D', fontSize: 11, fontWeight: '600' },
  
  emptyContainer: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: '#ADB5BD', fontSize: 16 }
});

export default MyInventoryScreen;