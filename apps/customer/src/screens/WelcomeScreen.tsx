import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { transitBlueColors } from '@droppd/shared';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>d</Text>
        </View>
        <Text style={styles.title}>droppd</Text>
        <Text style={styles.tagline}>Send and receive packages anywhere in Nigeria — fast, tracked, and secure.</Text>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Get Started" onPress={() => navigation.navigate('PhoneEntry')} />
        <Text style={styles.legal}>By continuing, you agree to droppd's Terms of Service and Privacy Policy.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: transitBlueColors.background,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: transitBlueColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: transitBlueColors.textPrimary,
  },
  tagline: {
    fontSize: 14,
    color: transitBlueColors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  footer: {
    gap: 14,
  },
  legal: {
    fontSize: 11,
    color: transitBlueColors.textMuted,
    textAlign: 'center',
  },
});
