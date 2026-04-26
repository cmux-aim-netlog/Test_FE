import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors } from '../../../styles/colors';
import CategorySection from '../components/CategorySection';
import AuthMethodSection, {
  type AuthMethod,
  type MethodConfig,
} from '../components/AuthMethodSection';
import AuthDetailSection from '../components/AuthDetailSection';
import SecondaryAuthMethodSection from '../components/SecondaryAuthMethodSection';
import CreateStudyHeader from '../components/CreateStudyHeader';
import GroupNameSection from '../components/GroupNameSection';
import AuthTimeControls from '../components/AuthTimeControls';
import TimePickerModal from '../components/TimePickerModal';
import StudyThumbnailPicker from '../components/StudyThumbnailPicker';
import StudyTextField from '../components/StudyTextField';
import MemberCounter from '../components/MemberCounter';
import WeekdayPicker from '../components/WeekdayPicker';
import PeriodPicker from '../components/PeriodPicker';
import PrimaryActionButton from '../components/PrimaryActionButton';
import DatePickerModal from '../components/DatePickerModal';
import CreateStudyGroupResultScreen from './CreateStudyGroupResultScreen';
import { createStudyGroup, updateStudyGroup } from '../../../api/studyGroups';
import type { StudyGroupDetailRes } from '../../../api/studyGroups';
import { buildStudyGroupCreatePayload } from '../../../api/studyGroupCreate';

type CreateStudyGroupScreenProps = {
  onClose: () => void;
  onComplete?: () => void;
  mode?: 'create' | 'edit';
  groupId?: string;
  initialData?: StudyGroupDetailRes;
};

const categories = ['코딩 테스트', '자격증', '언어', '기상', '착석', '기타'];
const authMethods: AuthMethod[] = ['사진', '위치', 'TODO', 'GitHub'];

const createTime = (hours: number, minutes = 0) => {
  const base = new Date();
  const next = new Date(base);
  next.setHours(hours, minutes, 0, 0);
  return next;
};

const CATEGORY_REVERSE: Record<string, string> = {
  WAKE: '기상',
  SEATED: '착석',
  COTE: '코딩 테스트',
  LANG: '언어',
  CERT: '자격증',
  ETC: '기타',
};
const METHOD_REVERSE: Record<string, AuthMethod> = {
  PHOTO: '사진',
  GPS: '위치',
  CHECKLIST: 'TODO',
  GITHUB: 'GitHub',
};
const DAY_REVERSE: Record<string, string> = {
  MON: '월',
  TUE: '화',
  WED: '수',
  THU: '목',
  FRI: '금',
  SAT: '토',
  SUN: '일',
};

function parseTimeToDate(timeStr: string): Date {
  const [h, m] = timeStr.split(':').map(Number);
  return createTime(h ?? 0, m ?? 0);
}

function detailToInitialState(d: StudyGroupDetailRes): {
  name: string;
  description: string;
  activeCategory: string;
  primaryConfig: MethodConfig | null;
  secondaryConfig: MethodConfig | null;
  members: number;
  days: string[];
  startDate: Date;
  endDate: Date;
  thumbnailUri: string | null;
} {
  const r0 = d.verificationRules?.[0];
  const r1 = d.verificationRules?.[1];
  const method0 = r0 ? (METHOD_REVERSE[r0.methodCode] ?? 'TODO') : 'TODO';
  const method1 = r1 ? (METHOD_REVERSE[r1.methodCode] ?? '사진') : '사진';
  const days =
    r0?.daysOfWeek?.map((day) => DAY_REVERSE[day] ?? day).filter(Boolean) ?? ['월', '화'];
  const endTime0 = r0?.endTime ? parseTimeToDate(r0.endTime) : createTime(10, 0);
  const checkTime0 =
    r0?.methodCode === 'CHECKLIST' && r0?.checkEndTime
      ? parseTimeToDate(r0.checkEndTime)
      : createTime(22, 0);
  const endTime1 = r1?.endTime ? parseTimeToDate(r1.endTime) : createTime(10, 0);
  const startDate = d.startDate
    ? (() => {
        const [y, m, day] = d.startDate.split('-').map(Number);
        return new Date(y ?? 2026, (m ?? 1) - 1, day ?? 1);
      })()
    : new Date(2026, 1, 4);
  const endDate = d.endDate
    ? (() => {
        const [y, m, day] = d.endDate.split('-').map(Number);
        return new Date(y ?? 2026, (m ?? 1) - 1, day ?? 1);
      })()
    : new Date(2026, 2, 4);

  return {
    name: d.title ?? '',
    description: d.description ?? '',
    activeCategory: CATEGORY_REVERSE[d.category] ?? '기타',
    primaryConfig: r0
      ? {
          method: method0,
          todoDeadline: method0 === 'TODO' ? endTime0 : createTime(10, 0),
          todoComplete: method0 === 'TODO' ? checkTime0 : createTime(22, 0),
          rangeStart: method0 !== 'TODO' ? endTime0 : createTime(10, 0),
          rangeEnd: method0 !== 'TODO' ? endTime0 : createTime(22, 0),
          locationType: '공통 위치',
          locationName: '',
        }
      : createDefaultConfig('TODO'),
    secondaryConfig: r1 ? createDefaultConfig(method1) : null,
    members: d.maxMembers ?? 2,
    days: days.length > 0 ? days : ['화', '목'],
    startDate,
    endDate,
    thumbnailUri: d.thumbnailType === 'UPLOAD' && d.thumbnailUrl ? d.thumbnailUrl : null,
  };
}

