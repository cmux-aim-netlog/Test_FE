import React, { useState } from 'react';
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';

const rightArrow = require('../../../assets/icon/right_arrow.png');

type BadgeItem = {
  image: ImageSourcePropType;
  title: string;
  description: string;
};

type BadgeSectionProps = {
  title: string;
  badges: BadgeItem[];
};

function BadgeSection({ title, badges }: BadgeSectionProps) {
  const previewCount = 3;
  const [expanded, setExpanded] = useState(false);
  const visibleBadges = expanded ? badges : badges.slice(0, previewCount);

  const badgeList = (
    <View style={styles.badgeRow}>
      {visibleBadges.map((badge, index) => (
        <View key={`${badge.title}-${index}`} style={styles.badgeItem}>
          <Image source={badge.image} style={styles.badgeImage} />
          <Text style={styles.badgeLabel}>{badge.title}</Text>
          <Text style={styles.badgeDesc}>{badge.description}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.badgeCard}>
      <Text style={styles.badgeTitle}>{title}</Text>
      {expanded ? (
        <ScrollView
          style={styles.badgeScroll}
          contentContainerStyle={styles.badgeScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {badgeList}
        </ScrollView>
      ) : (
        badgeList
      )}
      <Pressable
        style={styles.expandToggle}
        onPress={() => setExpanded((prev) => !prev)}
        accessibilityRole="button"
        accessibilityLabel={expanded ? '뱃지 접기' : '뱃지 펼치기'}
      >
        <Image source={rightArrow} style={[styles.expandIcon, expanded && styles.expandIconOpen]} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  badgeCard: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 7,
    backgroundColor: '#F2FEF7',
    marginBottom: 22,
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    columnGap: 10,
    rowGap: 16,
  },
  badgeItem: {
    width: '30%',
    alignItems: 'center',
  },
  badgeImage: {
    width: 42,
    height: 54,
    marginBottom: 8,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  badgeDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  expandToggle: {
    alignItems: 'center',
    marginTop: 14,
  },
  expandIcon: {
    width: 6,
    height: 16,
    tintColor: '#92E7A5',
    transform: [{ rotate: '90deg' }],
  },
  expandIconOpen: {
    transform: [{ rotate: '270deg' }],
  },
  badgeScroll: {
    maxHeight: 200,
  },
  badgeScrollContent: {
    paddingBottom: 6,
  },
});

export default BadgeSection;
