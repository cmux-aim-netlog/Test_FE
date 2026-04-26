import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthGate from './features/auth/AuthGate';
import { NotificationCenterProvider } from './state/NotificationCenterContext';
function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NotificationCenterProvider>
          <NavigationContainer>
            <AuthGate />
          </NavigationContainer>
        </NotificationCenterProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
