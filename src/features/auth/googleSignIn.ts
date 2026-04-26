import { Platform } from 'react-native';
import {
  GoogleSignin,
  isCancelledResponse,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GOOGLE_IOS_CLIENT_ID, GOOGLE_WEB_CLIENT_ID } from './authConfig';

let configured = false;

export type GoogleSignInResult =
  | {
      type: 'success';
      userId: string;
      email: string;
      name: string | null;
      idToken: string | null;
      accessToken: string;
      serverAuthCode: string | null;
    }
  | {
      type: 'cancelled';
    };

export const configureGoogleSignIn = () => {
  if (configured) {
    return;
  }

  if (!GOOGLE_WEB_CLIENT_ID) {
    throw new Error('Google web client ID가 설정되지 않았어요.');
  }

  if (Platform.OS === 'ios' && !GOOGLE_IOS_CLIENT_ID) {
    throw new Error('iOS Google client ID가 설정되지 않았어요.');
  }

  GoogleSignin.configure({
    scopes: ['email', 'profile'],
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: Platform.OS === 'ios' ? GOOGLE_IOS_CLIENT_ID : undefined,
    offlineAccess: true,
  });

  configured = true;
};

export const signInWithGoogle = async (): Promise<GoogleSignInResult> => {
  configureGoogleSignIn();

  if (Platform.OS === 'android') {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  }

  const response = await GoogleSignin.signIn();

  if (isCancelledResponse(response)) {
    return { type: 'cancelled' };
  }

  if (!isSuccessResponse(response)) {
    return { type: 'cancelled' };
  }

  const tokens = await GoogleSignin.getTokens();

  return {
    type: 'success',
    userId: response.data.user.id,
    email: response.data.user.email,
    name: response.data.user.name,
    idToken: response.data.idToken,
    accessToken: tokens.accessToken,
    serverAuthCode: response.data.serverAuthCode,
  };
};

export const formatGoogleSignInError = (error: unknown) => {
  if (!isErrorWithCode(error)) {
    return '구글 로그인 중 오류가 발생했어요.';
  }

  if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    return 'Google Play Services를 사용할 수 없어요.';
  }

  if (error.code === statusCodes.IN_PROGRESS) {
    return '구글 로그인이 이미 진행 중이에요.';
  }

  return error.message || '구글 로그인 중 오류가 발생했어요.';
};
