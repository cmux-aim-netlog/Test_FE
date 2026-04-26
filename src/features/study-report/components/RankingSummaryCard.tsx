import React from 'react';
import { Dimensions, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type RankingSummaryCardProps = {
  title: string;
  description: string;
  percent: number;
  points: number;
};

const rankingIcon = require('../../../assets/icon/ranking.png');
const RANKING_ICON_RATIO = 1268 / 772;
const SCREEN_WIDTH = Dimensions.get('window').width;
const RANKING_BG_WIDTH = SCREEN_WIDTH - 40;

function RankingSummaryCard({ title, description, percent, points }: RankingSummaryCardProps) {
  const percentLabel = `${Number(percent).toFixed(1)}%`;
  const pointsLabel = `${points}P`;
  const percentIndex = description.indexOf(percentLabel);
  const hasPercentInDescription = percentIndex !== -1;

  return (
    <View>
      <View style={styles.titleRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <ImageBackground
        source={rankingIcon}
        style={styles.titleIcon}
        imageStyle={styles.titleIconImage}
        resizeMode="contain"
      >
        
        <View style={styles.reportCard}>
          <Text style={styles.reportText}>
            {hasPercentInDescription ? (
              <>
                {description.slice(0, percentIndex)}
                <Text style={styles.reportPercent}>{percentLabel}</Text>
                {description.slice(percentIndex + percentLabel.length)}
              </>
            ) : (
              description
            )}
          </Text>
          <View style={styles.cumulativeRow}>
            <Text style={styles.cumulativeText}>누적</Text>
            <View style={styles.cumulativeBadge}>
              <Text style={styles.cumulativeBadgePercent}>+{pointsLabel}</Text>
            </View>
            <Text style={styles.cumulativeText}>달성</Text>
          </View>
          <View style={styles.progressRow}>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${percent}%` }]} />
            </View>
            <Text style={styles.progressLabel}>{percentLabel}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  titleRow: {
    marginTop: 24,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: "#2C2C2C",
  },
  titleIcon: {
    width: RANKING_BG_WIDTH,
    aspectRatio: RANKING_ICON_RATIO,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
    paddingTop: 16,
  },
  titleIconImage: {
    width: '100%',
    height: '100%',
  },
  titleIconText: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    top: 12,
    
  },
  reportCard: {
    width: '82%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignSelf: 'center',
    marginTop: 20,
    
  },
  reportText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  reportPercent: {
    fontWeight: '700',
  },
  cumulativeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 15,
  },
  cumulativeText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  cumulativeBadgePercent: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  cumulativeBadge: {
    backgroundColor: colors.primary,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cumulativeBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 16,
    borderRadius: 37,
    backgroundColor: '#E2E2E2',
  },
  progressFill: {
    height: '100%',
    borderStartStartRadius: 37,
    borderEndStartRadius: 37,
    backgroundColor: colors.primary,
  },
  progressLabel: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
});

export default RankingSummaryCard;
