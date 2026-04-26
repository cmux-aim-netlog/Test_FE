import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const editIcon = require('../../../assets/icon/modify_icon.png');
const deleteIcon = require('../../../assets/icon/delete.png');

type PointsExchangeAccountCardProps = {
  title: string;
  bankName: string;
  accountNumber: string;
  active?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
};

function PointsExchangeAccountCard({
  title,
  bankName,
  accountNumber,
  active,
  onEdit,
  onDelete,
}: PointsExchangeAccountCardProps) {
  return (
    <View style={[styles.card, active && styles.cardActive]}>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.bank}>{bankName}</Text>
        <Text style={styles.account}>{accountNumber}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.iconButton}>
          <Image source={editIcon} style={styles.icon} />
        </Pressable>
        <Pressable onPress={onDelete} style={styles.iconButton}>
          <Image source={deleteIcon} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
  
    backgroundColor: '#D8FFE7',
    paddingVertical: 25,
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardActive: {
    backgroundColor: '#D8FFE7',
    borderColor: '#D8FFE7',
  },
  textBlock: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 8,
  },
  bank: {
    fontSize: 15,
    color: '#6A6A6A',
    marginBottom: 6,
  },
  account: {
    fontSize: 15,
    color: '#6A6A6A',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
  },
  icon: {
    width: 13,
    height: 15,
    tintColor: "#7D7D7D",
  },
});

export default PointsExchangeAccountCard;
