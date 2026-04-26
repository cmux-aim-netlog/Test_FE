import React, { useState } from 'react';
import BottomTabs from '../../navigation/BottomTabs';
import LoginScreen from './screens/LoginScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import {
  getAuthLaunchState,
  markLoggedInBefore,
  markOnboardingSeen,
} from './authStorage';

type AuthStage = 'onboarding' | 'login' | 'app';

const getInitialStage = (): AuthStage => {
  const { hasSeenOnboarding, hasLoggedInBefore } = getAuthLaunchState();

  if (hasLoggedInBefore) {
    return 'app';
  }

  return hasSeenOnboarding ? 'login' : 'onboarding';
};

function AuthGate() {
  const [stage, setStage] = useState<AuthStage>(() => getInitialStage());

  const handleOnboardingComplete = () => {
    markOnboardingSeen();
    setStage('login');
  };

  const handleLogin = () => {
    markLoggedInBefore();
    setStage('app');
  };

  if (stage === 'onboarding') {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  if (stage === 'login') {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <BottomTabs />;
}

export default AuthGate;
