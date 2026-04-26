import React from 'react';
import { Image, ImageBackground, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type StudyOverviewCardProps = {
  tag: string;
  title: string;
  members: string;
  description: string;
  schedule: string;
  methods: string[];
  image: ImageSourcePropType;
  authTimes?: { method: string; time: string; deadline?: string; complete?: string }[];
  authDays?: string;
  period?: string;
};

const categoryIcon = require('../../../assets/icon/category_icon.png');
const personIcon = require('../../../assets/icon/person_icon.png');
const timeIcon = require('../../../assets/icon/time_icon.png');

function StudyOverviewCard({
  tag,
  title,
  members,
  description,
  schedule,
  methods,
  image,
  authTimes,
  authDays,
  period,
}: StudyOverviewCardProps) {
  const authRows =
    authTimes && authTimes.length > 0
      ? authTimes.map((item) => ({
          method: item.method,
          time: item.method === 'TODO' ? item.time.replace('|', ' | ') : item.time,
        }))
      : methods.map((method) => ({ method, time: '-' }));

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <ImageBackground source={categoryIcon} style={styles.tagChip} resizeMode="contain">
          <Text style={styles.tagText}>{tag}</Text>
        </ImageBackground>
      </View>
      <View style={styles.infoRow}>
        <View style={styles.avatarWrap}>
          <Image source={image} style={styles.avatar} resizeMode="cover" />
        </View>
        <View style={styles.infoText}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.memberRow}>
              <Image source={personIcon} style={styles.memberIcon} />
              <Text style={styles.memberText}>{members}</Text>
            </View>
          </View>
          <Text style={styles.subtitle}>{description}</Text>
        </View>
      </View>
      <View style={styles.detailBox}>
        <View style={styles.detailRow}>
          <Image source={timeIcon} style={styles.detailIcon} />
          <Text style={styles.detailValue}>{period ?? schedule}</Text>
          {authDays ? <Text style={styles.detailValue}>{authDays}</Text> : null}
        </View>
        <View style={styles.methodRow}>
          <Text style={styles.detailLabel}>방식</Text>
          <View style={styles.methodColumn}>
            {authRows.length > 0 ? (
              authRows.map((row) => (
                <View key={`${row.method}-${row.time}`} style={styles.methodLine}>
                  <View style={styles.methodChip}>
                    <View style={styles.methodBar} />
                    <Text style={styles.methodText}>{row.method}</Text>
                  </View>
                  <Text style={styles.methodTime}>{row.time}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.methodTime}>-</Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 35,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagChip: {
    height: 22,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberIcon: {
    width: 14,
    height: 10,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14,
  },
  avatarWrap: {
    width: 71,
    height: 71,
    borderRadius: 7,
    backgroundColor: colors.secondary,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  infoText: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  detailBox: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 10,
    padding: 18,
    gap: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  detailIcon: {
    width: 12,
    height: 12,
    tintColor: colors.textSecondary,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#515151',
  },
  detailValue: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  methodColumn: {
    flex: 1,
    gap: 8,
  },
  methodLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'wrap',
  },
  methodChip: {
    height: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#D9D9D9',
    borderRadius: 2,
    overflow: 'hidden',
    paddingRight: 6,
  },
  methodBar: {
    width: 4,
    height: '100%',
    backgroundColor: colors.primary,
  },
  methodText: {
    fontSize: 10,
    color: colors.textSecondary,
    marginLeft: 5,
    lineHeight: 18,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  methodTime: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'right',
    flexShrink: 1,
  },
});

export default StudyOverviewCard;
