import type { DevicePlatform, Order, User, Wallet } from '../types';
import { simulateLatency } from './client';
import { MOCK_AVAILABLE_JOBS, MOCK_CUSTOMER, MOCK_DRIVER, MOCK_ORDER, MOCK_WALLET } from '../mocks';
import { nairaToKobo } from '../utils/currency';
import type { Api } from './types';

// structuredClone isn't guaranteed on Hermes across all RN versions — use a
// JSON round-trip instead, which is fine for these plain-data mock records.
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// In-memory store, reset on app reload. Mirrors what the /backend Prisma
// models hold, so migrating a screen from mockApi to httpApi is a drop-in swap.
let wallet: Wallet = clone(MOCK_WALLET);
let activeOrder: Order | null = clone(MOCK_ORDER);
let availableJobs: Order[] = clone(MOCK_AVAILABLE_JOBS);
const users = new Map<string, User>([
  [MOCK_CUSTOMER.id, clone(MOCK_CUSTOMER)],
  [MOCK_DRIVER.id, clone(MOCK_DRIVER)],
]);

// Dev-only fixed OTP so the flow is testable without an SMS provider wired up.
const DEV_OTP = '123456';

export const mockApi: Api = {
  async requestOtp(phoneE164) {
    console.log(`[mockApi] OTP for ${phoneE164}: ${DEV_OTP} (dev stub — wire a real SMS provider e.g. Termii/Africa's Talking in production)`);
    return simulateLatency({ sent: true }, 700);
  },

  async verifyOtp(phoneE164, code, role) {
    if (code !== DEV_OTP) {
      throw new Error('Incorrect code. Try again.');
    }
    const user = role === 'driver' ? MOCK_DRIVER : MOCK_CUSTOMER;
    return simulateLatency(
      {
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
        user: { ...user, phone: phoneE164 },
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      },
      700,
    );
  },

  async getCurrentUser(userId) {
    const user = users.get(userId);
    if (!user) throw new Error('User not found');
    return simulateLatency(user, 300);
  },

  async updateProfile(userId, patch) {
    const user = users.get(userId);
    if (!user) throw new Error('User not found');
    const updated = { ...user, ...patch };
    users.set(userId, updated);
    return simulateLatency(updated, 400);
  },

  async deleteAccount(userId) {
    // In production this must cascade-delete (or anonymize, per NDPR/GDPR
    // retention rules) the user's orders, wallet, and device tokens on the
    // backend — see backend/src/routes/account.ts.
    users.delete(userId);
    return simulateLatency({ deleted: true }, 600);
  },

  async getWallet() {
    return simulateLatency(wallet, 400);
  },

  async topUpWallet(_userId, amountKobo) {
    wallet = {
      ...wallet,
      balance: wallet.balance + amountKobo,
      transactions: [
        {
          id: `txn-${Date.now()}`,
          kind: 'credit',
          label: 'Wallet top-up (Paystack)',
          amount: amountKobo,
          currency: 'NGN',
          createdAt: new Date().toISOString(),
        },
        ...wallet.transactions,
      ],
    };
    return simulateLatency(wallet, 500);
  },

  async getActiveOrder() {
    return simulateLatency(activeOrder, 300);
  },

  async getOrder(orderId) {
    const order = [activeOrder, ...availableJobs].find((o) => o?.id === orderId);
    if (!order) throw new Error('Order not found');
    return simulateLatency(order, 300);
  },

  async createOrder({ customerId, pickupAddressId, dropoffAddressId }) {
    const pickup = MOCK_CUSTOMER.id === customerId ? MOCK_ORDER.pickup : MOCK_ORDER.pickup;
    const order: Order = {
      ...clone(MOCK_ORDER),
      id: `DP-${Math.floor(40000 + Math.random() * 9000)}`,
      status: 'placed',
      confirmationCode: String(Math.floor(1000 + Math.random() * 9000)),
      fee: nairaToKobo(800 + Math.round(Math.random() * 800)),
      statusHistory: [{ status: 'placed', label: 'Order Placed', timestamp: new Date().toISOString() }],
      createdAt: new Date().toISOString(),
    };
    void pickupAddressId;
    void dropoffAddressId;
    void pickup;
    activeOrder = order;
    return simulateLatency(order, 600);
  },

  async getAvailableJobs() {
    return simulateLatency(availableJobs, 400);
  },

  async acceptJob(driverId, orderId) {
    const job = availableJobs.find((o) => o.id === orderId);
    if (!job) throw new Error('Job no longer available');
    availableJobs = availableJobs.filter((o) => o.id !== orderId);
    const accepted: Order = {
      ...job,
      driverId,
      status: 'picked_up',
      statusHistory: [
        ...job.statusHistory,
        { status: 'picked_up', label: 'Picked Up', timestamp: new Date().toISOString() },
      ],
    };
    activeOrder = accepted;
    return simulateLatency(accepted, 500);
  },

  async completeDelivery(orderId, enteredCode) {
    if (!activeOrder || activeOrder.id !== orderId) throw new Error('Order not found');
    if (enteredCode !== activeOrder.confirmationCode) {
      throw new Error('That code doesn’t match. Ask the customer to confirm their 4-digit code.');
    }
    activeOrder = {
      ...activeOrder,
      status: 'delivered',
      statusHistory: activeOrder.statusHistory.map((e) =>
        e.status === 'delivered' ? { ...e, timestamp: new Date().toISOString() } : e,
      ),
    };
    return simulateLatency(activeOrder, 500);
  },

  async registerDeviceToken(userId, token, platform: DevicePlatform) {
    console.log(`[mockApi] registered ${platform} push token for ${userId}: ${token}`);
    return simulateLatency({ registered: true }, 200);
  },
};
