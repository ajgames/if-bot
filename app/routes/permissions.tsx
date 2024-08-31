import { useEffect, useRef, useState, useTransition } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";


export const loader: LoaderFunction = async () => {
  return {
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY
  };
};

/**
 * // 1. listen for push via the service worker
 * // 2. load the service worker itself from the or near the app root
 */


export default function NotificationsPage() {
  const { vapidPublicKey } = useLoaderData<typeof loader>();

  let clientWindow = null;
  if (typeof document !== "undefined") {
    clientWindow = window;
  }

  const serviceWorkerRef = useRef<ServiceWorkerRegistration | null>(null);

  // pedantic, but f' it, 
  // start up the service worker
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", async () => {
        serviceWorkerRef.current = await navigator.serviceWorker
          .register("/service-worker.js");
      });
    }
  }, []);

  const [isGranted, setIsGranted] = useState(false) //clientWindow?.Notification?.permission === "granted");
  const transition = useTransition();

  /**
   * vapid key garbage -adam
   */
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  const handlePermissionRequest = async () => {
    // if (clientWindow?.Notification?.permission === "default") {
      const permission = await clientWindow?.Notification?.requestPermission();
      setIsGranted(permission === "granted");

      if (permission === "granted" && serviceWorkerRef.current) {
        const subscription = await serviceWorkerRef.current.pushManager.subscribe({
          applicationServerKey: urlBase64ToUint8Array(
            vapidPublicKey
          ),
          userVisibleOnly: true,
        });
  
        await fetch("/notifications/subscribe", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });
      }
    // }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-2xl font-semibold mb-4 text-gray-900">Enable Push Notifications</h1>
        <p className="text-gray-700 mb-6">
          We'd like to send you notifications so you don't miss out on any updates!
        </p>
        {isGranted ? (
          <p className="text-green-500">Notifications are enabled! Now just save to your</p>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            onClick={handlePermissionRequest}
            disabled={transition.state === "submitting"}
          >
            {transition.state === "submitting" ? "Requesting..." : "Enable Notifications"}
          </button>
        )}
      </div>
    </div>
  );
}
