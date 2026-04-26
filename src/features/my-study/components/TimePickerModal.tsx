import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors } from '../../../styles/colors';

type TimePickerModalProps = {
  visible: boolean;
  title: string;
  selectedTime: Date;
  tempTime: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onApply: () => void;
  onClose: () => void;
};

function TimePickerModal({
  visible,
  title,
  selectedTime,
  tempTime,
  onChange,
  onApply,
  onClose,
}: TimePickerModalProps) {
  if (Platform.OS === 'android') {
    return visible ? (
      <DateTimePicker
        value={selectedTime}
        mode="time"
        display="spinner"
        onChange={onChange}
        minuteInterval={5}
      />
    ) : null;
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable onPress={onApply}>
              <Text style={styles.modalDone}>완료</Text>
            </Pressable>
          </View>
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="spinner"
            onChange={onChange}
            minuteInterval={5}
            locale="ko-KR"
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: '55%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalDone: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default TimePickerModal;
