import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { type MethodConfig } from './AuthMethodSection';

type AuthDetailSectionProps = {
  title: string;
  config: MethodConfig;
  configKey: 'primary' | 'secondary';
  renderControls: (config: MethodConfig, key: 'primary' | 'secondary') => React.ReactNode;
};

function AuthDetailSection({
  title,
  config,
  configKey,
  renderControls,
}: AuthDetailSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {renderControls(config, configKey)}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 28,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
});

export default AuthDetailSection;
