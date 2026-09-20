import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { formatNaira, mockApi, transitBlueColors, transitBlueRadii, type Order } from '@droppd/shared';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { AppMapView } from '../components/AppMapView';
import { PrimaryButton } from '../components/PrimaryButton';
import type { HomeStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'ActiveDelivery'>;

export function ActiveDeliveryScreen({ navigation, route }: Props) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [code, setCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const load = useCallback(async () => {
    setOrder(await mockApi.getOrder(orderId));
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleComplete() {
    setError(null);
    setSubmitting(true);
    try {
      await mockApi.completeDelivery(orderId, code);
      setCompleted(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not confirm delivery.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!order) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={transitBlueColors.primary} />
      </View>
    );
  }

  if (completed) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark" size={36} color="#fff" />
        </View>
        <Text style={styles.successTitle}>Delivery confirmed</Text>
        <Text style={styles.successSubtitle}>{formatNaira(order.fee)} has been added to your earnings.</Text>
        <PrimaryButton label="Back to Home" onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable accessibilityLabel="Back" onPress={navigation.goBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={20} color={transitBlueColors.primary} />
        </Pressable>
        <View>
          <Text style={styles.title}>Active Delivery</Text>
          <Text style={styles.subtitle}>Order #{order.id} · {formatNaira(order.fee)}</Text>
        </View>
      </View>

      <View style={styles.mapCard}>
        <AppMapView
          style={StyleSheet.absoluteFill}
          region={{
            latitude: (order.pickup.latitude + order.dropoff.latitude) / 2,
            longitude: (order.pickup.longitude + order.dropoff.longitude) / 2,
            latitudeDelta: Math.abs(order.pickup.latitude - order.dropoff.latitude) + 0.05,
            longitudeDelta: Math.abs(order.pickup.longitude - order.dropoff.longitude) + 0.05,
          }}
          markers={[
            { coordinate: order.pickup, pinColor: transitBlueColors.primary, title: 'Pickup' },
            { coordinate: order.dropoff, pinColor: transitBlueColors.accent, title: 'Drop-off' },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.addressCard}>
          <View style={styles.addressRow}>
            <Ionicons name="ellipse" size={9} color={transitBlueColors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.addressValue}>{order.pickup.line1}, {order.pickup.area}</Text>
            </View>
          </View>
          <View style={styles.addressRow}>
            <Ionicons name="square" size={9} color={transitBlueColors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressLabel}>Drop-off</Text>
              <Text style={styles.addressValue}>{order.dropoff.line1}, {order.dropoff.area}</Text>
            </View>
          </View>
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeTitle}>Confirm Delivery</Text>
          <Text style={styles.codeHint}>Ask the customer for their 4-digit confirmation code to complete this delivery.</Text>
          <TextInput
            value={code}
            onChangeText={(t) => setCode(t.replace(/[^\d]/g, ''))}
            placeholder="0000"
            placeholderTextColor={transitBlueColors.textMuted}
            keyboardType="number-pad"
            maxLength={4}
            style={styles.codeInput}
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <PrimaryButton label="Confirm Delivery" onPress={handleComplete} loading={submitting} disabled={code.length < 4} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: transitBlueColors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 11, borderWidth: 1, borderColor: transitBlueColors.border, backgroundColor: transitBlueColors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '800', color: transitBlueColors.textPrimary },
  subtitle: { fontSize: 11, color: transitBlueColors.textSecondary },
  mapCard: { height: 190, margin: 20, marginBottom: 0, borderRadius: 20, overflow: 'hidden' },
  body: { padding: 20, gap: 18 },
  addressCard: { backgroundColor: transitBlueColors.surface, borderWidth: 1, borderColor: transitBlueColors.border, borderRadius: transitBlueRadii.lg, padding: 16, gap: 14 },
  addressRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  addressLabel: { fontSize: 11, color: transitBlueColors.textSecondary },
  addressValue: { fontSize: 13, fontWeight: '600', color: transitBlueColors.textPrimary },
  codeCard: { borderWidth: 1.5, borderColor: transitBlueColors.primary, borderRadius: 20, padding: 18, gap: 12 },
  codeTitle: { fontSize: 15, fontWeight: '800', color: transitBlueColors.textPrimary, textAlign: 'center' },
  codeHint: { fontSize: 12, color: transitBlueColors.textSecondary, textAlign: 'center', lineHeight: 17 },
  codeInput: {
    backgroundColor: transitBlueColors.surfaceTint, borderRadius: 14, paddingVertical: 16,
    fontSize: 28, fontWeight: '800', letterSpacing: 14, color: transitBlueColors.primary, textAlign: 'center',
  },
  error: { color: transitBlueColors.danger, fontSize: 12, textAlign: 'center' },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 32, backgroundColor: transitBlueColors.background },
  successIcon: { width: 72, height: 72, borderRadius: 36, backgroundColor: transitBlueColors.success, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 19, fontWeight: '800', color: transitBlueColors.textPrimary },
  successSubtitle: { fontSize: 13, color: transitBlueColors.textSecondary, textAlign: 'center', marginBottom: 12 },
});
