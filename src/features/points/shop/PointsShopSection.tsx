import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
// 부모로부터 ShopItem 인터페이스 import
import { ShopItem } from '../screens/PointsShopScreen';

type PointsShopSectionProps = {
  title: string;
  items: ShopItem[];
  onItemPress: (item: ShopItem) => void;
};

function PointsShopSection({ title, items, onItemPress }: PointsShopSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.itemsContainer}>
        {items.map((item) => (
          <Pressable 
            key={item.productId} // 서버의 식별자 사용
            style={styles.itemCard}
            onPress={() => onItemPress(item)}
          >
            {/* item.iconSource가 로드되지 않으면 에러가 나므로 기본값 확인 필수 */}
            <Image source={item.iconSource} style={item.iconSize} resizeMode="contain" />
            <Text style={styles.itemLabel}>{item.name}</Text>
            <View style={styles.priceBadge}>
               <Text style={styles.priceText}>{item.priceLabel}</Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 20 },
  title: { fontSize: 18, fontWeight: '800', marginBottom: 16 },
  itemsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  itemCard: {
    width: '31%',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginRight: '2%',
    marginBottom: 10,
  },
  itemLabel: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  priceBadge: { backgroundColor: '#333', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginTop: 6 },
  priceText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
});

export default PointsShopSection;