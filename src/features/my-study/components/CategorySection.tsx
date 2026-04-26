import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

type CategorySectionProps = {
  categories: string[];
  activeCategory: string;
  onSelect: (category: string) => void;
};

function CategorySection({ categories, activeCategory, onSelect }: CategorySectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>카테고리</Text>
      <View style={styles.chipRow}>
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => onSelect(category)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category}
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

export default CategorySection;
