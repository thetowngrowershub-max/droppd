import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatNaira, mockApi, transitBlueColors, transitBlueRadii, type Order } from '@droppd/shared';
import * as Clipboard from 'expo-clipboard';
import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { AppMapView } from '../components/AppMapView';
import { useAuth } from '../context/AuthContext';
import type { HomeStackParamList } from '../navigation/MainTabNavigator';

export function TrackingScreen() {
  const { session } = useAuth();
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const orderId = (route.params as { orderId?: string } | undefined)?.orderId;

  const [order, setOrder] = useState<Order | null>(null);
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    if (orderId) {
      setOrder(await mockApi.getOrder(orderId));
    } else if (session) {
      setOrder(await mockApi.getActiveOrder(session.user.id));
    }
  }, [orderId, session]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCopy() {
    if (!order) return;
    await Clipboard.setStringAsync(order.confirmationCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleShare() {
    if (!order) return;
    await Share.share({ message: `My droppd delivery confirmation code is ${order.confirmationCode} for order ${order.id}.` });
  }

  if (!order) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cube-outline" size={40} color={transitBlueColors.textMuted} />
        <Text style={styles.emptyTitle}>No active delivery</Text>
        <Text style={styles.emptySubtitle}>Orders you place will show up here for live tracking.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <Pressable accessibilityLabel="Back" onPress={navigation.goBack} style={styles.backButton}>
            <Ionicons name="chevron-back" size={20} color={transitBlueColors.primary} />
          </Pressable>
        )}
        <View>
          <Text style={styles.title}>Track Package</Text>
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
        <View style={styles.etaBadge}>
          <Text style={styles.etaText}>ETA {order.etaMinutes} min</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View>
          {order.statusHistory.map((event, i) => {
            const reached = Boolean(event.timestamp);
            const isCurrent = !reached && Boolean(order.statusHistory[i - 1]?.timestamp);
            return (
              <View key={event.status} style={styles.timelineRow}>
                <View style={styles.timelineMarkerCol}>
                  <View
                    style={[
                      styles.timelineDot,
                      reached && { backgroundColor: transitBlueColors.primary },
                      isCurrent && { backgroundColor: transitBlueColors.accent },
                    ]}
                  >
                    {reached && <Ionicons name="checkmark" size={12} color="#fff" />}
                  </View>
                  {i < order.statusHistory.length - 1 && (
                    <View style={[styles.timelineLine, reached && { backgroundColor: transitBlueColors.primary }]} />
                  )}
                </View>
                <View style={styles.timelineText}>
                  <Text style={[styles.timelineLabel, !reached && !isCurrent && styles.timelineLabelMuted]}>{event.label}</Text>
                  <Text style={styles.timelineTime}>
                    {event.timestamp ? new Date(event.timestamp).toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' }) : isCurrent ? 'In progress' : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.codeCard}>
          <Text style={styles.codeTitle}>Delivery Confirmation Code</Text>
          <View style={styles.codeDigits}>
            {order.confirmationCode.split('').map((digit, i) => (
              <View key={i} style={styles.codeDigit}>
                <Text style={styles.codeDigitText}>{digit}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.codeHint}>Share this code with your courier once the package is handed over.</Text>
          <View style={styles.codeActions}>
            <Pressable style={styles.codeSecondaryButton} onPress={handleCopy}>
              <Ionicons name="copy-outline" size={15} color={transitBlueColors.primary} />
              <Text style={styles.codeSecondaryText}>{copied ? 'Copied!' : 'Copy'}</Text>
            </Pressable>
            <Pressable style={styles.codePrimaryButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={15} color="#10182B" />
              <Text style={styles.codePrimaryText}>Share</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: transitBlueColors.background, padding: 32 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: transitBlueColors.textPrimary },
  emptySubtitle: { fontSize: 12, color: transitBlueColors.textSecondary, textAlign: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 20 },
  backButton: { width: 36, height: 36, borderRadius: 11, borderWidth: 1, borderColor: transitBlueColors.border, backgroundColor: transitBlueColors.surface, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '800', color: transitBlueColors.textPrimary },
  subtitle: { fontSize: 11, color: transitBlueColors.textSecondary },
  mapCard: { height: 200, margin: 20, marginBottom: 0, borderRadius: 20, overflow: 'hidden' },
  etaBadge: { position: 'absolute', left: 14, top: 12, backgroundColor: transitBlueColors.surface, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  etaText: { fontSize: 11, fontWeight: '700', color: transitBlueColors.textPrimary },
  body: { padding: 20, gap: 20 },
  timelineRow: { flexDirection: 'row', gap: 12 },
  timelineMarkerCol: { alignItems: 'center' },
  timelineDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: transitBlueColors.border, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 2, height: 22, backgroundColor: transitBlueColors.border },
  timelineText: { paddingBottom: 14 },
  timelineLabel: { fontSize: 13, fontWeight: '700', color: transitBlueColors.textPrimary },
  timelineLabelMuted: { color: transitBlueColors.textMuted, fontWeight: '600' },
  timelineTime: { fontSize: 11, color: transitBlueColors.textSecondary },
  codeCard: { borderWidth: 1.5, borderColor: transitBlueColors.primary, borderRadius: 20, padding: 18, alignItems: 'center' },
  codeTitle: { fontSize: 12, fontWeight: '700', color: transitBlueColors.primary, textTransform: 'uppercase', letterSpacing: 0.5 },
  codeDigits: { flexDirection: 'row', gap: 8, marginVertical: 14 },
  codeDigit: { width: 46, height: 56, borderRadius: 12, backgroundColor: transitBlueColors.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  codeDigitText: { fontSize: 26, fontWeight: '800', color: transitBlueColors.primary },
  codeHint: { fontSize: 11.5, color: transitBlueColors.textSecondary, textAlign: 'center', marginBottom: 14 },
  codeActions: { flexDirection: 'row', gap: 10, width: '100%' },
  codeSecondaryButton: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: transitBlueColors.border, backgroundColor: transitBlueColors.background, borderRadius: 12, paddingVertical: 11 },
  codeSecondaryText: { fontSize: 12.5, fontWeight: '700', color: transitBlueColors.primary },
  codePrimaryButton: { flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: transitBlueColors.accent, borderRadius: 12, paddingVertical: 11 },
  codePrimaryText: { fontSize: 12.5, fontWeight: '700', color: '#10182B' },
});
