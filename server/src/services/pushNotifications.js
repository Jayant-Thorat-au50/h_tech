import webpush from 'web-push';
import { env } from '../config/env.js';
import { PushSubscription } from '../models/PushSubscription.js';

let configured = false;

const configureWebPush = () => {
  if (configured) return true;
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return false;

  webpush.setVapidDetails(
    env.VAPID_SUBJECT,
    env.VAPID_PUBLIC_KEY,
    env.VAPID_PRIVATE_KEY
  );
  configured = true;
  return true;
};

export const getVapidPublicKey = () =>
  configureWebPush() ? env.VAPID_PUBLIC_KEY : null;

export const sendPushNotification = async ({ title, body, url }) => {
  if (!configureWebPush()) {
    console.warn('Push notification skipped: VAPID keys are not configured.');
    return;
  }

  const subscriptions = await PushSubscription.find().lean();
  const results = await Promise.allSettled(
    subscriptions.map((subscription) =>
      webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
        },
        JSON.stringify({ title, body, url })
      )
    )
  );

  const staleEndpoints = [];
  let failedDeliveries = 0;
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') return;

    const statusCode = result.reason?.statusCode;
    if (statusCode === 404 || statusCode === 410) {
      staleEndpoints.push(subscriptions[index].endpoint);
      return;
    }
    failedDeliveries += 1;
    console.error('Push notification delivery failed.', {
      statusCode,
      message: result.reason?.message,
    });
  });

  if (staleEndpoints.length > 0) {
    await PushSubscription.deleteMany({ endpoint: { $in: staleEndpoints } });
  }
  if (failedDeliveries > 0) {
    console.error(`Push notification failed for ${failedDeliveries} subscription(s).`);
  }
};
