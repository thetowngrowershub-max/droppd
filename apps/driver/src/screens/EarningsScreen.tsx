import { Ionicons } from '@expo/vector-icons';
import { formatNaira, mockApi, transitBlueColors, transitBlueRadii, type Wallet } from '@droppd/shared';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

export function EarningsScreen() {
  const { session } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const load = useCallback(async () => {
    if (!session) return;
    setWallet(await mockApi.getWallet(session.user.id));
  }, [session]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleWithdraw() {
    if (!session || !wallet) return;
    setWithdrawing(true);
    try {
      // In production this initiates a bank transfer payout via Paystack
      // Transfers / Flutterwave Payouts and debits the balance once confirmed.
      await new Promise((r) => setTimeout(r, 800));
    } finally {
      setWithdrawing(false);
    }
  }

  if (!wallet) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={transitBlueColors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Earnings</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[transitBlueColors.primary, transitBlueColors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.balanceCard}
        >
          <Text style={styles.balanceLabel}>Available Earnings</Text>
          <Text style={styles.balanceValue}>{formatNaira(wallet.balance)}</Text>
          <Pressable style={styles.withdrawButton} onPress={handleWithdraw} disabled={withdrawing}>
            {withdrawing ? <ActivityIndicator color="#10182B" /> : <Text style={styles.withdrawText}>Withdraw to bank</Text>}
          </Pressable>
        </LinearGradient>

        <View>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payout Method</Text>
            <Text style={styles.manageLink}>Manage</Text>
          </View>
          <View style={styles.methodRow}>
            <View style={styles.methodIcon}>
              <Ionicons name="business-outline" size={18} color={transitBlueColors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.methodLabel}>GTBank •••• 2210</Text>
              <Text style={styles.methodMeta}>Default payout account</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={transitBlueColors.textMuted} />
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Earnings History</Text>
          {wallet.transactions.map((txn) => (
            <View key={txn.id} style={styles.txnRow}>
              <View style={styles.methodIcon}>
                <Ionicons
                  name={txn.kind === 'credit' ? 'cube-outline' : 'arrow-up-outline'}
                  size={17}
                  color={txn.kind === 'credit' ? transitBlueColors.success : transitBlueColors.primary}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.methodLabel}>{txn.label}</Text>
                <Text style={styles.methodMeta}>{new Date(txn.createdAt).toLocaleDateString('en-NG', { month: 'short', day: 'numeric' })}</Text>
              </View>
              <Text style={[styles.txnAmount, txn.kind === 'credit' && { color: transitBlueColors.success }]}>
                {txn.kind === 'credit' ? '+' : '-'}{formatNaira(txn.amount)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: transitBlueColors.background },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: transitBlueColors.background },
  header: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 8 },
  title: { fontSize: 22, fontWeight: '800', color: transitBlueColors.textPrimary },
  body: { paddingHorizontal: 20, gap: 20, paddingBottom: 20 },
  balanceCard: { borderRadius: 22, padding: 22 },
  balanceLabel: { color: '#fff', opacity: 0.8, fontSize: 12 },
  balanceValue: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 6 },
  withdrawButton: { backgroundColor: transitBlueColors.accent, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 20 },
  withdrawText: { color: '#10182B', fontWeight: '700', fontSize: 13.5 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: transitBlueColors.textPrimary, marginBottom: 10 },
  manageLink: { fontSize: 12, color: transitBlueColors.primary, fontWeight: '600' },
  methodRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: transitBlueColors.surface, borderWidth: 1, borderColor: transitBlueColors.border,
    borderRadius: transitBlueRadii.lg, padding: 14,
  },
  methodIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: transitBlueColors.surfaceTint, alignItems: 'center', justifyContent: 'center' },
  methodLabel: { fontSize: 13, fontWeight: '600', color: transitBlueColors.textPrimary },
  methodMeta: { fontSize: 11, color: transitBlueColors.textSecondary },
  txnRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: transitBlueColors.border },
  txnAmount: { fontSize: 13, fontWeight: '700', color: transitBlueColors.textPrimary },
});
