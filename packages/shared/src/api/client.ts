// Base URL for the real backend (see /backend). Override per-environment via
// EXPO_PUBLIC_API_URL. The mock API below (mockApi.ts) is what both apps run
// against for this first pass — swap `mockApi` for `httpApi` (not yet wired)
// once the backend is deployed, without changing any screen code, since both
// implement the same `Api` interface.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export function simulateLatency<T>(value: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
