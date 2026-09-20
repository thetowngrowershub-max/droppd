export type UserRole = 'customer' | 'driver';

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Work"
  line1: string;
  area: string; // e.g. "Lekki Phase 1"
  city: string; // e.g. "Lagos"
  state: string; // e.g. "Lagos State"
  country: 'Nigeria';
  latitude: number;
  longitude: number;
}

export interface User {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  phone: string; // E.164, e.g. +2348012345678
  avatarInitials: string;
  rating: number;
  createdAt: string;
}

export interface Driver extends User {
  role: 'driver';
  vehicleType: 'bike' | 'car' | 'van';
  vehiclePlate: string;
  isOnline: boolean;
  totalDeliveries: number;
}

export type OrderStatus =
  | 'placed'
  | 'picked_up'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderStatusEvent {
  status: OrderStatus;
  label: string;
  timestamp: string | null; // null = not yet reached
}

export interface Order {
  id: string; // e.g. "DP-48291"
  customerId: string;
  driverId: string | null;
  pickup: Address;
  dropoff: Address;
  status: OrderStatus;
  statusHistory: OrderStatusEvent[];
  fee: number; // in kobo (NGN minor unit) — see utils/currency
  currency: 'NGN';
  confirmationCode: string; // 4-digit code shown to customer, entered by driver on delivery
  etaMinutes: number;
  createdAt: string;
}

export type PaymentMethodType = 'card' | 'bank_transfer' | 'ussd';

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string; // e.g. "Verve •••• 4291"
  isDefault: boolean;
}

export type WalletTransactionKind = 'debit' | 'credit';

export interface WalletTransaction {
  id: string;
  kind: WalletTransactionKind;
  label: string;
  amount: number; // kobo
  currency: 'NGN';
  createdAt: string;
  relatedOrderId?: string;
}

export interface Wallet {
  balance: number; // kobo
  currency: 'NGN';
  paymentMethods: PaymentMethod[];
  transactions: WalletTransaction[];
}

export type DevicePlatform = 'ios' | 'android';

export interface DeviceToken {
  userId: string;
  token: string;
  platform: DevicePlatform;
  registeredAt: string;
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  user: User;
  expiresAt: string;
}
