import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { type MethodConfig } from './AuthMethodSection';

type TimeField = 'todoDeadline' | 'todoComplete' | 'rangeStart' | 'rangeEnd';
type ConfigKey = 'primary' | 'secondary';

type AuthTimeControlsProps = {
  config: MethodConfig;
  configKey: ConfigKey;
  formatTime: (value: Date) => string;
  onOpenTimePicker: (field: TimeField, key: ConfigKey) => void;
  onLocationTypeChange: (key: ConfigKey, type: '개인 위치' | '공통 위치') => void;
  onLocationNameChange: (key: ConfigKey, name: string) => void;
};

function AuthTimeControls({
  config,
  configKey,
  formatTime,
  onOpenTimePicker,
  onLocationTypeChange,
  onLocationNameChange,
}: AuthTimeControlsProps) {
  if (config.method === 'TODO') {
    return (
      <View style={styles.timeRow}>
        <View style={styles.timeGroup}>
          <Text style={styles.timeLabel}>작성마감</Text>
          <Pressable
            style={styles.timeChip}
            onPress={() => onOpenTimePicker('todoDeadline', configKey)}
          >
            <Text style={styles.timeText}>{formatTime(config.todoDeadline)}</Text>
          </Pressable>
        </View>
        <View style={styles.timeGroup}>
          <Text style={styles.timeLabel}>완료시간</Text>
          <Pressable
            style={styles.timeChip}
            onPress={() => onOpenTimePicker('todoComplete', configKey)}
          >
            <Text style={styles.timeText}>{formatTime(config.todoComplete)}</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (config.method === '위치') {
    return (
      <View style={styles.locationWrap}>
        <View style={styles.locationRow}>
          {(['개인 위치', '공통 위치'] as const).map((type) => {
            const isActive = config.locationType === type;
            return (
              <Pressable
                key={type}
                onPress={() => onLocationTypeChange(configKey, type)}
                style={[styles.locationChip, isActive && styles.locationChipActive]}
              >
                <Text
                  style={[styles.locationChipText, isActive && styles.locationChipTextActive]}
                >
                  {type}
                </Text>
              </Pressable>
            );
          })}
        </View>
        {config.locationType === '공통 위치' ? (
          <View style={styles.locationInputWrap}>
            <TextInput
              value={config.locationName}
              onChangeText={(text) => onLocationNameChange(configKey, text)}
              placeholder="예) ○○도서관"
              placeholderTextColor="#B0B0B0"
              style={styles.locationInput}
            />
          </View>
        ) : null}
        <View style={styles.timeRow}>
          <View style={styles.timeGroup}>
            <Text style={styles.timeLabel}>마감 시간</Text>
            <Pressable
              style={styles.timeChip}
              onPress={() => onOpenTimePicker('rangeEnd', configKey)}
            >
              <Text style={styles.timeText}>{formatTime(config.rangeEnd)}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.timeRow}>
      <View style={styles.timeGroup}>
        <Text style={styles.timeLabel}>마감 시간</Text>
        <Pressable
          style={styles.timeChip}
          onPress={() => onOpenTimePicker('rangeEnd', configKey)}
        >
          <Text style={styles.timeText}>{formatTime(config.rangeEnd)}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14,
    marginTop: 10,
    alignItems: 'center',
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeLabel: {
    fontSize: 11,
    color: '#9B9B9B',
    fontWeight: '700',
  },
  timeChip: {
    backgroundColor: '#EFEFEF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  timeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationWrap: {
    marginTop: 6,
    gap: 12,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 12,
  },
  locationChip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  locationChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  locationChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  locationChipTextActive: {
    color: '#FFFFFF',
  },
  locationInputWrap: {
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 2,
  },
  locationInput: {
    fontSize: 14,
    color: colors.textPrimary,
    paddingVertical: 4,
  },
});

export default AuthTimeControls;
