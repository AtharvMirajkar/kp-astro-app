/**
 * src/api/notificationApi.ts
 *
 * Matches your backend exactly:
 *   POST /api/notifications/send
 *   POST /api/notifications/send-to-user
 *   POST /api/notifications/broadcast
 *
 * All calls use axiosInstance (Bearer token auto-attached via interceptor).
 */

import axiosInstance from './axiosInstance';

// ─── Types matching your backend schema ───────────────────────────────────────

/** POST /api/notifications/send — send to a specific device token */
export interface SendToDevicePayload {
  deviceId: string; // FCM token stored in UserBirthDetail.deviceId
  title: string;
  body: string;
  data?: Record<string, string>; // optional deep-link data e.g. { screen: 'FuturePredictions' }
}

/** POST /api/notifications/send-to-user — send to all devices of a MongoDB user */
export interface SendToUserPayload {
  userId: string; // MongoDB _id from UserBirthDetail
  title: string;
  body: string;
  data?: Record<string, string>;
}

/** POST /api/notifications/broadcast — send to ALL registered devices */
export interface BroadcastPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/** PATCH /api/users/fcm-token — update FCM token for a device on refresh */
export interface UpdateFCMTokenPayload {
  deviceId: string;
  fcmToken: string;
}

export async function updateFCMTokenOnBackend(
  payload: UpdateFCMTokenPayload,
): Promise<void> {
  await axiosInstance.patch('/api/users/fcm-token', payload);
}

/**
 * Send notification to a specific device by its FCM token (deviceId).
 * Use this for targeted per-device messages.
 */
export async function sendNotificationToDevice(
  payload: SendToDevicePayload,
): Promise<void> {
  await axiosInstance.post('/api/notifications/send', payload);
}

/**
 * Send notification to all devices belonging to a user.
 * Requires the MongoDB _id returned from POST /api/users (stored as userRecordId in Redux).
 */
export async function sendNotificationToUser(
  payload: SendToUserPayload,
): Promise<void> {
  await axiosInstance.post('/api/notifications/send-to-user', payload);
}

/**
 * Broadcast notification to ALL registered devices.
 * Use for app-wide announcements only.
 */
export async function broadcastNotification(
  payload: BroadcastPayload,
): Promise<void> {
  await axiosInstance.post('/api/notifications/broadcast', payload);
}
