import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

type PointsShopItemCardProps = {
  label: string;
  priceLabel: string;
  iconSource: ImageSourcePropType;
  iconSize?: {
    width: number;
    height: number;
  };
};

function PointsShopItemCard({
  label,
  priceLabel,
  iconSource,
  iconSize,
}: PointsShopItemCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.ticketIconFrame}>
        <Image source={iconSource} style={[styles.ticketIcon, iconSize]} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pricePill}>
        <Text style={styles.priceText}>{priceLabel}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '31%',
    backgroundColor: '#EDEDED',
    borderRadius: 13,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketIconFrame: {
    width: 70,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  ticketIcon: {
    resizeMode: 'contain',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#444444',
    marginBottom: 8,
  },
  pricePill: {
    backgroundColor: '#2F2F2F',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default PointsShopItemCard;
