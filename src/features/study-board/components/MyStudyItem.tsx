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
import AuthMethodRow from '../../../components/common/AuthMethodRow';

type MyStudyItemProps = {
  image: ImageSourcePropType;
  tag: string;
  title: string;
  members: string;
  time: string;
  methods: string[];
  authTimes?: { method: string; time: string; deadline?: string; complete?: string }[];
  authDays?: string;
  onDrag?: () => void;
  onPress?: () => void;
};

const personIcon = require('../../../assets/icon/person_icon.png');
const timeIcon = require('../../../assets/icon/time_icon.png');
const categoryIcon = require('../../../assets/icon/category_icon.png');

function MyStudyItem({
  image,
  tag,
  title,
  members,
  time,
  methods,
  authTimes,
  authDays,
  onDrag,
  onPress,
}: MyStudyItemProps) {
  return (
    <Pressable style={styles.card} onPress={onPress} onLongPress={onDrag} delayLongPress={150}>
      <View style={styles.avatarWrap}>
        <Image source={image} style={styles.avatar} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <ImageBackground source={categoryIcon} style={styles.tagChip} resizeMode="contain">
            <Text style={styles.tagText}>{tag}</Text>
          </ImageBackground>
          <View style={styles.memberRow}>
            <Image source={personIcon} style={styles.memberIcon} />
            <Text style={styles.memberText}>{members}</Text>
          </View>
        </View>
        <Text style={styles.title}>{title}</Text>
        {authDays && authDays !== '-' ? (
          <Text style={styles.authDayText}>{authDays}</Text>
        ) : null}
        {authTimes && authTimes.length > 0 ? (
          <View style={styles.authTimeList}>
            {authTimes.map((item, index) => {
              const timeText =
                item.method === 'TODO'
                  ? `${item.deadline ?? item.time}${item.complete ? ` | ${item.complete}` : ''}`
                  : `${item.time}`;
              return (
                <View key={`${item.method}-${index}`} style={styles.authTimeRow}>
                  <AuthMethodRow methods={[item.method]} label="" showIcon={false} />
                  <Text style={styles.authTimeValue}>{timeText}</Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  avatarWrap: {
    width: 104,
    height: 104,
    borderRadius: 18,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatar: {
    width: 84,
    height: 84,
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  tagChip: {
    height: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberIcon: {
    width: 13,
    height: 9,
    tintColor: colors.primary,
  },
  memberText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  authDayText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 6,
  },
  authTimeList: {
    marginTop: 8,
    gap: 6,
  },
  authTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authTimeValue: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});

export default MyStudyItem;
