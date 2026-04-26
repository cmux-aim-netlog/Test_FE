import React, { useState, useEffect } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { colors } from '../../../styles/colors';
import PointsShopBalanceBar from '../shop/PointsShopBalanceBar';
import PointsShopHeader from '../shop/PointsShopHeader';
import PointsShopSection from '../shop/PointsShopSection';

import { storeApi } from '../../../api/stores';
import { getPointBalance } from '../../../api/point';
import { Product } from '../../../types/store';

// ShopItem 인터페이스 정의 및 내보내기
export interface ShopItem extends Product {
  priceLabel: string; 
  iconSource: any;
  iconSize: { width: number; height: number };
}

function PointsShopScreen({ onClose }: { onClose?: () => void }) {
  const [userPoints, setUserPoints] = useState<number>(0);
  const [products, setProducts] = useState<ShopItem[]>([]); // Product 대신 ShopItem 사용
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const initData = async () => {
      try {
        setLoading(true);
        const [pointRes, productRes] = await Promise.all([
          getPointBalance(),
          storeApi.getAvailableProducts()
        ]);

        if (pointRes.data?.success) setUserPoints(pointRes.data.data);

        if (productRes?.success) {
          const mappedItems: ShopItem[] = productRes.data.map((p: Product) => ({
            ...p,
            priceLabel: `${p.price.toLocaleString()}P`,
            iconSource: require('../../../assets/ticket/ticket.png'), // 기본 이미지
            iconSize: { width: 56, height: 30 }
          }));
          setProducts(mappedItems);
        }
      } catch (error: any) {
        // 404 에러 등이 나면 여기 콘솔에 찍힙니다.
        console.error("상점 로딩 에러:", error.response?.status, error.message);
        Alert.alert("오류", "데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handlePurchase = async (item: ShopItem) => {
    Alert.alert("구매 확인", `${item.name}을(를) 구매하시겠습니까?`, [
      { text: "취소", style: "cancel" },
      { 
        text: "구매", 
        onPress: async () => {
          try {
            // 2. item.productId로 수정하여 타입 에러 해결
            const response = await storeApi.purchaseProduct(item.productId); 
            if (response.success) {
              Alert.alert("구매 완료", "면제권이 지급되었습니다.");
              const pointUpdate = await getPointBalance();
              if (pointUpdate.data.success) setUserPoints(pointUpdate.data.data);
            }
          } catch (error: any) {
            Alert.alert("구매 실패", error.response?.data?.message || "구매에 실패했습니다.");
          }
        } 
      }
    ]);
  };

  const allItems = products.filter(p => p.category === 'ALL'); 
  const coteItems = products.filter(p => p.category === 'COTE');
  const wakeItems = products.filter(p => p.category === 'WAKE');
  const langItems = products.filter(p => p.category === 'LANG');
  const seatItems = products.filter(p => p.category === 'SEATED');
  const certItems = products.filter(p => p.category === 'CERT');
  const etcItems = products.filter(p => p.category === 'ETC');

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <PointsShopHeader title="포인트 상점" onBack={onClose} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.adBanner}><Text style={styles.adText}>광고</Text></View>
        <PointsShopBalanceBar 
          pointsLabel={`${userPoints.toLocaleString()}P`} 
          onPressExchange={() => {}}
        />
        {allItems.length > 0 && <PointsShopSection title="모든 스터디 면제권" items={allItems} onItemPress={handlePurchase} />}
        {coteItems.length > 0 && <PointsShopSection title="코테 스터디 면제권" items={coteItems} onItemPress={handlePurchase} />}
        {wakeItems.length > 0 && <PointsShopSection title="기상 면제권" items={wakeItems} onItemPress={handlePurchase} />}
        {langItems.length > 0 && <PointsShopSection title="공부 면제권" items={langItems} onItemPress={handlePurchase} />}
        {seatItems.length > 0 && <PointsShopSection title="언어 면제권" items={seatItems} onItemPress={handlePurchase} />}
        {certItems.length > 0 && <PointsShopSection title="자격증 면제권" items={certItems} onItemPress={handlePurchase} />}
        {etcItems.length > 0 && <PointsShopSection title="기타 면제권" items={etcItems} onItemPress={handlePurchase} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 32 },
  adBanner: { height: 70, backgroundColor: '#EFEFEF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  adText: { fontSize: 14, fontWeight: '700', color: '#6C6C6C' },
});

export default PointsShopScreen;