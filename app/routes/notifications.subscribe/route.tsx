import webpush from "web-push";
import { ActionFunction } from "@remix-run/node";

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_MAILTO}`,
  process.env.VAPID_PUBLIC_KEY || '',
  process.env.VAPID_PRIVATE_KEY || ''
)

export const action: ActionFunction = async ({ request }) => {
  const subscriptionData = await request.json();

  webpush.sendNotification(subscriptionData, JSON.stringify({title: "Hello", body: "Hello World"}));

  return {};
};
