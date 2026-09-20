import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import type { ProfileStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'DeleteAccount'>;

const WHAT_GETS_DELETED = [
  'Your profile, name, email and phone number',
  'Vehicle details and uploaded documents',
  'Payout account details',
  'Delivery history and ratings',
  'Push notification device registrations',
];

const WHAT_IS_RETAINED =
  'Completed payout records may be retained for up to 7 years where required by Nigerian tax and financial regulation, in de-identified form. See our Privacy Policy for details.';

export function DeleteAccountScreen({ navigation }: Props) {
  const { deleteAccount } = useAuth();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDelete = confirmText.trim().toUpperCase() === 'DELETE';

  async function handleDelete() {
    setError(null);
    setDeleting(true);
    try {
      await deleteAccount();
      // RootNavigator swaps back to AuthNavigator automatically once session clears.
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete your account. Try again.');
      setDeleting(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Delete Account" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View style={styles.warningCard}>
          <Ionicons name="warning-outline" size={22} color={transitBlueColors.danger} />
          <Text style={styles.warningText}>This permanently deletes your droppd Driver account. This cannot be undone.</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>This will delete:</Text>
          {WHAT_GETS_DELETED.map((item) => (
            <View key={item} style={styles.listRow}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.retentionText}>{WHAT_IS_RETAINED}</Text>

        <View>
          <Text style={styles.sectionTitle}>Type DELETE to confirm</Text>
          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            placeholder="DELETE"
            placeholderTextColor={transitBlueColors.textMuted}
            autoCapitalize="characters"
            style={styles.input}
          />
        </View>
        {error ? <Text style={styles.error}>{error}</Text> : null}
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Permanently delete my account" onPress={handleDelete} loading={deleting} disabled={!canDelete} variant="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 16, gap: 18 },
  warningCard: {
    flexDirection: 'row', gap: 12, alignItems: 'flex-start', backgroundColor: transitBlueColors.dangerBg,
    borderWidth: 1, borderColor: transitBlueColors.dangerBorder, borderRadius: transitBlueRadii.lg, padding: 14,
  },
  warningText: { flex: 1, fontSize: 13, fontWeight: '600', color: transitBlueColors.danger, lineHeight: 18 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: transitBlueColors.textPrimary, marginBottom: 8 },
  listRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  bullet: { width: 5, height: 5, borderRadius: 3, backgroundColor: transitBlueColors.textMuted },
  listText: { fontSize: 13, color: transitBlueColors.textSecondary },
  retentionText: { fontSize: 11.5, color: transitBlueColors.textMuted, lineHeight: 17 },
  input: {
    backgroundColor: transitBlueColors.surface, borderRadius: transitBlueRadii.lg, borderWidth: 1,
    borderColor: transitBlueColors.border, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14,
    fontWeight: '700', letterSpacing: 2, color: transitBlueColors.textPrimary,
  },
  error: { color: transitBlueColors.danger, fontSize: 12 },
  footer: { padding: 20 },
});
