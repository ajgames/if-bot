import { useEffect, useState, useTransition } from "react";
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";


export const loader: LoaderFunction = async () => {
  return json({});
};

/**
 * // 1. listen for push via the service worker
 * // 2. load the service worker itself from the or near the app root
 */


export default function NotificationsPage() {
  let clientWindow = null;
  if (typeof document !== "undefined") {
    clientWindow = window;
  }

  const [isGranted, setIsGranted] = useState(clientWindow?.Notification?.permission === "granted");
  const transition = useTransition();

  const handlePermissionRequest = async () => {
    if (clientWindow?.Notification?.permission === "default") {
      const permission = await clientWindow?.Notification?.requestPermission();
      setIsGranted(permission === "granted");
    }
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
