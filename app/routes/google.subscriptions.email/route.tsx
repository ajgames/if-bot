import webpush from "web-push";
import { google } from "googleapis";
import { googleOauth2Client } from "~/utils/googleOauthClient";
import { LoaderFunction } from "@remix-run/node";
import { GoogleCredentials } from "~/models/GoogleCredentials";
import { User } from "~/models/User";
import { WebPushSubscription } from "~/models/WebPushSubscription";
import { checkEmailImportance } from "~/ai/ai";

export const action: LoaderFunction = async ({ request }) => {
  console.log("EMAIL SUBSCRIPTION");

  const body = await request.json();

  const { message } = body;

  const { data, messageId } = message;

  console.log("Message:", message);

  const decodedData = Buffer.from(data, "base64").toString("utf-8");

  const { emailAddress } = JSON.parse(decodedData);

  // Find the user by email
  const user = await User.findOne({ email: emailAddress });

  if (!user) {
    console.error(`User not found for email: ${emailAddress}`);
    return { status: 404, body: "User not found" };
  }

  // Get the user's Google credentials
  const googleCredentials = await GoogleCredentials.findOne({
    userId: user._id,
  });

  if (!googleCredentials) {
    console.error(`Google credentials not found for user: ${user._id}`);
    return { status: 404, body: "Google credentials not found" };
  }

  const gmail = google.gmail({ version: "v1", auth: googleOauth2Client });
  googleOauth2Client.setCredentials(googleCredentials);

  try {
    // Fetch the history since the last processed historyId
    const historyResponse = await gmail.users.history.list({
      userId: "me",
      startHistoryId: googleCredentials.lastHistoryId,
    });

    console.log("History Response:", historyResponse.data.historyId);

    const history = historyResponse.data.history || [];

    // Process each history item
    for (const item of history) {
      if (item.messagesAdded) {
        for (const messageAdded of item.messagesAdded) {
          const messageId = messageAdded.message.id;

          // Fetch the full message details
          const messageResponse = await gmail.users.messages.get({
            userId: "me",
            id: messageId,
          });

          const message = messageResponse.data;
          // Process the message here
          // Extract subject from headers
          const subject =
            message.payload.headers.find(
              (header) => header.name.toLowerCase() === "subject"
            )?.value || "No Subject";

          // Extract body
          let body = "";
          if (message.payload.parts) {
            // If the message has parts, find the text/plain part
            const textPart = message.payload.parts.find(
              (part) => part.mimeType === "text/plain"
            );
            if (textPart && textPart.body) {
              body = Buffer.from(textPart.body.data, "base64").toString(
                "utf-8"
              );
            }
          } else if (message.payload.body && message.payload.body.data) {
            // If the message doesn't have parts, the body is directly in the payload
            body = Buffer.from(message.payload.body.data, "base64").toString(
              "utf-8"
            );
          }

          console.log(`New message received - Subject: ${subject}`);
          console.log(`Message body: ${body}`);

          // Add your further message processing logic here
          const subscription = await WebPushSubscription.findOne({
            userId: user._id,
          });

          if (subscription) {
            webpush.setVapidDetails(
              `mailto:${process.env.VAPID_MAILTO}`,
              process.env.VAPID_PUBLIC_KEY || "",
              process.env.VAPID_PRIVATE_KEY || ""
            );

            const importance = await checkEmailImportance({ subject });

            if (importance.notifyImmediately) {
              console.log("Notifying immediately", subject, importance);
              await webpush.sendNotification(
                subscription,
                JSON.stringify({
                  title:
                    subject.length > 50
                      ? subject.slice(0, 47) + "..."
                      : subject,
                  body: body.length > 180 ? body.slice(0, 177) + "..." : body,
                })
              );
            } else {
              console.log("Not notifying immediately", subject, importance);
            }
          }
        }
      }
    }

    await GoogleCredentials.updateOne(
      { userId: user._id },
      { $set: { lastHistoryId: historyResponse.data.historyId } }
    );
  } catch (error) {
    console.error("Error processing email history:", error);
    return { status: 500, body: "Error processing email history" };
  }

  return { status: 200, body: "Email processed successfully" };
};
