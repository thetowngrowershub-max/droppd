import fs from 'node:fs';

import admin from 'firebase-admin';

import { env } from '../env';

let app: admin.app.App | null = null;

function getApp(): admin.app.App | null {
  if (app) return app;

  let credential: admin.credential.Credential | null = null;
  if (env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    credential = admin.credential.cert(JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON));
  } else if (env.FIREBASE_SERVICE_ACCOUNT_PATH && fs.existsSync(env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
    credential = admin.credential.cert(
      JSON.parse(fs.readFileSync(env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf-8')),
    );
  }

  if (!credential) {
    console.warn('[push] No Firebase service account configured — push notifications will be logged, not sent. See backend/.env.example.');
    return null;
  }

  app = admin.initializeApp({ credential });
  return app;
}

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Sends a push notification to one device token via Firebase Cloud Messaging.
 * Expo push tokens (ExponentPushToken[...]) must instead go through Expo's
 * push API (https://exp.host/--/api/v2/push/send) unless the app has been
 * configured to use FCM directly for native push — see Expo's docs on
 * "Using FCM for push notifications" before wiring this in production.
 */
export async function sendPushToDevice(token: string, payload: PushPayload): Promise<void> {
  const firebaseApp = getApp();
  if (!firebaseApp) {
    console.log(`[push] (not sent — no Firebase credentials) to=${token} title="${payload.title}" body="${payload.body}"`);
    return;
  }

  await admin.messaging(firebaseApp).send({
    token,
    notification: { title: payload.title, body: payload.body },
    data: payload.data,
  });
}
