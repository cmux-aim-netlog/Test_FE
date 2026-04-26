import React, { useMemo, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors } from '../../../styles/colors';

const backIcon = require('../../../assets/icon/left_arrow.png');
const closeIcon = require('../../../assets/icon/x_icon.png');

const formatPoints = (value: number) => value.toLocaleString('en-US');

type PointsExchangeFlowModalProps = {
  visible: boolean;
  onClose: () => void;
};

function PointsExchangeFlowModal({ visible, onClose }: PointsExchangeFlowModalProps) {
  const [step, setStep] = useState<'input' | 'confirm'>('input');
  const [amountDigits, setAmountDigits] = useState('');

  const amountValue = useMemo(
    () => (amountDigits ? parseInt(amountDigits, 10) : 0),
    [amountDigits],
  );

  const amountLabel = amountValue ? `${formatPoints(amountValue)}P` : '';

  const handleAppend = (value: string) => {
    if (amountDigits.length >= 9) {
      return;
    }
    setAmountDigits((prev) => (prev === '0' ? value : `${prev}${value}`));
  };

  const handleBackspace = () => {
    setAmountDigits((prev) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setAmountDigits('');
    setStep('input');
    onClose();
  };

  const keypad = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '00', '0', 'back'];

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleReset}>
      <SafeAreaView style={styles.modalRoot}>
        {step === 'input' ? (
          <View style={styles.screen}>
            <View style={styles.header}>
              <Pressable onPress={handleReset} style={styles.iconButton}>
                <Image source={backIcon} style={styles.headerIcon} />
              </Pressable>
              <Text style={styles.headerTitle}>포인트 환전</Text>
            </View>

            <View style={styles.contentArea}>
              <View style={styles.accountSection}>
                <Text style={styles.sectionTitle}>LDK 포인트 지갑에서</Text>
                <Text style={styles.sectionTitle}>내 계좌로</Text>
                <Text style={styles.sectionSub}>신한은행 1234-1231-1231-4234</Text>
              </View>

              <View style={styles.amountSection}>
                {amountValue ? (
                  <Text style={styles.amountText}>{amountLabel}</Text>
                ) : (
                  <>
                    <Text style={styles.placeholderText}>얼마를 환전할까요?</Text>
                    <Text style={styles.balanceText}>잔액 10,000P</Text>
                  </>
                )}
              </View>

              <View style={styles.keypad}>
                {keypad.map((key) => (
                  <Pressable
                    key={key}
                    style={styles.keypadButton}
                    onPress={() => {
                      if (key === 'back') {
                        handleBackspace();
                      } else {
                        handleAppend(key);
                      }
                    }}
                  >
                    <Text style={styles.keypadText}>{key === 'back' ? '←' : key}</Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.bottomArea}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => setStep('confirm')}
              >
                <Text style={styles.primaryButtonText}>다음</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={styles.screen}>
            <View style={styles.header}>
              <Pressable onPress={handleReset} style={styles.iconButton}>
                <Image source={closeIcon} style={styles.closeIcon} />
              </Pressable>
            </View>

            <View style={styles.confirmSection}>
              <Text style={styles.confirmBank}>신한은행</Text>
              <Text style={styles.confirmAccount}>1234-1231-1231-4234로</Text>
              <Text style={styles.confirmAmount}>{amountLabel || '0P'}</Text>
              <Text style={styles.confirmQuestion}>환전 하시겠습니까?</Text>
            </View>

            <View style={styles.confirmFooter}>
              <View style={styles.receiverRow}>
                <Text style={styles.receiverLabel}>받는 분에게 표시</Text>
                <Text style={styles.receiverValue}>LDK</Text>
              </View>
              <View style={styles.confirmButtons}>
                <Pressable style={styles.cancelButton} onPress={handleReset}>
                  <Text style={styles.cancelButtonText}>취소</Text>
                </Pressable>
                <Pressable style={styles.primaryButtonInline}>
                  <Text style={styles.primaryButtonText}>환전하기</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2A2A2A',
  },
  iconButton: {
    padding: 6,
    marginRight: 6,
  },
  headerIcon: {
    width: 8,
    height: 16,
    tintColor: '#B8B8B8',
  },
  closeIcon: {
    width: 16,
    height: 16,
    tintColor: '#B8B8B8',
  },
  contentArea: {
    flex: 1,
  },
  accountSection: {
    marginTop: 40,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 12,
  },
  sectionSub: {
    fontSize: 15,
    color: '#9B9B9B',
  },
  amountSection: {
    marginTop: 40,
    minHeight: 80,
  },
  placeholderText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#D9D9D9',
    marginBottom:15,
  },
  balanceText: {
    fontSize: 14,
    color: '#D9D9D9',
  },
  amountText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2A2A2A',
  },
  keypad: {
    marginTop: 100,
    marginBottom: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  keypadButton: {
    width: '30%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  keypadText: {
    fontSize: 28,
    color: '#2A2A2A',
    fontWeight: '400',
  },
  bottomArea: {
    paddingBottom: 24,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  confirmSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBank: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 10,
  },
  confirmAccount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2A2A2A',
    marginBottom: 30,
  },
  confirmAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 18,
  },
  confirmQuestion: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3B3B3B',
  },
  confirmFooter: {
    paddingBottom: 24,
  },
  receiverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  receiverLabel: {
    fontSize: 15,
    color: '#898989',
  },
  receiverValue: {
    fontSize: 15,
    color: '#898989',
  },
  confirmButtons: {
    flexDirection: 'row',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#DADADA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#4B4B4B',
    fontSize: 20,
    fontWeight: '700',
  },
  primaryButtonInline: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
});

export default PointsExchangeFlowModal;
