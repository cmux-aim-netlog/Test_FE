import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';
import {
  getGpsLocations,
  addGpsLocation,
  submitGpsVerification,
  getVerificationDateToday,
  type GpsLocationRes,
} from '../../../api/verification';
import { getCurrentUserDisplayName } from '../../../api/client';

const profileImage = require('../../../assets/icon/profile_1.png');
const checkIcon = require('../../../assets/icon/check_icon.png');
const cancelIcon = require('../../../assets/icon/cancel_icon.png');
const locationIcon = require('../../../assets/icon/gps_icon.png');

/** 현재 위치 조회. 실제 앱에서는 @react-native-community/geolocation 등으로 대체 */
function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    const geo = (
      globalThis as typeof globalThis & {
        navigator?: {
          geolocation?: {
            getCurrentPosition: (
              onOk: (p: { coords: { latitude: number; longitude: number } }) => void,
              onErr: (e: unknown) => void,
            ) => void;
          };
        };
      }
    ).navigator?.geolocation;
    if (geo?.getCurrentPosition) {
      geo.getCurrentPosition(
        (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
        reject,
      );
    } else {
      reject(new Error('Geolocation not available'));
    }
  });
}

type StudyStatusLocationProps = {
  groupId: string;
  slot: number;
};

function StudyStatusLocation({ groupId, slot }: StudyStatusLocationProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locations, setLocations] = useState<GpsLocationRes[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(true);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addName, setAddName] = useState('');
  const [addLat, setAddLat] = useState('');
  const [addLng, setAddLng] = useState('');
  const [addSubmitting, setAddSubmitting] = useState(false);

  const refreshLocations = useCallback(() => {
    setLocationsLoading(true);
    getGpsLocations(groupId, slot)
      .then((r) => setLocations(r.data?.data ?? []))
      .catch(() => setLocations([]))
      .finally(() => setLocationsLoading(false));
  }, [groupId, slot]);

  useEffect(() => {
    refreshLocations();
  }, [refreshLocations]);

  const handleVerify = () => {
    setSubmitting(true);
    getCurrentPosition()
      .then(({ latitude, longitude }) => {
        const date = getVerificationDateToday();
        return submitGpsVerification(groupId, slot, { latitude, longitude }, date);
      })
      .then(() => setSubmitted(true))
      .catch((err) => {
        if (err?.message === 'Geolocation not available') {
          Alert.alert(
            '위치 인증',
            '현재 기기에서 위치 서비스를 사용할 수 없습니다. @react-native-community/geolocation 설치 후 연동해 주세요.',
          );
          return;
        }
        const msg =
          err?.response?.status === 400
            ? err?.response?.data?.message ?? '제출 시간이 지났거나 지정된 범위 밖이에요.'
            : '위치 인증 제출에 실패했어요.';
        Alert.alert('인증 실패', msg);
      })
      .finally(() => setSubmitting(false));
  };

  const handleAddLocation = () => {
    const name = addName.trim();
    const lat = parseFloat(addLat);
    const lng = parseFloat(addLng);
    if (!name || Number.isNaN(lat) || Number.isNaN(lng)) {
      Alert.alert('이름, 위도, 경도를 입력해 주세요.');
      return;
    }
    setAddSubmitting(true);
    addGpsLocation(groupId, slot, { name, latitude: lat, longitude: lng })
      .then(() => {
        setAddModalVisible(false);
        setAddName('');
        setAddLat('');
        setAddLng('');
        refreshLocations();
      })
      .catch(() => Alert.alert('위치 등록에 실패했어요.'))
      .finally(() => setAddSubmitting(false));
  };

  const displayName = getCurrentUserDisplayName();
  const isDone = submitted;

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Image source={profileImage} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{displayName} 님</Text>
          </View>
          <View style={styles.metaRow}>
            <Text style={styles.time}>{isDone ? '제출 완료' : '--:--'}</Text>
            <View style={styles.statusWrap}>
              <Text style={[styles.statusText, !isDone && styles.statusFail]}>
                {isDone ? '착석 완료' : '미인증'}
              </Text>
              <Image
                source={isDone ? checkIcon : cancelIcon}
                style={styles.statusIcon}
              />
            </View>
          </View>
        </View>
        {!isDone && (
          <Pressable
            style={[styles.verifyButton, submitting && styles.verifyButtonDisabled]}
            onPress={handleVerify}
            disabled={submitting}
          >
            <Image source={locationIcon} style={styles.verifyIcon} />
            <Text style={styles.verifyText}>
              {submitting ? '제출 중…' : '내 위치 인증'}
            </Text>
          </Pressable>
        )}
      </View>

      {!locationsLoading && locations.length > 0 && (
        <View style={styles.locationsSection}>
          <Text style={styles.locationsTitle}>내 위치</Text>
          {locations.map((loc) => (
            <Text key={loc.locationId} style={styles.locationItem}>
              {loc.name} ({loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)})
            </Text>
          ))}
        </View>
      )}
      <Pressable
        style={styles.addLocationButton}
        onPress={() => setAddModalVisible(true)}
      >
        <Text style={styles.addLocationText}>+ 위치 등록</Text>
      </Pressable>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => !addSubmitting && setAddModalVisible(false)}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>위치 등록</Text>
            <Text style={styles.modalLabel}>이름 (최대 50자)</Text>
            <TextInput
              style={styles.modalInput}
              value={addName}
              onChangeText={setAddName}
              placeholder="예: 집, 도서관"
              placeholderTextColor="#B0B0B0"
              maxLength={50}
            />
            <Text style={styles.modalLabel}>위도</Text>
            <TextInput
              style={styles.modalInput}
              value={addLat}
              onChangeText={setAddLat}
              placeholder="예: 37.5665"
              placeholderTextColor="#B0B0B0"
              keyboardType="decimal-pad"
            />
            <Text style={styles.modalLabel}>경도</Text>
            <TextInput
              style={styles.modalInput}
              value={addLng}
              onChangeText={setAddLng}
              placeholder="예: 126.9780"
              placeholderTextColor="#B0B0B0"
              keyboardType="decimal-pad"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={styles.modalCancel}
                onPress={() => !addSubmitting && setAddModalVisible(false)}
                disabled={addSubmitting}
              >
                <Text style={styles.modalCancelText}>취소</Text>
              </Pressable>
              <Pressable
                style={[styles.modalSubmit, addSubmitting && styles.modalSubmitDisabled]}
                onPress={handleAddLocation}
                disabled={addSubmitting}
              >
                <Text style={styles.modalSubmitText}>
                  {addSubmitting ? '등록 중…' : '등록'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 8,
    paddingBottom: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 21,
    marginRight: 12,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  name: {
    fontSize: 10,
    color: '#6E6E6E',
    fontWeight: '400',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  time: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    minWidth: 76,
  },
  statusWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#7D7D7D',
    fontWeight: '600',
  },
  statusIcon: {
    width: 14,
    height: 14,
  },
  statusFail: {
    color: '#7D7D7D',
  },
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E4E4E4',
    backgroundColor: '#F6F6F6',
  },
  verifyButtonDisabled: {
    opacity: 0.6,
  },
  verifyIcon: {
    width: 13,
    height: 17,
    tintColor: colors.primary,
  },
  verifyText: {
    fontSize: 12,
    color: '#6F6F6F',
    fontWeight: '600',
  },
  locationsSection: {
    marginBottom: 12,
  },
  locationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  locationItem: {
    fontSize: 11,
    color: '#666',
    marginBottom: 2,
  },
  addLocationButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  addLocationText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  modalCancelText: {
    fontSize: 14,
    color: '#666',
  },
  modalSubmit: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  modalSubmitDisabled: {
    opacity: 0.6,
  },
  modalSubmitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});

export default StudyStatusLocation;
