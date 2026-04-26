import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { type SearchStackParamList } from './types';
import SearchScreen from '../features/search/screens/SearchScreen';
import StudyJoinScreen from '../features/search/screens/StudyJoinScreen';

const Stack = createNativeStackNavigator<SearchStackParamList>();

function SearchStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchMain" component={SearchScreen} />
      <Stack.Screen name="StudyJoin" component={StudyJoinScreen} />
    </Stack.Navigator>
  );
}

export default SearchStack;
