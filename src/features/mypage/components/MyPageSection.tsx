import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../../../styles/colors';

// 1. 타입 정의: 'rows'가 반드시 포함되도록 설정
interface MyPageSectionRow {
  left: string;
  right?: string;
  onPress?: () => void;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

interface MyPageSectionProps {
  title: string;
  rows: MyPageSectionRow[]; // 이 부분이 undefined면 에러가 납니다.
}

function MyPageSection({ title, rows = [] }: MyPageSectionProps) { // 기본값 [] 추가로 에러 방지
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.rowsContainer}>
        {/* rows가 확실히 있을 때만 map을 돌립니다 */}
        {rows && rows.map((row, index) => (
          <View key={index} style={styles.rowWrapper}>
            {/* 왼쪽 아이템 */}
            <Pressable 
              style={[styles.item, !row.right && styles.fullWidth]} 
              onPress={row.onPressLeft || row.onPress}
            >
              <Text style={styles.itemText}>{row.left}</Text>
            </Pressable>

            {/* 오른쪽 아이템 */}
            {row.right && (
              <Pressable 
                style={styles.item} 
                onPress={row.onPressRight || row.onPress}
              >
                <Text style={styles.itemText}>{row.right}</Text>
              </Pressable>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, marginTop: 24 },
  title: { fontSize: 14, fontWeight: '700', color: '#888', marginBottom: 16 },
  rowsContainer: { backgroundColor: '#fff' },
  rowWrapper: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 20 
  },
  item: { width: '45%', paddingVertical: 4 },
  fullWidth: { width: '100%' },
  itemText: { fontSize: 16, color: '#333', fontWeight: '500' },
});

export default MyPageSection;