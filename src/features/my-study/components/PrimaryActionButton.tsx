import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../../../styles/colors';

type PrimaryActionButtonProps = {
  label: string;
  onPress: () => void | Promise<void>;
  disabled?: boolean;
};

function PrimaryActionButton({ label, onPress, disabled }: PrimaryActionButtonProps) {
  return (
    <Pressable
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.textDisabled]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  textDisabled: {
    color: 'rgba(255,255,255,0.8)',
  },
});

export default PrimaryActionButton;
