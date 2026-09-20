import { LAGOS_ADDRESSES } from './nigeria';
import type { Order } from '../types';

// Available delivery requests shown on the Driver app's Home screen.
export const MOCK_AVAILABLE_JOBS: Order[] = [
  {
    id: 'DP-48302',
    customerId: 'user-2',
    driverId: null,
    pickup: LAGOS_ADDRESSES[2],
    dropoff: LAGOS_ADDRESSES[3],
    status: 'placed',
    statusHistory: [{ status: 'placed', label: 'Order Placed', timestamp: '2026-09-20T15:10:00Z' }],
    fee: 95000,
    currency: 'NGN',
    confirmationCode: '3018',
    etaMinutes: 18,
    createdAt: '2026-09-20T15:10:00Z',
  },
  {
    id: 'DP-48307',
    customerId: 'user-3',
    driverId: null,
    pickup: LAGOS_ADDRESSES[1],
    dropoff: LAGOS_ADDRESSES[0],
    status: 'placed',
    statusHistory: [{ status: 'placed', label: 'Order Placed', timestamp: '2026-09-20T15:22:00Z' }],
    fee: 150000,
    currency: 'NGN',
    confirmationCode: '9142',
    etaMinutes: 24,
    createdAt: '2026-09-20T15:22:00Z',
  },
];
