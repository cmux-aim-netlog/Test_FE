import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { colors } from '../../../styles/colors';
import CreateStudyHeader from '../components/CreateStudyHeader';
import ResultHeader from '../components/ResultHeader';
import StudySummaryCard from '../components/StudySummaryCard';
import PrimaryActionButton from '../components/PrimaryActionButton';
import { type MethodConfig } from '../components/AuthMethodSection';

type CreateStudyGroupResultScreenProps = {
  onClose: () => void;
  onConfirm: () => void;
  category: string;
  primaryConfig: MethodConfig | null;
  secondaryConfig: MethodConfig | null;
  members: number;
  startDate: Date;
  endDate: Date;
  days: string[];
  imageUri?: string | null;
  /** 생성된 스터디 그룹 ID (API 성공 시 전달) */
  createdGroupId?: number | null;
};

const formatDate = (value: Date) =>
  `${value.getFullYear()}. ${value.getMonth() + 1}. ${value.getDate()}.`;

const formatTime = (value: Date) => {
  const hours = value.getHours().toString().padStart(2, '0');
  const minutes = value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const buildAuthTime = (config: MethodConfig) => {
  if (config.method === 'TODO') {
    return `작성 마감 ${formatTime(config.todoDeadline)}\n완료 시간 ${formatTime(
      config.todoComplete,
    )}`;
  }
  if (config.method === '위치') {
    return `마감 시간 ${formatTime(config.rangeEnd)}`;
  }
  return `마감 시간 ${formatTime(config.rangeEnd)}`;
};

const formatMethodLabel = (config: MethodConfig) => {
  if (config.method !== '위치') {
    return config.method;
  }
  const locationName =
    config.locationType === '공통 위치' && config.locationName
      ? `, ${config.locationName}`
      : '';
  return `${config.method} (${config.locationType}${locationName})`;
};

function CreateStudyGroupResultScreen({
  onClose,
  onConfirm,
  category,
  primaryConfig,
  secondaryConfig,
  members,
  startDate,
  endDate,
  days,
  imageUri,
  createdGroupId,
}: CreateStudyGroupResultScreenProps) {
  const weekdayText = days.length > 0 ? `매주 ${days.join('')}` : '-';
  const rows = [
    ...(createdGroupId != null ? [{ label: '그룹 ID', value: String(createdGroupId) }] : []),
    { label: '카테고리', value: category },
    ...(primaryConfig
      ? [
          { label: '인증 방식', value: formatMethodLabel(primaryConfig) },
          {
            label: '인증시간',
            value: buildAuthTime(primaryConfig),
            multiline: true,
          },
        ]
      : [{ label: '인증 방식', value: '-' }]),
    ...(secondaryConfig
      ? [
          { label: '인증 방식 2', value: formatMethodLabel(secondaryConfig) },
          {
            label: '인증시간',
            value: buildAuthTime(secondaryConfig),
            multiline: true,
          },
        ]
      : []),
    { label: '인증 요일', value: weekdayText },
    { label: '기간', value: `${formatDate(startDate)} - ${formatDate(endDate)}` },
    { label: '인원', value: `${members}명` },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <CreateStudyHeader title="스터디 그룹 생성" onClose={onClose} />
      <View style={styles.content}>
        <ResultHeader imageUri={imageUri} />
        <StudySummaryCard rows={rows} onEdit={onClose} />
      </View>
      <View style={styles.bottom}>
        <PrimaryActionButton label="확인" onPress={onConfirm} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingTop: 4,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 26,
  },
});

export default CreateStudyGroupResultScreen;
