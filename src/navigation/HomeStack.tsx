import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../features/home/screens/HomeScreen';
import StudyDetailScreen from '../features/study-detail/screens/StudyDetailScreen';
import { type HomeStackParamList } from './types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="StudyDetail" component={StudyDetailScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
