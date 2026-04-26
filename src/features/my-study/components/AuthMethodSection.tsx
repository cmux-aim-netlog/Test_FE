import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

export type AuthMethod = '사진' | '위치' | 'TODO' | 'GitHub';

export type MethodConfig = {
  method: AuthMethod;
  todoDeadline: Date;
  todoComplete: Date;
  rangeStart: Date;
  rangeEnd: Date;
  locationType: '개인 위치' | '공통 위치';
  locationName: string;
};

type AuthMethodSectionProps = {
  methods: AuthMethod[];
  primaryConfig: MethodConfig | null;
  secondaryConfig: MethodConfig | null;
  onSelectPrimary: (method: AuthMethod) => void;
  onAddSecondary: () => void;
  onRemoveSecondary: () => void;
};

function AuthMethodSection({
  methods,
  primaryConfig,
  secondaryConfig,
  onSelectPrimary,
  onAddSecondary,
  onRemoveSecondary,
}: AuthMethodSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>인증 방식</Text>
        <View style={styles.actionRow}>
          <Pressable
            style={[
              styles.actionButton,
              (!primaryConfig || secondaryConfig) && styles.actionButtonDisabled,
            ]}
            onPress={onAddSecondary}
            disabled={!primaryConfig || Boolean(secondaryConfig)}
          >
            <Text style={styles.actionText}>+</Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionButton,
              !secondaryConfig && styles.actionButtonDisabled,
            ]}
            onPress={onRemoveSecondary}
            disabled={!secondaryConfig}
          >
            <Text style={styles.actionText}>-</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.chipRow}>
        {methods.map((method) => {
          const isActive = primaryConfig?.method === method;
          return (
            <Pressable
              key={method}
              onPress={() => onSelectPrimary(method)}
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
    paddingTop: 20,
    marginTop: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 14,
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
  actionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.4,
  },
  actionText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default AuthMethodSection;
