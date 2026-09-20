import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { Driver } from '@droppd/shared';
import { formatNigerianPhoneForDisplay, mockApi, transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { PrimaryButton } from '../components/PrimaryButton';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import type { ProfileStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'EditProfile'>;

export function EditProfileScreen({ navigation }: Props) {
  const { session } = useAuth();
  const driver = session?.user as Driver | undefined;
  const [fullName, setFullName] = useState(driver?.fullName ?? '');
  const [email, setEmail] = useState(driver?.email ?? '');
  const [vehiclePlate, setVehiclePlate] = useState(driver?.vehiclePlate ?? '');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!session) return;
    setSaving(true);
    try {
      await mockApi.updateProfile(session.user.id, { fullName, email });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Edit profile" onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <View>
          <Text style={styles.label}>Full name</Text>
          <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />
        </View>
        <View>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" autoCapitalize="none" />
        </View>
        <View>
          <Text style={styles.label}>Vehicle plate number</Text>
          <TextInput value={vehiclePlate} onChangeText={setVehiclePlate} style={styles.input} autoCapitalize="characters" />
        </View>
        <View>
          <Text style={styles.label}>Phone number</Text>
          <View style={[styles.input, styles.disabledInput]}>
            <Text style={styles.disabledText}>{session ? formatNigerianPhoneForDisplay(session.user.phone) : ''}</Text>
          </View>
          <Text style={styles.hint}>Contact support to change your verified phone number.</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <PrimaryButton label="Save changes" onPress={handleSave} loading={saving} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  body: { flex: 1, paddingHorizontal: 20, paddingTop: 20, gap: 18 },
  label: { fontSize: 12, fontWeight: '600', color: transitBlueColors.textSecondary, marginBottom: 6 },
  input: {
    backgroundColor: transitBlueColors.surface, borderRadius: transitBlueRadii.lg, borderWidth: 1,
    borderColor: transitBlueColors.border, paddingHorizontal: 14, paddingVertical: 13, fontSize: 14,
    fontWeight: '600', color: transitBlueColors.textPrimary,
  },
  disabledInput: { backgroundColor: transitBlueColors.surfaceTint, justifyContent: 'center' },
  disabledText: { fontSize: 14, fontWeight: '600', color: transitBlueColors.textSecondary },
  hint: { fontSize: 11, color: transitBlueColors.textMuted, marginTop: 6 },
  footer: { padding: 20 },
});
