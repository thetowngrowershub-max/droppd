import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { transitBlueColors } from '@droppd/shared';
import React from 'react';

import { DeleteAccountScreen } from '../screens/DeleteAccountScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { PrivacyPolicyScreen } from '../screens/PrivacyPolicyScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TrackingScreen } from '../screens/TrackingScreen';
import { WalletScreen } from '../screens/WalletScreen';

export type HomeStackParamList = {
  Home: undefined;
  Tracking: { orderId: string };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  DeleteAccount: undefined;
  PrivacyPolicy: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  TrackTab: undefined;
  WalletTab: undefined;
  ProfileTab: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Tracking" component={TrackingScreen} />
    </HomeStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </ProfileStack.Navigator>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: transitBlueColors.primary,
        tabBarInactiveTintColor: transitBlueColors.textMuted,
        tabBarStyle: { borderTopColor: transitBlueColors.border, height: 78, paddingTop: 8, paddingBottom: 10 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{ title: 'Home', tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="TrackTab"
        component={TrackingScreen}
        options={{ title: 'Track', tabBarIcon: ({ color, size }) => <Ionicons name="location-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="WalletTab"
        component={WalletScreen}
        options={{ title: 'Wallet', tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackNavigator}
        options={{ title: 'Profile', tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}
