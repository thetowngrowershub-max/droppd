# App Store & Google Play Readiness Checklist

Tracks the store-compliance requirements called out when this repo was scoped, plus what's implemented vs. still needed before either app can be submitted.

## ✅ Implemented in this codebase

- **Phone-based authentication** (OTP over SMS) — `apps/customer/src/screens/{PhoneEntry,OtpVerify}Screen.tsx`, `apps/driver/src/screens/{PhoneEntry,OtpVerify}Screen.tsx`, backend `POST /auth/otp/request` + `POST /auth/otp/verify`.
- **In-app account deletion**, reachable from Profile in both apps (`DeleteAccountScreen.tsx` in each app, backend `DELETE /account/me`). Satisfies Apple App Store Review Guideline 5.1.1(v) and Google Play's Account Deletion policy — deletion is self-service, in-app, and does not require contacting support.
- **Privacy Policy**, written to `docs/PRIVACY_POLICY.md` and rendered in-app (Profile → Privacy Policy in both apps), sourced from `packages/shared/src/legal/privacyPolicy.ts`.
- **Terms of Service** — `docs/TERMS_OF_SERVICE.md`.
- **Push notifications**, wired via `expo-notifications` with permission-request flow (`usePushNotifications.ts` in each app) and a backend FCM sender (`backend/src/services/push.ts`).
- **Location permission rationale strings** set in both apps' `app.json` (`NSLocationWhenInUseUsageDescription`, Android `ACCESS_FINE_LOCATION`) — required copy, not placeholder text, explaining why location is needed.
- **Currency and locale**: all amounts in NGN via `formatNaira()`, addresses and map default region localized to Lagos, Nigeria.

## 🔲 Still needed before submission

### Both apps

- [ ] **App icons and splash screens** — replace the default Expo icon; add `icon.png` (1024×1024), `adaptive-icon.png`, `splash.png` referenced from `app.json`.
- [ ] **Screenshots** for each required device size (iPhone 6.7", 6.5", iPad if supporting tablets; Android phone + 7"/10" tablet if applicable).
- [ ] **Host `docs/PRIVACY_POLICY.md` and `docs/TERMS_OF_SERVICE.md` at public URLs** — both App Store Connect and Google Play Console require live links, not files in a repo.
- [ ] **Google Maps API keys** — replace the `REPLACE_WITH_..._GOOGLE_MAPS_API_KEY` placeholders in both apps' `app.json` with real keys from Google Cloud Console, restricted by bundle ID / package name and API (Maps SDK for Android/iOS).
- [ ] **EAS project ID** — replace `REPLACE_WITH_EAS_PROJECT_ID` in both `app.json` files after running `eas init`.
- [ ] **Real SMS OTP provider** — set `TERMII_API_KEY` (or swap in another Nigerian SMS provider) in the backend; without it, OTPs only log to the server console.
- [ ] **Firebase project for push** — create one, download the service-account JSON, set `FIREBASE_SERVICE_ACCOUNT_PATH` (or `_JSON`) in the backend `.env`, and add `google-services.json` / `GoogleService-Info.plist` to each app for FCM.
- [ ] **App Store Connect "App Privacy" nutrition label / Google Play "Data Safety" form** — fill these out to match `docs/PRIVACY_POLICY.md` §2 (account info, location, payment references, device/push token, usage data). Mismatches between the declared label and actual behavior are a common rejection reason.
- [ ] **App Review demo access** — reviewers can't receive a real Nigerian SMS. Provide a reviewer note in App Store Connect / Play Console with a demo phone number the backend allowlists to a fixed, non-expiring OTP (add this allowlist to `backend/src/services/otp.ts` — do not ship it enabled for all numbers).
- [ ] **Age rating questionnaire** (both stores) — likely 4+/Everyone, but complete based on final content.
- [ ] **Payment processor go-live** — Paystack/Flutterwave dev keys work for testing; switch to live keys and complete their KYC/business verification before charging real users.

### iOS-specific

- [ ] Apple Developer Program enrollment + bundle IDs (`com.droppd.customer`, `com.droppd.driver`) registered.
- [ ] Confirm whether **Sign in with Apple** is required: Apple requires it only if the app offers a third-party social login (Google, Facebook, etc.) as an alternative sign-in method. Phone-number-only auth, as implemented here, does **not** trigger this requirement — re-check if social login is added later.
- [ ] Push notification capability + APNs key/certificate configured in Apple Developer portal and linked to the Firebase project (FCM uses APNs under the hood for iOS).
- [ ] Background location usage (Driver app) reviewed against Apple's guidelines — the app must visibly use it for the stated purpose (live delivery tracking) or Apple will reject it.

### Android-specific

- [ ] Google Play Console app listing + Data Safety form (see above).
- [ ] `POST_NOTIFICATIONS` runtime permission (Android 13+) is requested by `expo-notifications` automatically, but verify the prompt copy in testing.
- [ ] Target API level meets Google Play's current minimum (checked automatically by EAS Build against the Expo SDK in use).

## Build & submit (once the above is complete)

```bash
npm install -g eas-cli
cd apps/customer && eas init && eas build --platform all
cd apps/driver && eas init && eas build --platform all

# after builds pass review internally:
eas submit --platform ios
eas submit --platform android
```
