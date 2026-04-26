import React, { useState, useEffect } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { notificationApi } from '../../../api/notification';
import { getCurrentUserId } from '../../../api/client';

const alarmIcon = require('../../../assets/icon/alarm_icon.png');
const settingIcon = require('../../../assets/icon/setting_icon.png');

type MyPageHeaderProps = {
  onPressAlarm?: () => void;
  onPressSetting?: () => void;
  /** * [중요] UUID 체계로의 전환을 위해 타입을 string으로 변경했습니다. 
   * 기존 number 타입으로 전달될 경우 ts(2345) 에러가 발생합니다.
   */
  userId?: string; 
};

function MyPageHeader({ 
  onPressAlarm, 
  onPressSetting, 
  // 기본값으로 1이 아닌 현재 세션의 UUID를 사용합니다.
  userId = getCurrentUserId() || '3fa14730-51a4-4676-80f5-fffccd085ce7' 
}: MyPageHeaderProps) {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const fetchCount = async () => {
      // userId가 없거나 유효하지 않으면 요청을 보내지 않습니다.
      if (!userId) return;

      try {
        /**
         * notificationApi.getUnreadCount 인자 타입이 string으로 선언되어 있어야 합니다.
         * 백엔드에서 400 에러가 난다면 컨트롤러의 @RequestParam 타입을 확인하세요.
         */
        const res = await notificationApi.getUnreadCount(userId);
        if (res.data !== undefined) {
          setUnreadCount(res.data);
        }
      } catch (error) {
        // 401 에러 발생 시 토큰 만료 여부를 확인해야 합니다.
        console.warn('배지 개수를 가져오지 못했습니다.');
      }
    };

    fetchCount();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>마이페이지</Text>
      <View style={styles.iconRow}>
        <Pressable onPress={onPressAlarm} style={styles.iconButton}>
          <View>
            <Image source={alarmIcon} style={[styles.icon, { width: 22.28, height: 28 }]} />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
              </View>
            )}
          </View>
        </Pressable>
        <Pressable onPress={onPressSetting} style={styles.iconButton}>
          <Image source={settingIcon} style={[styles.icon, { width: 25, height: 25 }]} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 12, 
    paddingBottom: 8 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: colors.textPrimary 
  },
  iconRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  iconButton: { 
    padding: 4 
  },
  icon: { 
    tintColor: '#9B9B9B' 
  },
  badge: {
    position: 'absolute', 
    right: -4, 
    top: -2, 
    backgroundColor: colors.primary,
    minWidth: 16, 
    height: 16, 
    borderRadius: 8, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 3, 
    borderWidth: 1.5, 
    borderColor: '#FFFFFF'
  },
  badgeText: { 
    color: '#FFFFFF', 
    fontSize: 9, 
    fontWeight: '800' 
  },
});

export default MyPageHeader;