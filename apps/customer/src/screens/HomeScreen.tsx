import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  DEFAULT_MAP_REGION,
  LAGOS_ADDRESSES,
  mockApi,
  transitBlueColors,
  transitBlueRadii,
} from '@droppd/shared';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../notifications/usePushNotifications';
import type { HomeStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { session } = useAuth();
  usePushNotifications(session?.user.id ?? null);
  const [region, setRegion] = useState(DEFAULT_MAP_REGION);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [dropoffLabel, setDropoffLabel] = useState<string | null>(null);

  async function useCurrentLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    const position = await Location.getCurrentPositionAsync({});
    setRegion({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  }

  async function handleGetQuote() {
    if (!session) return;
    setCreatingOrder(true);
    try {
      const order = await mockApi.createOrder({
        customerId: session.user.id,
        pickupAddressId: LAGOS_ADDRESSES[0].id,
        dropoffAddressId: LAGOS_ADDRESSES[1].id,
      });
      navigation.navigate('Tracking', { orderId: order.id });
    } finally {
      setCreatingOrder(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFill}
          initialRegion={region}
          region={region}
        >
          <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} pinColor={transitBlueColors.primary} />
        </MapView>

        <View style={styles.topBar}>
          <View style={styles.greetingCard}>
            <Text style={styles.greetingLabel}>Good afternoon</Text>
            <Text style={styles.greetingName}>{session?.user.fullName ?? 'there'}</Text>
          </View>
          <Pressable accessibilityLabel="Notifications" style={styles.roundButton}>
            <Ionicons name="notifications-outline" size={20} color={transitBlueColors.primary} />
          </Pressable>
        </View>

        <Pressable accessibilityLabel="Use current location" onPress={useCurrentLocation} style={styles.locateButton}>
          <Ionicons name="locate-outline" size={20} color={transitBlueColors.primary} />
        </Pressable>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          <View style={styles.addressRow}>
            <View style={styles.connector}>
              <View style={[styles.dot, { backgroundColor: transitBlueColors.primary }]} />
              <View style={styles.dashedLine} />
              <View style={[styles.dot, { backgroundColor: transitBlueColors.accent, borderRadius: 3 }]} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.addressField}>
                <Text style={styles.addressLabel}>Pickup</Text>
                <Text style={styles.addressValue}>{LAGOS_ADDRESSES[0].line1}, {LAGOS_ADDRESSES[0].area}</Text>
              </View>
              <View style={[styles.addressField, { borderBottomWidth: 0 }]}>
                <Text style={styles.addressLabel}>Delivery</Text>
                <Text style={[styles.addressValue, !dropoffLabel && styles.placeholder]}>
                  {dropoffLabel ?? "Where's it going?"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.quickActions}>
            <Pressable
              style={styles.quickCard}
              onPress={() => setDropoffLabel(`${LAGOS_ADDRESSES[1].line1}, ${LAGOS_ADDRESSES[1].area}`)}
            >
              <View style={[styles.quickIcon, { backgroundColor: transitBlueColors.primary }]}>
                <Ionicons name="cube-outline" size={18} color="#fff" />
              </View>
              <Text style={styles.quickLabel}>Send a Package</Text>
            </Pressable>
            <Pressable style={styles.quickCard}>
              <View style={[styles.quickIcon, { backgroundColor: transitBlueColors.accent }]}>
                <Ionicons name="time-outline" size={18} color="#10182B" />
              </View>
              <Text style={styles.quickLabel}>Schedule Pickup</Text>
            </Pressable>
          </View>

          <PrimaryButton label="Get a quote" onPress={handleGetQuote} loading={creatingOrder} />

          <View>
            <Text style={styles.recentTitle}>Recent</Text>
            {LAGOS_ADDRESSES.slice(0, 2).map((addr) => (
              <View key={addr.id} style={styles.recentRow}>
                <Text style={styles.recentLabel}>{addr.label} · {addr.area}</Text>
                <Ionicons name="chevron-forward" size={16} color={transitBlueColors.textMuted} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  mapWrap: { height: 340 },
  topBar: {
    position: 'absolute',
    top: 18,
    left: 18,
    right: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greetingCard: {
    backgroundColor: transitBlueColors.surface,
    borderRadius: transitBlueRadii.lg,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  greetingLabel: { fontSize: 11, color: transitBlueColors.textSecondary, fontWeight: '500' },
  greetingName: { fontSize: 14, fontWeight: '700', color: transitBlueColors.textPrimary },
  roundButton: {
    width: 42,
    height: 42,
    borderRadius: transitBlueRadii.lg,
    backgroundColor: transitBlueColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locateButton: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 44,
    height: 44,
    borderRadius: transitBlueRadii.lg,
    backgroundColor: transitBlueColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    flex: 1,
    backgroundColor: transitBlueColors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    padding: 20,
    gap: 12,
  },
  grabber: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: transitBlueColors.border,
    alignSelf: 'center',
  },
  addressRow: { flexDirection: 'row', gap: 12 },
  connector: { alignItems: 'center', paddingTop: 14, gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  dashedLine: { width: 2, flexGrow: 1, minHeight: 28, backgroundColor: transitBlueColors.border },
  addressField: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: transitBlueColors.border },
  addressLabel: { fontSize: 11, color: transitBlueColors.textSecondary },
  addressValue: { fontSize: 14, fontWeight: '600', color: transitBlueColors.textPrimary },
  placeholder: { color: transitBlueColors.textMuted, fontWeight: '500' },
  quickActions: { flexDirection: 'row', gap: 12 },
  quickCard: {
    flex: 1,
    backgroundColor: transitBlueColors.surfaceTint,
    borderRadius: transitBlueRadii.lg,
    padding: 14,
    gap: 8,
  },
  quickIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  quickLabel: { fontSize: 13, fontWeight: '600', color: transitBlueColors.textPrimary },
  recentTitle: { fontSize: 13, fontWeight: '700', marginBottom: 8, color: transitBlueColors.textPrimary },
  recentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: transitBlueColors.border,
  },
  recentLabel: { fontSize: 13, fontWeight: '600', color: transitBlueColors.textPrimary },
});
