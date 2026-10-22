import React, { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { apiClient, extractErrorMessage } from '../../utils/apiClient.js';

const toApplicationServerKey = (key) => {
  const paddedKey = key + '='.repeat((4 - (key.length % 4)) % 4);
  const base64 = paddedKey.replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from(rawData, (character) => character.charCodeAt(0));
};

export default function PushNotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    if (
      !('Notification' in window) ||
      !('PushManager' in window) ||
      !('serviceWorker' in navigator)
    ) {
      return;
    }

    if (Notification.permission === 'denied') return;
    if (Notification.permission === 'granted') {
      const restoreSubscription = async () => {
        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          const { data } = await apiClient.get('/notifications/vapid-public-key');
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: toApplicationServerKey(data.publicKey),
          });
        }
        await apiClient.post('/notifications/subscriptions', subscription.toJSON());
      };
      restoreSubscription().catch((error) => {
        console.error('Could not restore browser push subscription.', error);
      });
      return;
    }

    setVisible(localStorage.getItem('htech-push-banner-dismissed') !== 'true');
  }, []);

  const dismiss = () => {
    localStorage.setItem('htech-push-banner-dismissed', 'true');
    setVisible(false);
  };

  const enableNotifications = async () => {
    setIsSubscribing(true);
    setMessage('');
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setMessage(
          permission === 'denied'
            ? 'Notifications are blocked in your browser settings.'
            : 'Please allow notifications to subscribe.'
        );
        return;
      }

      const { data } = await apiClient.get('/notifications/vapid-public-key');
      const registration = await navigator.serviceWorker.ready;
      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: toApplicationServerKey(data.publicKey),
        });
      }
      await apiClient.post('/notifications/subscriptions', subscription.toJSON());
      setMessage('You are subscribed to new product and offer alerts.');
    } catch (error) {
      setMessage(
        extractErrorMessage(error, 'Could not enable notifications. Please try again.')
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="mx-auto mt-5 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left text-white shadow-lg backdrop-blur">
      <Bell className="h-5 w-5 shrink-0 text-orange-200" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">Get new product and offer alerts</p>
        <p className="text-xs text-white/75">
          {message || 'Allow browser notifications so you know when something new is added.'}
        </p>
      </div>
      {message.startsWith('You are subscribed') ? (
        <button
          type="button"
          onClick={dismiss}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1D1D1F]"
        >
          Done
        </button>
      ) : (
        <button
          type="button"
          onClick={enableNotifications}
          disabled={isSubscribing}
          className="shrink-0 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#1D1D1F] disabled:opacity-60"
        >
          {isSubscribing ? 'Enabling…' : 'Enable'}
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss notification prompt"
        className="shrink-0 rounded-full p-1 text-white/75 hover:bg-white/10 hover:text-white"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
