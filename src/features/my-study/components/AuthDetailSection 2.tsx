import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { type MethodConfig } from './AuthMethodSection';

type AuthDetailSectionProps = {
  primaryConfig: MethodConfig | null;
  secondaryConfig: MethodConfig | null;
  renderControls: (config: MethodConfig, key: 'primary' | 'secondary') => React.ReactNode;
};

function AuthDetailSection({
  primaryConfig,
  secondaryConfig,
  renderControls,
}: AuthDetailSectionProps) {
  if (!primaryConfig) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {primaryConfig.method === '위치' ? '인증 위치' : '인증 시간'}
      </Text>
      {renderControls(primaryConfig, 'primary')}

      {secondaryConfig ? (
        <View style={styles.secondaryBlock}>
          <Text style={styles.sectionTitle}>
            {secondaryConfig.method === '위치' ? '인증 위치' : '인증 시간'}
          </Text>
          {renderControls(secondaryConfig, 'secondary')}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  secondaryBlock: {
    marginTop: 16,
    gap: 12,
  },
});

export default AuthDetailSection;
