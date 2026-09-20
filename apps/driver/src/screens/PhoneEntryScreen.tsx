import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { toE164Nigeria, transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import type { AuthStackParamList } from '../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'PhoneEntry'>;

export function PhoneEntryScreen({ navigation }: Props) {
  const { requestOtp } = useAuth();
  const [localNumber, setLocalNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValid = /^0\d{10}$/.test(localNumber);

  async function handleContinue() {
    if (!isValid) {
      setError('Enter a valid Nigerian phone number, e.g. 0801 234 5678');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const phoneE164 = toE164Nigeria(localNumber);
      await requestOtp(phoneE164);
      navigation.navigate('OtpVerify', { phoneE164 });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="What's your number?" subtitle="We'll text you a verification code" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.inputRow}>
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>🇳🇬 +234</Text>
          </View>
          <TextInput
            value={localNumber}
            onChangeText={(t) => setLocalNumber(t.replace(/[^\d]/g, ''))}
            placeholder="0801 234 5678"
            placeholderTextColor={transitBlueColors.textMuted}
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.input}
            autoFocus
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Continue" onPress={handleContinue} loading={loading} disabled={!isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 24, gap: 10 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: transitBlueColors.surface,
    borderRadius: transitBlueRadii.lg,
    borderWidth: 1,
    borderColor: transitBlueColors.border,
    paddingHorizontal: 14,
  },
  prefix: {
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: transitBlueColors.border,
  },
  prefixText: { fontSize: 15, fontWeight: '700', color: transitBlueColors.textPrimary },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    fontWeight: '600',
    color: transitBlueColors.textPrimary,
  },
  error: { color: transitBlueColors.danger, fontSize: 12 },
  footer: { padding: 20 },
});
