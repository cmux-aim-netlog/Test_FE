import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type MyPagePointsCardProps = {
  current: number;
  total: number;
};

function MyPagePointsCard({ current, total }: MyPagePointsCardProps) {
  const remaining = Math.max(0, total - current);
  const percent = Math.min(100, Math.round((current / total) * 100));

  return (
    <View style={styles.card}>
      <Text style={styles.subtitle}>꾸준한 스터디로</Text>
      <Text style={styles.title}>
        <Text style={styles.pointHighlight}>{current}포인트</Text>가 모여있어요!
      </Text>
      <Text style={styles.caption}>
        환전까지 <Text style={styles.captionHighlight}>{remaining}포인트</Text> 남음
      </Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>
      <View style={styles.progressLabels}>
        <Text style={styles.progressLabel}>0Pt</Text>
        <Text style={styles.progressLabel}>{total}Pt</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 30,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 30,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    backgroundColor: '#FFFFFF',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: "#373737",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: "#373737",
    marginBottom: 20,
  },
  pointHighlight: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 20,
  },
  caption: {
    fontSize: 16,
    fontWeight: '600',
    color: "#373737",
    marginBottom: 25,
  },
  captionHighlight: {
    color: "#373737",
    fontWeight: '700',
  },
  progressTrack: {
    height: 11,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
  
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  progressLabel: {
    fontSize: 11,
    color: '#5D5D5D',
    fontWeight: '500',
  },
});

export default MyPagePointsCard;