const formatTime = (value: Date) => {
  const hours = value.getHours().toString().padStart(2, '0');
  const minutes = value.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const createDefaultConfig = (method: AuthMethod): MethodConfig => ({
  method,
  todoDeadline: createTime(10, 0),
  todoComplete: createTime(22, 0),
  rangeStart: createTime(10, 0),
  rangeEnd: createTime(22, 0),
  locationType: '공통 위치',
  locationName: '',
});

function CreateStudyGroupScreen({
  onClose,
  onComplete,
  mode = 'create',
  groupId,
  initialData,
}: CreateStudyGroupScreenProps) {
  const isEdit = mode === 'edit' && groupId;
  const currentMembers = initialData?.currentMembers ?? 0;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('착석');
  const [primaryConfig, setPrimaryConfig] = useState<MethodConfig | null>(
    createDefaultConfig('TODO'),
  );
  const [secondaryConfig, setSecondaryConfig] = useState<MethodConfig | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [members, setMembers] = useState(2);
  const [days, setDays] = useState(['화', '목']);
  const [startDate, setStartDate] = useState(new Date(2026, 1, 4));
  const [endDate, setEndDate] = useState(new Date(2026, 2, 4));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDateField, setActiveDateField] = useState<'start' | 'end'>('start');
  const [tempDate, setTempDate] = useState(new Date(2026, 1, 4));
  const [tempTime, setTempTime] = useState(createTime(10, 0));
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState<number | null>(null);
  const [activeTimeField, setActiveTimeField] = useState<
    'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd'
  >('todoDeadline');
  const [activeConfigKey, setActiveConfigKey] = useState<'primary' | 'secondary'>('primary');

  React.useEffect(() => {
    if (initialData) {
      const init = detailToInitialState(initialData);
      setName(init.name);
      setDescription(init.description);
      setActiveCategory(init.activeCategory);
      setPrimaryConfig(init.primaryConfig);
      setSecondaryConfig(init.secondaryConfig);
      setMembers(init.members);
      setDays(init.days);
      setStartDate(init.startDate);
      setEndDate(init.endDate);
      setThumbnailUri(init.thumbnailUri);
    }
  }, [initialData]);

  const nameCount = useMemo(() => name.length, [name]);
  const membersBelowCurrent = isEdit && members < currentMembers;
  const timeTitle =
    activeTimeField === 'todoDeadline'
      ? '작성마감 시간'
      : activeTimeField === 'todoComplete'
        ? '완료시간'
        : activeTimeField === 'rangeStart'
          ? '인증시간'
          : '종료시간';

  const selectedConfig = activeConfigKey === 'primary' ? primaryConfig : secondaryConfig;
  const selectedTime =
    selectedConfig?.[activeTimeField] ??
    createTime(10, 0);

  const formatDate = (value: Date) =>
    `${value.getFullYear()}. ${value.getMonth() + 1}. ${value.getDate()}.`;

  const selectedDate = activeDateField === 'start' ? startDate : endDate;

  const openDatePicker = (field: 'start' | 'end') => {
    setActiveDateField(field);
    setTempDate(field === 'start' ? startDate : endDate);
    setShowDatePicker(true);
  };

  const handleDateChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      return;
    }
    if (Platform.OS === 'android') {
      if (activeDateField === 'start') {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      setShowDatePicker(false);
      return;
    }
    setTempDate(date);
  };

  const applyDate = () => {
    if (activeDateField === 'start') {
      setStartDate(tempDate);
    } else {
      setEndDate(tempDate);
    }
    setShowDatePicker(false);
  };

  const handleConfirm = () => {
    setShowResult(false);
    setCreatedGroupId(null);
    setTimeout(() => {
      if (onComplete) {
        onComplete();
        return;
      }
      onClose();
    }, 300);
  };

  const handleSubmitComplete = async () => {
    if (!primaryConfig) {
      Alert.alert('안내', '인증 방식을 하나 이상 선택해주세요.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('안내', '스터디 이름을 입력해주세요.');
      return;
    }
    if (days.length === 0) {
      Alert.alert('안내', '인증 요일을 하나 이상 선택해주세요.');
      return;
    }
    if (isEdit && members < currentMembers) {
      Alert.alert('안내', '현재 스터디 그룹 인원보다 작게 설정할 수 없습니다.');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = buildStudyGroupCreatePayload({
        title: name,
        description,
        activeCategory,
        thumbnailUri,
        members,
        days,
        startDate,
        endDate,
        primaryConfig,
        secondaryConfig,
      });
      if (isEdit && groupId) {
        const updatePayload = {
          title: payload.title,
          description: payload.description,
          thumbnailType: payload.thumbnailType,
          thumbnailUrl: payload.thumbnailUrl,
          category: payload.category,
          joinType: payload.joinType,
          minMembers: payload.minMembers,
          maxMembers: payload.maxMembers,
          period: payload.period,
          hashtags: payload.hashtags,
        };
        const { data } = await updateStudyGroup(groupId, updatePayload);
        const res = data as { isSuccess?: boolean; success?: boolean; message?: string } | undefined;
        const ok = res && (res.success === true || res.isSuccess === true);
        if (ok) {
          Alert.alert('수정 완료', '스터디 그룹 정보가 수정되었습니다.', [
            { text: '확인', onPress: () => (onComplete ? onComplete() : onClose()) },
          ]);
        } else {
          Alert.alert('수정 실패', res?.message ?? '스터디 그룹 수정에 실패했습니다.');
        }
      } else {
        const { data } = await createStudyGroup(payload);
        const ok = data && ((data as { success?: boolean; isSuccess?: boolean }).success === true || data.isSuccess === true);
        if (ok && data?.data?.groupId != null) {
          setCreatedGroupId(data.data.groupId);
          setShowResult(true);
        } else {
          Alert.alert('생성 실패', data?.message ?? '스터디 그룹 생성에 실패했습니다.');
        }
      }
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : null;
      Alert.alert(
        '오류',
        message ?? '서버에 연결할 수 없습니다. X-User-Id 설정 및 네트워크를 확인해주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const openTimePicker = (
    field: 'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd',
    configKey: 'primary' | 'secondary',
  ) => {
    const config = configKey === 'primary' ? primaryConfig : secondaryConfig;
    if (!config) {
      return;
    }
    setActiveConfigKey(configKey);
    setActiveTimeField(field);
    setTempTime(config[field]);
    setShowTimePicker(true);
  };

  const handleTimeChange = (_event: DateTimePickerEvent, date?: Date) => {
    if (!date) {
      return;
    }
    if (Platform.OS === 'android') {
      const updater =
        activeConfigKey === 'primary' ? setPrimaryConfig : setSecondaryConfig;
      updater((prev) => (prev ? { ...prev, [activeTimeField]: date } : prev));
      setShowTimePicker(false);
      return;
    }
    setTempTime(date);
  };

  const applyTime = () => {
    const updater = activeConfigKey === 'primary' ? setPrimaryConfig : setSecondaryConfig;
    updater((prev) => (prev ? { ...prev, [activeTimeField]: tempTime } : prev));
    setShowTimePicker(false);
  };

  const setConfigMethod = (key: 'primary' | 'secondary', method: AuthMethod) => {
    if (key === 'primary') {
      setPrimaryConfig((prev) => {
        if (!prev) {
          return createDefaultConfig(method);
        }
        if (prev.method === method) {
          setSecondaryConfig(null);
          return null;
        }
        return { ...prev, method };
      });
      if (secondaryConfig?.method === method) {
        setSecondaryConfig(null);
      }
      return;
    }
    setSecondaryConfig((prev) => (prev ? { ...prev, method } : prev));
  };

  const addSecondary = () => {
    if (secondaryConfig || !primaryConfig) {
      return;
    }
    const fallback = authMethods.find((method) => method !== primaryConfig.method) ?? '사진';
    setSecondaryConfig(createDefaultConfig(fallback));
  };

  const renderTimeControls = (config: MethodConfig, configKey: 'primary' | 'secondary') => (
    <AuthTimeControls
      config={config}
      configKey={configKey}
      formatTime={formatTime}
      onOpenTimePicker={openTimePicker}
      onLocationTypeChange={(key, type) =>
        key === 'primary'
          ? setPrimaryConfig((prev) => (prev ? { ...prev, locationType: type } : prev))
          : setSecondaryConfig((prev) => (prev ? { ...prev, locationType: type } : prev))
      }
      onLocationNameChange={(key, text) =>
        key === 'primary'
          ? setPrimaryConfig((prev) => (prev ? { ...prev, locationName: text } : prev))
          : setSecondaryConfig((prev) => (prev ? { ...prev, locationName: text } : prev))
      }
    />
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CreateStudyHeader
          title={isEdit ? '스터디 그룹 수정' : '스터디 그룹 생성'}
          onClose={onClose}
        />

        <View style={styles.profileRow}>
          <StudyThumbnailPicker compact imageUri={thumbnailUri} onChangeImage={setThumbnailUri} />
        </View>

        <GroupNameSection value={name} count={nameCount} maxLength={20} onChange={setName} />

        <StudyTextField
          value={description}
          onChange={setDescription}
          placeholder="소개글을 입력해주세요."
          containerStyle={styles.descriptionField}
          inputStyle={styles.profileDescInput}
          multiline
          numberOfLines={5}
          boxed
        />

        <CategorySection
          categories={categories}
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
        />

        <MemberCounter
          value={members}
          onChange={setMembers}
          min={isEdit ? currentMembers : 2}
          max={50}
        />
        {membersBelowCurrent && (
          <Text style={styles.membersError}>
            현재 스터디 그룹 인원보다 작게 설정할 수 없습니다
          </Text>
        )}

        <AuthMethodSection
          methods={authMethods}
          primaryConfig={primaryConfig}
          secondaryConfig={secondaryConfig}
          onSelectPrimary={(method) => setConfigMethod('primary', method)}
          onAddSecondary={addSecondary}
          onRemoveSecondary={() => setSecondaryConfig(null)}
        />

        {primaryConfig ? (
          <AuthDetailSection
            title={primaryConfig.method === '위치' ? '인증 위치' : '인증 시간'}
            config={primaryConfig}
            configKey="primary"
            renderControls={renderTimeControls}
          />
        ) : null}

        {primaryConfig && secondaryConfig ? (
          <>
            <SecondaryAuthMethodSection
              methods={authMethods}
              primaryConfig={primaryConfig}
              secondaryConfig={secondaryConfig}
              onSelectSecondary={(method) => setConfigMethod('secondary', method)}
            />
            <AuthDetailSection
              title={secondaryConfig.method === '위치' ? '인증 위치' : '인증 시간'}
              config={secondaryConfig}
              configKey="secondary"
              renderControls={renderTimeControls}
            />
          </>
        ) : null}

        <WeekdayPicker value={days} onChange={setDays} />
        <PeriodPicker
          startDate={formatDate(startDate)}
          endDate={formatDate(endDate)}
          onPressStart={() => openDatePicker('start')}
          onPressEnd={() => openDatePicker('end')}
        />
      </ScrollView>

      <View style={styles.bottom}>
        <PrimaryActionButton
          label={
            isSubmitting
              ? isEdit
                ? '수정 중…'
                : '생성 중…'
              : '완료'
          }
          onPress={handleSubmitComplete}
          disabled={isSubmitting || Boolean(membersBelowCurrent)}
        />
        {isSubmitting ? (
          <View style={styles.loaderWrap}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : null}
      </View>

      <TimePickerModal
        visible={showTimePicker}
        title={timeTitle}
        selectedTime={selectedTime}
        tempTime={tempTime}
        onChange={handleTimeChange}
        onApply={applyTime}
        onClose={() => setShowTimePicker(false)}
      />

      <DatePickerModal
        visible={showDatePicker}
        title={activeDateField === 'start' ? '시작일' : '종료일'}
        selectedDate={selectedDate}
        tempDate={tempDate}
        onChange={handleDateChange}
        onApply={applyDate}
        onClose={() => setShowDatePicker(false)}
      />

      <Modal
        visible={showResult}
        animationType="slide"
        onRequestClose={() => setShowResult(false)}
      >
        <CreateStudyGroupResultScreen
          onClose={() => setShowResult(false)}
          onConfirm={handleConfirm}
          category={activeCategory}
          primaryConfig={primaryConfig}
          secondaryConfig={secondaryConfig}
          members={members}
          startDate={startDate}
          endDate={endDate}
          days={days}
          imageUri={thumbnailUri}
          createdGroupId={createdGroupId}
        />
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 28,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 26,
  },
  loaderWrap: {
    marginTop: 8,
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 28,
    paddingTop: 18,
    paddingBottom: 6,
  },
  profileField: {
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  descriptionField: {
    paddingHorizontal: 28,
    paddingTop: 6,
  },
  profileTitleInput: {
    fontSize: 18,
    fontWeight: '800',
  },
  profileDescInput: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  membersError: {
    fontSize: 13,
    fontWeight: '600',
    color: '#E53935',
    paddingHorizontal: 28,
    marginTop: -8,
    marginBottom: 8,
  },
});

export default CreateStudyGroupScreen;
