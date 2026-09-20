import type {
  AuthSession,
  DevicePlatform,
  Driver,
  Order,
  User,
  Wallet,
} from '../types';

// Shared contract implemented by both the mock API (used for this first pass,
// screens run on local/mock data) and, later, the real HTTP client that talks
// to /backend. Screens depend only on this interface.
export interface Api {
  requestOtp(phoneE164: string): Promise<{ sent: true }>;
  verifyOtp(phoneE164: string, code: string, role: 'customer' | 'driver'): Promise<AuthSession>;

  getCurrentUser(userId: string): Promise<User | Driver>;
  updateProfile(userId: string, patch: Partial<User>): Promise<User>;
  deleteAccount(userId: string): Promise<{ deleted: true }>;

  getWallet(userId: string): Promise<Wallet>;
  topUpWallet(userId: string, amountKobo: number): Promise<Wallet>;

  getActiveOrder(customerId: string): Promise<Order | null>;
  getOrder(orderId: string): Promise<Order>;
  createOrder(input: {
    customerId: string;
    pickupAddressId: string;
    dropoffAddressId: string;
  }): Promise<Order>;

  getAvailableJobs(driverId: string): Promise<Order[]>;
  acceptJob(driverId: string, orderId: string): Promise<Order>;
  completeDelivery(orderId: string, enteredCode: string): Promise<Order>;

  registerDeviceToken(userId: string, token: string, platform: DevicePlatform): Promise<{ registered: true }>;
}
