import React from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import MascotImage from '../../../components/common/CategoryImage';
import AuthMethodRow from '../../../components/common/AuthMethodRow';
export type StatusVariant = 'success' | 'danger' | 'neutral';
export type StatusIconType = 'success' | 'danger';

export type StudyCardProps = {
  tag: string;
  title: string;
  schedule: string;
  members: string;
  statusText: string;
  statusVariant?: StatusVariant;
  statusIcons?: StatusIconType[];
  methods?: string[];
  authTimes?: { method: string; time: string; deadline?: string; complete?: string }[];
  authDays?: string;
  mascotLabel?: string;
  mascotSource?: ImageSourcePropType;
  onPress?: () => void;
};


const personIcon = require('../../../assets/icon/person_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const checkIcon = require('../../../assets/icon/check_icon.png');

function StudyCard({
  tag,
  title,
  schedule,
  members,
  statusText,
  statusVariant = 'neutral',
  statusIcons,
  methods,
  authTimes,
  authDays,
  mascotLabel,
  mascotSource,
  onPress,
}: StudyCardProps) {
  const statusIcon =
    statusVariant === 'danger' ? cancelIcon : statusVariant === 'success' ? checkIcon : null;
  const statusIconList =
    statusIcons && statusIcons.length > 0
      ? statusIcons.slice(0, 2)
      : statusIcon
        ? [statusVariant === 'danger' ? 'danger' : 'success']
        : [];

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        {/* left */}
        <View style={styles.leftInfo}>
          <View style={styles.categoryRow}>
            <ImageBackground
              source={require('../../../assets/icon/category_icon.png')}
              style={styles.category}
              resizeMode="contain">
              <Text style={styles.chipText}>{tag}</Text>
            </ImageBackground>
            <View style={styles.membersInline}>
              <Image source={personIcon} style={styles.membersIcon} />
              <Text style={styles.membersText}>{members}</Text>
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          {authDays ? <Text style={styles.schedule}>{authDays}</Text> : null}
          {authTimes && authTimes.length > 0 ? (
            <View style={styles.methodList}>
              {authTimes.map((item, index) => (
                <View key={`${item.method}-${index}`} style={styles.methodLine}>
                  <AuthMethodRow methods={[item.method]} label="" showIcon={false} />
                  <Text style={styles.methodTime}>
                    {item.method === 'TODO' ? item.time.replace('|', ' | ') : item.time}
                  </Text>
                </View>
              ))}
            </View>
          ) : methods && methods.length > 0 ? (
            <AuthMethodRow methods={methods} label="" showIcon={false} />
          ) : null}
        </View>

        {/* right */}
        <View style={styles.rightCol}>
          <View style={styles.mascot}>
            {mascotSource ? (
              <MascotImage source={mascotSource} />
            ) : (
              <Text style={styles.mascotText}>{mascotLabel}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.membersRow} />
        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{statusText}</Text>
          {statusIconList.map((iconType, index) => (
            <Image
              key={`${iconType}-${index}`}
              source={iconType === 'danger' ? cancelIcon : checkIcon}
              style={styles.statusIcon}
            />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 30,
    paddingVertical: 14,
    height: 159,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    justifyContent: 'flex-start',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  leftInfo: {
    flex: 1,
    paddingRight: 12, 
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 8,
    marginBottom: 8,
  },
  category: {
    paddingHorizontal: 10,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  membersInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  chipText: {
    fontSize: 11,
    color: colors.textPrimary,
    fontWeight: '700',
  },
  mascot: {
    height: 94,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  mascotText: {
    fontSize: 26,
  },
  title: {
    fontSize: 21,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    
  },
  schedule: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  methodList: {
    gap: 6,
  },
  methodLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  methodTime: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: 12,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  membersIcon: {
    width: 17,
    height: 12,
  },
  membersText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  statusIcon: {
    width: 20,
    height: 20,
  },
});

export default StudyCard;
