import { Form, useLoaderData } from "@remix-run/react";
import webpush from "web-push";
import { ActionFunction, LoaderFunction, json } from "@remix-run/node";
import { WebPushSubscription } from "~/models/WebPushSubscription";

export const loader: LoaderFunction = async () => {
  return json({
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY,
  });
};

export const action: ActionFunction = async ({ request }) => {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_MAILTO}`,
    process.env.VAPID_PUBLIC_KEY || "",
    process.env.VAPID_PRIVATE_KEY || ""
  );

  const subscriptionData = await request.json();

  console.log("subscriptionData", subscriptionData);
  const cookieHeader = request.headers.get("Cookie");
  const cookies = new URLSearchParams(cookieHeader?.split("; ").join("&"));
  const userId = cookies.get("userId");

  if (!userId) {
    return json({ error: "User not authenticated" }, { status: 401 });
  }

  const subscription = await WebPushSubscription.create({
    userId: userId,
    endpoint: subscriptionData.endpoint,
    keys: subscriptionData.keys,
  });

  webpush.sendNotification(
    subscriptionData,
    JSON.stringify({
      title: "Success!",
      body: "You have successfully subscribed to push notifications",
    })
  );

  return {};
};

export default function SubscribeNotifications() {
  const { vapidPublicKey } = useLoaderData<typeof loader>();

  const handleSubscribe = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if ("serviceWorker" in navigator && "PushManager" in window) {
      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: vapidPublicKey,
        });

        const response = await fetch("/notifications/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(subscription),
        });

        if (response.ok) {
          console.log("Push notification subscription successful");
        } else {
          console.error("Failed to subscribe to push notifications");
        }
      } catch (error) {
        console.error("Error subscribing to push notifications:", error);
      }
    } else {
      console.error("Push notifications are not supported in this browser");
    }
  };

  return (
    <Form onSubmit={handleSubscribe}>
      <button type="submit">Subscribe to Push Notifications</button>
    </Form>
  );
}
