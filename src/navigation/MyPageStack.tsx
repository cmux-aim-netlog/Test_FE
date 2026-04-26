import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyPageScreen from '../features/mypage/screens/MyPageScreen';
import EditProfileScreen from '../features/mypage/screens/EditProfileScreen';

const Stack = createNativeStackNavigator();

export default function MyPageStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyPageMain" component={MyPageScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}