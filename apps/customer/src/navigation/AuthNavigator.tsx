import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import { OtpVerifyScreen } from '../screens/OtpVerifyScreen';
import { PhoneEntryScreen } from '../screens/PhoneEntryScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';

export type AuthStackParamList = {
  Welcome: undefined;
  PhoneEntry: undefined;
  OtpVerify: { phoneE164: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PhoneEntry" component={PhoneEntryScreen} />
      <Stack.Screen name="OtpVerify" component={OtpVerifyScreen} />
    </Stack.Navigator>
  );
}
