import { getVapidPublicKey } from '../services/pushNotifications.js';
import { PushSubscription } from '../models/PushSubscription.js';

export const getPushPublicKey = (_req, res) => {
  const publicKey = getVapidPublicKey();
  if (!publicKey) {
    return res.status(503).json({
      message: 'Browser notifications are not configured on the server.',
    });
  }
  res.json({ publicKey });
};

export const savePushSubscription = async (req, res, next) => {
  try {
    const { endpoint, keys } = req.body || {};
    const endpointUrl =
      typeof endpoint === 'string' && URL.canParse(endpoint)
        ? new URL(endpoint)
        : null;
    if (
      !endpointUrl ||
      endpointUrl.protocol !== 'https:' ||
      endpoint.length > 4096 ||
      typeof keys?.p256dh !== 'string' ||
      typeof keys?.auth !== 'string'
    ) {
      return res.status(400).json({ message: 'A valid push subscription is required.' });
    }

    await PushSubscription.updateOne(
      { endpoint },
      { $set: { keys: { p256dh: keys.p256dh, auth: keys.auth } } },
      { upsert: true, runValidators: true }
    );
    res.status(201).json({ message: 'Browser notifications enabled.' });
  } catch (err) {
    next(err);
  }
};

export const removePushSubscription = async (req, res, next) => {
  try {
    const { endpoint } = req.body || {};
    if (
      typeof endpoint !== 'string' ||
      endpoint.length > 4096 ||
      !URL.canParse(endpoint)
    ) {
      return res.status(400).json({ message: 'A valid push endpoint is required.' });
    }
    await PushSubscription.deleteOne({ endpoint });
    res.json({ message: 'Browser notifications disabled.' });
  } catch (err) {
    next(err);
  }
};
