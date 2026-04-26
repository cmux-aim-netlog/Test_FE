import React, { useMemo, useState, useEffect } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../../styles/colors';
import PointsHistoryList from '../history/PointsHistoryList';
import PointsHistoryMonthNav from '../history/PointsHistoryMonthNav';
import PointsHistoryTabs from '../history/PointsHistoryTabs';
import { getPointHistory } from '../../../api/point';
import { PointTransaction } from '../../../types/point';

const backIcon = require('../../../assets/icon/left_arrow.png');

type PointsHistoryScreenProps = {
  onClose?: () => void;
};

function PointsHistoryScreen({ onClose }: PointsHistoryScreenProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const monthLabel = `${currentMonth.getFullYear()}년 ${currentMonth.getMonth() + 1}월`;

  

useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const response = await getPointHistory(activeTab);
        if (response.data && response.data.data) {
          setTransactions(response.data.data.content);
        }
      } catch (error) {
        console.error('포인트 내역 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [activeTab]);

  const items = useMemo(() => {
    return transactions.map((t) => {
      const date = new Date(t.createdAt);
      const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
      
      return {
        id: t.transactionId,
        dateLabel: `${date.getDate()}일 ${dayNames[date.getDay()]}`,
        title: t.description,
        type: (t.type === '적립' ? 'earn' : t.type === '사용' ? 'use' : 'exchange') as 'earn' | 'use' | 'exchange',
        amountLabel: `${t.amount > 0 ? '+' : ''}${t.amount.toLocaleString()}P`,
      };
    });
  }, [transactions]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.backButton}>
            <Image source={backIcon} style={styles.backIcon} />
          </Pressable>
          <Text style={styles.headerTitle}>포인트 내역</Text>
        </View>

        <PointsHistoryTabs activeKey={activeTab} onChange={setActiveTab} />
        <PointsHistoryMonthNav
          label={monthLabel}
          onPrev={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          onNext={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
        />

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <PointsHistoryList items={items} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 12,
    paddingBottom: 8,
  },
  backButton: {
    padding: 6,
    marginRight: 6,
  },
  backIcon: {
    width: 8,
    height: 16,
    tintColor: '#B8B8B8',
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
    center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PointsHistoryScreen;
