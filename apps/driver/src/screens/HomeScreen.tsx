import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DEFAULT_MAP_REGION, formatNaira, mockApi, transitBlueColors, transitBlueRadii, type Order } from '@droppd/shared';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

import { AppMapView } from '../components/AppMapView';
import { useAuth } from '../context/AuthContext';
import { usePushNotifications } from '../notifications/usePushNotifications';
import type { HomeStackParamList } from '../navigation/MainTabNavigator';

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { session } = useAuth();
  usePushNotifications(session?.user.id ?? null);
  const [isOnline, setIsOnline] = useState(true);
  const [jobs, setJobs] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const loadJobs = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      setJobs(await mockApi.getAvailableJobs(session.user.id));
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  async function handleAccept(orderId: string) {
    if (!session) return;
    setAcceptingId(orderId);
    try {
      const order = await mockApi.acceptJob(session.user.id, orderId);
      navigation.navigate('ActiveDelivery', { orderId: order.id });
    } finally {
      setAcceptingId(null);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.mapWrap}>
        <AppMapView
          style={StyleSheet.absoluteFill}
          region={DEFAULT_MAP_REGION}
          markers={jobs.map((job) => ({ coordinate: job.pickup, pinColor: transitBlueColors.accent, title: job.pickup.area }))}
        />

        <View style={styles.topBar}>
          <View style={styles.greetingCard}>
            <Text style={styles.greetingLabel}>{isOnline ? 'You’re online' : 'You’re offline'}</Text>
            <Text style={styles.greetingName}>{session?.user.fullName ?? 'Driver'}</Text>
          </View>
          <View style={styles.onlineToggle}>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: transitBlueColors.border, true: transitBlueColors.primary }}
              thumbColor="#fff"
            />
          </View>
        </View>
      </View>

      <View style={styles.sheet}>
        <View style={styles.grabber} />
        <Text style={styles.sectionTitle}>{isOnline ? 'Nearby delivery requests' : 'Go online to see requests'}</Text>
        {loading ? (
          <ActivityIndicator color={transitBlueColors.primary} style={{ marginTop: 20 }} />
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {isOnline && jobs.map((job) => (
              <View key={job.id} style={styles.jobCard}>
                <View style={styles.jobRow}>
                  <Ionicons name="ellipse" size={9} color={transitBlueColors.primary} />
                  <Text style={styles.jobAddress} numberOfLines={1}>{job.pickup.area}, {job.pickup.city}</Text>
                </View>
                <View style={styles.jobRow}>
                  <Ionicons name="square" size={9} color={transitBlueColors.accent} />
                  <Text style={styles.jobAddress} numberOfLines={1}>{job.dropoff.area}, {job.dropoff.city}</Text>
                </View>
                <View style={styles.jobFooter}>
                  <Text style={styles.jobFee}>{formatNaira(job.fee)} · {job.etaMinutes} min</Text>
                  <Pressable style={styles.acceptButton} onPress={() => handleAccept(job.id)} disabled={acceptingId === job.id}>
                    {acceptingId === job.id ? (
                      <ActivityIndicator color="#10182B" size="small" />
                    ) : (
                      <Text style={styles.acceptText}>Accept</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            ))}
            {isOnline && jobs.length === 0 && (
              <Text style={styles.emptyText}>No requests nearby right now. We’ll notify you the moment one comes in.</Text>
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  mapWrap: { height: 300 },
  topBar: { position: 'absolute', top: 18, left: 18, right: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  greetingCard: { backgroundColor: transitBlueColors.surface, borderRadius: transitBlueRadii.lg, paddingHorizontal: 16, paddingVertical: 10 },
  greetingLabel: { fontSize: 11, color: transitBlueColors.textSecondary, fontWeight: '500' },
  greetingName: { fontSize: 14, fontWeight: '700', color: transitBlueColors.textPrimary },
  onlineToggle: { backgroundColor: transitBlueColors.surface, borderRadius: transitBlueRadii.lg, padding: 4 },
  sheet: { flex: 1, backgroundColor: transitBlueColors.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, padding: 20, gap: 14 },
  grabber: { width: 40, height: 4, borderRadius: 2, backgroundColor: transitBlueColors.border, alignSelf: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: transitBlueColors.textPrimary },
  jobCard: { backgroundColor: transitBlueColors.surfaceTint, borderRadius: transitBlueRadii.lg, padding: 14, gap: 8 },
  jobRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  jobAddress: { fontSize: 13, fontWeight: '600', color: transitBlueColors.textPrimary, flexShrink: 1 },
  jobFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  jobFee: { fontSize: 13, fontWeight: '700', color: transitBlueColors.textPrimary },
  acceptButton: { backgroundColor: transitBlueColors.accent, borderRadius: 10, paddingHorizontal: 18, paddingVertical: 8, minWidth: 76, alignItems: 'center' },
  acceptText: { fontSize: 12.5, fontWeight: '700', color: '#10182B' },
  emptyText: { fontSize: 13, color: transitBlueColors.textSecondary, textAlign: 'center', marginTop: 24 },
});
