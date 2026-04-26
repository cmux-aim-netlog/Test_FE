import { Platform } from 'react-native';

export const API_BASE_URL = Platform.select({
  ios: 'http://localhost:8080',
  android: 'http://10.0.2.2:8080',
});

export const API_TIMEOUT_MS = 15000;
