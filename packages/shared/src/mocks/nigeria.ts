import type { Address, Driver, Order, User, Wallet } from '../types';

// Default map region for the Home screen — centred on Lagos, the primary launch city.
export const DEFAULT_MAP_REGION = {
  latitude: 6.5244,
  longitude: 3.3792,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export const LAGOS_ADDRESSES: Address[] = [
  {
    id: 'addr-home',
    label: 'Home',
    line1: '14 Admiralty Way',
    area: 'Lekki Phase 1',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    latitude: 6.4415,
    longitude: 3.4638,
  },
  {
    id: 'addr-work',
    label: 'Work',
    line1: '5 Adeola Odeku Street',
    area: 'Victoria Island',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    latitude: 6.4281,
    longitude: 3.4219,
  },
  {
    id: 'addr-3',
    label: 'Mum\'s Place',
    line1: '22 Allen Avenue',
    area: 'Ikeja',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    latitude: 6.6018,
    longitude: 3.3515,
  },
  {
    id: 'addr-4',
    label: 'Studio',
    line1: '8 Herbert Macaulay Way',
    area: 'Yaba',
    city: 'Lagos',
    state: 'Lagos State',
    country: 'Nigeria',
    latitude: 6.5095,
    longitude: 3.3711,
  },
];

export const MOCK_CUSTOMER: User = {
  id: 'user-1',
  role: 'customer',
  fullName: 'Jordan Reyes',
  email: 'jordan.reyes@email.com',
  phone: '+2348012345678',
  avatarInitials: 'JR',
  rating: 4.9,
  createdAt: '2025-03-01T09:00:00Z',
};

export const MOCK_DRIVER: Driver = {
  id: 'driver-1',
  role: 'driver',
  fullName: 'Chidi Okafor',
  email: 'chidi.okafor@email.com',
  phone: '+2348098765432',
  avatarInitials: 'CO',
  rating: 4.8,
  createdAt: '2025-01-15T09:00:00Z',
  vehicleType: 'bike',
  vehiclePlate: 'LND 442 XA',
  isOnline: true,
  totalDeliveries: 312,
};

export const MOCK_ORDER: Order = {
  id: 'DP-48291',
  customerId: 'user-1',
  driverId: 'driver-1',
  pickup: LAGOS_ADDRESSES[0],
  dropoff: LAGOS_ADDRESSES[1],
  status: 'in_transit',
  statusHistory: [
    { status: 'placed', label: 'Order Placed', timestamp: '2026-09-20T14:02:00Z' },
    { status: 'picked_up', label: 'Picked Up', timestamp: '2026-09-20T14:34:00Z' },
    { status: 'in_transit', label: 'In Transit', timestamp: '2026-09-20T14:40:00Z' },
    { status: 'out_for_delivery', label: 'Out for Delivery', timestamp: null },
    { status: 'delivered', label: 'Delivered', timestamp: null },
  ],
  fee: 120000, // NGN 1,200.00
  currency: 'NGN',
  confirmationCode: '7429',
  etaMinutes: 26,
  createdAt: '2026-09-20T14:02:00Z',
};

export const MOCK_WALLET: Wallet = {
  balance: 1284000, // NGN 12,840.00
  currency: 'NGN',
  paymentMethods: [
    { id: 'pm-1', type: 'card', label: 'Verve •••• 4291', isDefault: true },
    { id: 'pm-2', type: 'bank_transfer', label: 'GTBank •••• 2210', isDefault: false },
  ],
  transactions: [
    {
      id: 'txn-1',
      kind: 'debit',
      label: 'Delivery fee — Pkg #4821',
      amount: 120000,
      currency: 'NGN',
      createdAt: '2026-09-20T14:14:00Z',
      relatedOrderId: 'DP-48291',
    },
    {
      id: 'txn-2',
      kind: 'credit',
      label: 'Wallet top-up (Paystack)',
      amount: 500000,
      currency: 'NGN',
      createdAt: '2026-09-19T09:02:00Z',
    },
    {
      id: 'txn-3',
      kind: 'credit',
      label: 'Refund — Pkg #4790',
      amount: 42000,
      currency: 'NGN',
      createdAt: '2026-03-12T11:00:00Z',
    },
  ],
};
