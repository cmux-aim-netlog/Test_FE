import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { type AuthMethod, type MethodConfig } from './AuthMethodSection';

type SecondaryAuthMethodSectionProps = {
  methods: AuthMethod[];
  primaryConfig: MethodConfig;
  secondaryConfig: MethodConfig;
  onSelectSecondary: (method: AuthMethod) => void;
};

function SecondaryAuthMethodSection({
  methods,
  primaryConfig,
  secondaryConfig,
  onSelectSecondary,
}: SecondaryAuthMethodSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>인증 방식 2</Text>
      <View style={styles.chipRow}>
        {methods
          .filter((method) => method !== primaryConfig.method)
          .map((method) => {
            const isActive = secondaryConfig.method === method;
            return (
              <Pressable
                key={method}
                onPress={() => onSelectSecondary(method)}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {method}
                </Text>
              </Pressable>
            );
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 22,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 6,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: '#FFFFFF',
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
});

export default SecondaryAuthMethodSection;
