import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors } from '../../../styles/colors';

type StudyTextFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  containerStyle?: object;
  inputStyle?: object;
  multiline?: boolean;
  numberOfLines?: number;
  boxed?: boolean;
};

function StudyTextField({
  value,
  onChange,
  placeholder,
  containerStyle,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
  boxed = false,
}: StudyTextFieldProps) {
  return (
    <View style={[styles.section, containerStyle]}>
      <View style={[styles.inputWrap, boxed && styles.inputWrapBoxed]}>
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="#B0B0B0"
          style={[
            styles.input,
            boxed && styles.inputBoxed,
            inputStyle,
          ]}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    paddingHorizontal: 28,
    paddingTop: 6,
  },
  inputWrap: {
    borderBottomWidth: 1,
    borderBottomColor: '#F4F4F4',
    paddingBottom: 6,
    position: 'relative',
  },
  inputWrapBoxed: {
    borderBottomWidth: 0,
    backgroundColor: '#F4F4F4',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textPrimary,
    paddingVertical: 6,
  },
  inputBoxed: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    minHeight: 120,
  },
});

export default StudyTextField;
