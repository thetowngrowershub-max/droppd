import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { transitBlueColors, transitBlueRadii } from '@droppd/shared';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import type { ProfileStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ProfileHome'>;

const MENU_ITEMS: { icon: keyof typeof Ionicons.glyphMap; label: string; screen?: keyof ProfileStackParamList }[] = [
  { icon: 'location-outline', label: 'Saved Addresses' },
  { icon: 'card-outline', label: 'Payment Methods' },
  { icon: 'notifications-outline', label: 'Notifications' },
  { icon: 'headset-outline', label: 'Help & Support' },
  { icon: 'shield-checkmark-outline', label: 'Privacy Policy', screen: 'PrivacyPolicy' },
];

export function ProfileScreen({ navigation }: Props) {
  const { session, logout } = useAuth();
  const user = session?.user;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.avatarInitials ?? '—'}</Text>
          </View>
          <Text style={styles.name}>{user?.fullName}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <Pressable style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Ionicons name="pencil-outline" size={14} color={transitBlueColors.primary} />
            <Text style={styles.editButtonText}>Edit profile</Text>
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Sent</Text>
          </View>
          <View style={[styles.statCell, styles.statBorder]}>
            <Text style={styles.statValue}>31</Text>
            <Text style={styles.statLabel}>Received</Text>
          </View>
          <View style={styles.statCell}>
            <Text style={styles.statValue}>{user?.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menu}>
          {MENU_ITEMS.map((item, i) => (
            <Pressable
              key={item.label}
              style={[styles.menuRow, i < MENU_ITEMS.length - 1 && styles.menuRowBorder]}
              onPress={() => item.screen && navigation.navigate(item.screen)}
            >
              <Ionicons name={item.icon} size={18} color={transitBlueColors.primary} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={transitBlueColors.textMuted} />
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.deleteAccountButton} onPress={() => navigation.navigate('DeleteAccount')}>
          <Text style={styles.deleteAccountText}>Delete Account</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={17} color={transitBlueColors.danger} />
          <Text style={styles.logoutText}>Log out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 4 },
  title: { fontSize: 22, fontWeight: '800', color: transitBlueColors.textPrimary },
  body: { paddingHorizontal: 20, paddingBottom: 24, gap: 18 },
  avatarBlock: { alignItems: 'center', gap: 8, paddingTop: 8 },
  avatar: {
    width: 82, height: 82, borderRadius: 41, backgroundColor: transitBlueColors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { fontSize: 18, fontWeight: '700', color: transitBlueColors.textPrimary },
  email: { fontSize: 12, color: transitBlueColors.textSecondary },
  editButton: {
    flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: transitBlueColors.border,
    backgroundColor: transitBlueColors.surface, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6,
  },
  editButtonText: { fontSize: 12, fontWeight: '600', color: transitBlueColors.primary },
  statsRow: {
    flexDirection: 'row', backgroundColor: transitBlueColors.surface, borderWidth: 1, borderColor: transitBlueColors.border,
    borderRadius: transitBlueRadii.xl, paddingVertical: 16,
  },
  statCell: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: transitBlueColors.border },
  statValue: { fontSize: 18, fontWeight: '800', color: transitBlueColors.textPrimary },
  statLabel: { fontSize: 11, color: transitBlueColors.textSecondary },
  menu: {
    backgroundColor: transitBlueColors.surface, borderWidth: 1, borderColor: transitBlueColors.border,
    borderRadius: transitBlueRadii.xl, overflow: 'hidden',
  },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: transitBlueColors.border },
  menuLabel: { flex: 1, fontSize: 13, fontWeight: '600', color: transitBlueColors.textPrimary },
  deleteAccountButton: { alignItems: 'center', paddingVertical: 10 },
  deleteAccountText: { fontSize: 12.5, fontWeight: '600', color: transitBlueColors.textMuted, textDecorationLine: 'underline' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    borderWidth: 1, borderColor: transitBlueColors.dangerBorder, backgroundColor: transitBlueColors.dangerBg,
    borderRadius: transitBlueRadii.lg, paddingVertical: 13,
  },
  logoutText: { fontSize: 13, fontWeight: '700', color: transitBlueColors.danger },
});
