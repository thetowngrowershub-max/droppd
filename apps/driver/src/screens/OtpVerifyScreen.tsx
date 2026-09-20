import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatNigerianPhoneForDisplay, transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'OtpVerify'>;

export function OtpVerifyScreen({ navigation, route }: Props) {
  const { phoneE164 } = route.params;
  const { verifyOtp, requestOtp } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleVerify() {
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(phoneE164, code);
      // RootNavigator swaps to MainTabNavigator automatically once session is set.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Incorrect code. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError(null);
    await requestOtp(phoneE164);
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Enter the code"
        subtitle={`Sent to ${formatNigerianPhoneForDisplay(phoneE164)}`}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.body}>
        <TextInput
          value={code}
          onChangeText={(t) => setCode(t.replace(/[^\d]/g, ''))}
          placeholder="••••••"
          placeholderTextColor={transitBlueColors.textMuted}
          keyboardType="number-pad"
          maxLength={6}
          style={styles.input}
          autoFocus
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable onPress={handleResend}>
          <Text style={styles.resend}>Didn't get a code? Resend</Text>
        </Pressable>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Verify" onPress={handleVerify} loading={loading} disabled={code.length < 6} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24, gap: 14 },
  input: {
    backgroundColor: transitBlueColors.surface,
    borderRadius: transitBlueRadii.lg,
    borderWidth: 1,
    borderColor: transitBlueColors.border,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 10,
    color: transitBlueColors.primary,
    textAlign: 'center',
  },
  error: { color: transitBlueColors.danger, fontSize: 12, textAlign: 'center' },
  resend: { color: transitBlueColors.primary, fontWeight: '700', fontSize: 13, textAlign: 'center' },
  footer: { padding: 20 },
});
