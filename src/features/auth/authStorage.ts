import { Platform, Settings } from 'react-native';

const HAS_SEEN_ONBOARDING_KEY = 'auth.hasSeenOnboarding';
const HAS_LOGGED_IN_BEFORE_KEY = 'auth.hasLoggedInBefore';
const ACCESS_TOKEN_KEY = 'auth.accessToken';
const REFRESH_TOKEN_KEY = 'auth.refreshToken';
const USER_ID_KEY = 'auth.userId';
const USER_ROLE_KEY = 'auth.userRole';

const memoryStore: Record<string, boolean> = {};
const memoryStringStore: Record<string, string> = {};

const readBoolean = (key: string) => {
  if (Platform.OS === 'ios') {
    return Settings.get(key) === true;
  }
  return memoryStore[key] === true;
};

const writeBoolean = (key: string, value: boolean) => {
  if (Platform.OS === 'ios') {
    Settings.set({ [key]: value });
    return;
  }
  memoryStore[key] = value;
};

const readString = (key: string) => {
  if (Platform.OS === 'ios') {
    const value = Settings.get(key);
    return typeof value === 'string' ? value : null;
  }
  return memoryStringStore[key] ?? null;
};

const writeString = (key: string, value?: string) => {
  if (Platform.OS === 'ios') {
    Settings.set({ [key]: value ?? '' });
    return;
  }

  if (value) {
    memoryStringStore[key] = value;
    return;
  }

  delete memoryStringStore[key];
};

export type AuthLaunchState = {
  hasSeenOnboarding: boolean;
  hasLoggedInBefore: boolean;
};

export const getAuthLaunchState = (): AuthLaunchState => ({
  hasSeenOnboarding: readBoolean(HAS_SEEN_ONBOARDING_KEY),
  hasLoggedInBefore: readBoolean(HAS_LOGGED_IN_BEFORE_KEY),
});

export const markOnboardingSeen = () => {
  writeBoolean(HAS_SEEN_ONBOARDING_KEY, true);
};

export const markLoggedInBefore = () => {
  writeBoolean(HAS_SEEN_ONBOARDING_KEY, true);
  writeBoolean(HAS_LOGGED_IN_BEFORE_KEY, true);
};

export type StoredAuthSession = {
  accessToken: string | null;
  refreshToken: string | null;
  userId: string | null;
  role: string | null;
};

export const getStoredAuthSession = (): StoredAuthSession => ({
  accessToken: readString(ACCESS_TOKEN_KEY),
  refreshToken: readString(REFRESH_TOKEN_KEY),
  userId: readString(USER_ID_KEY),
  role: readString(USER_ROLE_KEY),
});

export const storeAuthSession = (session: StoredAuthSession) => {
  writeString(ACCESS_TOKEN_KEY, session.accessToken ?? undefined);
  writeString(REFRESH_TOKEN_KEY, session.refreshToken ?? undefined);
  writeString(USER_ID_KEY, session.userId ?? undefined);
  writeString(USER_ROLE_KEY, session.role ?? undefined);
};
