import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../../styles/colors';
import { setAuthSession } from '../../../api/client';
import {
  configureGoogleSignIn,
  formatGoogleSignInError,
  signInWithGoogle,
} from '../googleSignIn';

const loginLogoSource = require('../../../assets/checkmate_logo1.png');

type LoginScreenProps = {
  onLogin?: () => void;
};

function LoginScreen({ onLogin }: LoginScreenProps) {
  const [openingGoogle, setOpeningGoogle] = useState(false);

  useEffect(() => {
    try {
      configureGoogleSignIn();
    } catch {
    }
  }, []);

const handleGoogleLogin = async () => {
  setOpeningGoogle(true);
  
  try {
    const result = await signInWithGoogle();

    if (result.type === 'cancelled') {
      console.log('>>> 로그인이 사용자에 의해 취소됨');
      return;
    }

    if (result.serverAuthCode) {
      
      const response = await fetch('http://localhost:8085/auth/google', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverAuthCode: result.serverAuthCode }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('>>> 백엔드 에러 발생:', errorData);
        throw new Error('서버 인증 실패');
      }

      const data = await response.json();
      console.log('>>> 백엔드 토큰 발급 성공:', data);

        if (data.accessToken && data.userId) {
          setAuthSession(data.accessToken, data.userId, data.role || 'USER');
        } else {
          console.warn('!!! 서버 응답에 토큰이나 ID가 누락되었습니다.');
        }

      onLogin?.();
    } else {
      console.warn('!!! serverAuthCode가 없어서 서버 로그인을 진행할 수 없습니다.');
    }

  } catch (error) {
    Alert.alert('로그인 오류', formatGoogleSignInError(error));
  } finally {
    setOpeningGoogle(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Image source={loginLogoSource} style={styles.title} resizeMode="contain" />
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={handleGoogleLogin} disabled={openingGoogle}>
            <Text style={styles.buttonText}>
              {openingGoogle ? 'Google 로그인 중...' : 'Google 계정으로 로그인'}
            </Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Kakao 계정으로 로그인</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  root: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#F6F6F6',
    paddingHorizontal: 32,
    paddingTop: 72,
    paddingBottom: 148,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: 240,
    height: 72,
  },
  actions: {
    gap: 28,
  },
  button: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A6A6A6',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
});

export default LoginScreen;
