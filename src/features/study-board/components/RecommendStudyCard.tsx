import React from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type RecommendStudyCardProps = {
  tag: string;
  members: string;
  title: string;
  time: string;
  method: string;
  authTimes?: { method: string; time: string }[];
  onPress?: () => void;
};

const timeIcon = require('../../../assets/icon/time_icon.png');
const personIcon = require('../../../assets/icon/person_icon.png');
const rightIcon = require('../../../assets/icon/right_arrow.png');

function RecommendStudyCard({
  tag,
  members,
  title,
  time,
  method,
  authTimes,
  onPress,
}: RecommendStudyCardProps) {
  const timeRows =
    authTimes && authTimes.length > 0
      ? authTimes.map((item) =>
          item.method === 'TODO' ? item.time.replace('|', ' | ') : item.time,
        )
      : [time];
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardTop}>
          <ImageBackground
            source={require('../../../assets/icon/category_icon.png')}
            style={styles.category}
            resizeMode="contain"
          >
            <Text style={styles.chipText}>{tag}</Text>
          </ImageBackground>
          <View style={styles.membersRow}>
            <Image source={personIcon} style={styles.membersIcon} />
            <Text style={styles.membersText}>{members}</Text>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.metaBlock}>
          {timeRows.map((value, index) => (
            <View key={`${value}-${index}`} style={styles.metaRow}>
              <Image source={timeIcon} style={styles.timeIcon} />
              <Text style={styles.metaText}>{value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.methodBlock}>
          <Text style={styles.methodLabel}>인증방식</Text>
          <Text style={styles.methodText}>{method}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>자세히 보기</Text>
          <Image source={rightIcon} style={styles.footerIcon} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 162,
    height: 230,
    backgroundColor: '#F4FCF7',
    borderRadius: 16,
    paddingTop: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOpacity: 0.13,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  category: {
    paddingHorizontal: 12,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  metaBlock: {
    gap: 6,
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    width: 10,
    height: 10,
    marginRight: 6,
    tintColor: colors.textSecondary,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membersIcon: {
    width: 13,
    height: 9,
    tintColor: colors.primary,
  },
  membersText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: '700',
  },
  methodBlock: {
    marginBottom: 10,
  },
  methodLabel: {
    fontSize: 13,
    color: '#515151',
    marginBottom: 6,
    fontWeight: '700',
  },
  methodText: {
    fontSize: 12,
    color: '#515151',
    fontWeight: '500',
  },
  footer: {

    borderTopWidth: 1,
    borderTopColor: '#E6F2EA',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginHorizontal: -14,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    marginTop: 'auto',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  footerText: {
    fontSize: 12,
    color: '#8A9B90',
    fontWeight: '600',
  },
  footerIcon: {
    width: 4,
    height: 8,
    tintColor: '#BDCAC3',
  },
});

export default RecommendStudyCard;
