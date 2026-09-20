# droppd

Package pickup & delivery in Nigeria — native Customer and Driver apps, plus the backend API behind them.

## Repository layout

```
apps/
  customer/     React Native (Expo) app — Customers place, pay for, and track deliveries
  driver/       React Native (Expo) app — Drivers see nearby jobs, deliver, and get paid
packages/
  shared/       Theme, types, Nigeria-localized mock data, API client contract, Privacy Policy content
backend/        Express + TypeScript + Prisma API (Postgres), JWT auth, push notifications
docs/
  PRIVACY_POLICY.md         Canonical policy text — also rendered in-app
  TERMS_OF_SERVICE.md
  APP_STORE_READINESS.md    What's done vs. still needed before App Store / Play Store submission
```

Both apps currently run on **mock/local data** (`packages/shared/src/api/mockApi.ts`) so you can click through every screen — auth, home/map, wallet, tracking, profile, account deletion — without the backend running. Screens call the `Api` interface (`packages/shared/src/api/types.ts`), so swapping in the real backend later is a one-line change per app (point it at an `httpApi` implementation instead of `mockApi`), not a rewrite.

## Theme

Both apps use **Transit Blue**, the theme selected from the design exploration canvas — see `packages/shared/src/theme/transitBlue.ts` for the ported color, spacing, and typography tokens.

## Quick start

### Prerequisites

- Node.js 18+
- npm 9+ (workspaces)
- Expo Go app on your phone, or an iOS/Android simulator, for running the mobile apps
- Docker (optional, for the backend's Postgres database)

### Install

```bash
npm install
```

### Run the Customer app (mock data, no backend needed)

```bash
npm run customer
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator.

### Run the Driver app (mock data, no backend needed)

```bash
npm run driver
```

### Run the backend

```bash
cp backend/.env.example backend/.env
# edit backend/.env — at minimum set JWT_SECRET and JWT_REFRESH_SECRET to random strings

docker compose up -d          # starts Postgres on localhost:5432
npm run backend:migrate       # applies the Prisma schema
npm run backend                # starts the API on http://localhost:4000
```

See `backend/.env.example` for optional integrations (Termii for real SMS OTP, Firebase for real push notifications, Paystack for real payments) — without them, OTPs log to the server console and push notifications log instead of sending, which is enough for local development.

## What's implemented

- **Auth**: phone number + OTP (Nigerian numbers, `+234` E.164 format), matching how most Nigerian consumer apps authenticate. See `docs/APP_STORE_READINESS.md` for the reviewer-access note this requires before App Store submission.
- **Live map & location**: `react-native-maps` (Google Maps provider), defaulting to Lagos; "use current location" via `expo-location`.
- **Wallet / Earnings**: NGN balances and transaction history for Customers (Wallet) and Drivers (Earnings), formatted with `Intl.NumberFormat('en-NG', { currency: 'NGN' })`.
- **Package tracking**: status timeline (Placed → Picked Up → In Transit → Out for Delivery → Delivered) and a 4-digit delivery confirmation code the customer shares and the driver enters to complete a delivery.
- **Customer profile & Driver profile**: edit profile, and — required for App Store / Play Store approval — **Delete Account**, reachable from Profile in both apps, with a clear explanation of what's deleted vs. retained.
- **Privacy Policy**: in-app screen plus a hostable Markdown doc, single-sourced from `packages/shared/src/legal/privacyPolicy.ts`.
- **Push notifications**: permission request + Expo push token registration in both apps (`usePushNotifications.ts`), with a backend FCM sender ready to wire to real order events (driver assigned, delivered, new job nearby).

## Next steps

See `docs/APP_STORE_READINESS.md` for the full checklist — icons, screenshots, real Google Maps/Firebase/SMS/payment provider keys, and store-listing compliance items still need real credentials before either app can ship.
