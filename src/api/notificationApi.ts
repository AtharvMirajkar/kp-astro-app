/**
 * src/api/notificationApi.ts
 *
 * Wraps your backend notification endpoints.
 * Base URL is already set in axiosInstance.
 */

import axiosInstance from './axiosInstance'; // your existing axios instance

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SendNotificationPayload {
  deviceId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export interface SendToUserPayload {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

// ─── Send to a specific device token (used internally / for testing) ──────────

export async function sendNotificationToDevice(
  payload: SendNotificationPayload,
): Promise<void> {
  await axiosInstance.post('/api/notifications/send', payload);
}

// ─── Send to all devices of a user ───────────────────────────────────────────

export async function sendNotificationToUser(
  payload: SendToUserPayload,
): Promise<void> {
  await axiosInstance.post('/api/notifications/send-to-user', payload);
}
