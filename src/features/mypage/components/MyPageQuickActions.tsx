import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';

const historyIcon = require('../../../assets/icon/bill_icon.png');
const shopIcon = require('../../../assets/icon/shop_icon.png');
const exchangeIcon = require('../../../assets/icon/exchange_icon.png');

type MyPageQuickActionsProps = {
  onPressHistory?: () => void;
  onPressShop?: () => void;
  onPressExchange?: () => void;
};

const actions = [
  { label: '내역', icon: historyIcon, width: 22, height: 26, key: 'history' },
  { label: '상점', icon: shopIcon, width: 30, height: 28, key: 'shop' },
  { label: '환전', icon: exchangeIcon, width: 26, height: 26, key: 'exchange' },
] as const;

function MyPageQuickActions({
  onPressHistory,
  onPressShop,
  onPressExchange,
}: MyPageQuickActionsProps) {
  const handlers = {
    history: onPressHistory,
    shop: onPressShop,
    exchange: onPressExchange,
  };

  return (
    <View style={styles.container}>
      {actions.map((action, index) => (
        <Pressable
          key={action.label}
          style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
          onPress={handlers[action.key]}
        >
          {({ pressed }) => (
            <>
              <Image
                source={action.icon}
                style={[
                  styles.icon,
                  { width: action.width, height: action.height },
                  pressed && styles.iconPressed,
                ]}
              />
              <Text style={[styles.label, pressed && styles.labelPressed]}>
                {action.label}
              </Text>
              {index < actions.length - 1 && <View style={styles.divider} />}
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 18,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 6,
    
  },
  item: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  itemPressed: {
    backgroundColor: '#F1FEF6',
    borderRadius: 8,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#8F8F8F',
    marginBottom: 15,
    
  },
  iconPressed: {
    tintColor: colors.primary,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: "#7F7F7F",
  },
  labelPressed: {
    color: colors.primary,
  },
  divider: {
    position: 'absolute',
    right: 0,
    top: 15,
    bottom: 15,
    width: 1,
    backgroundColor: '#E3E3E3',
  },
});

export default MyPageQuickActions;
