import { google } from "googleapis";

import { LoaderFunction, redirect } from "@remix-run/node";
import { googleOauth2Client } from "~/utils/googleOauthClient";
import { User } from "~/models/User";
import { GoogleCredentials } from "~/models/GoogleCredentials";

export const loader: LoaderFunction = async ({ request }) => {
  console.log("Google Auth Callback");

  let { searchParams } = new URL(request.url);
  let code = searchParams.get("code") || "";

  const { tokens } = await googleOauth2Client.getToken(code);
  googleOauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: googleOauth2Client });

  // Get the user's email address
  console.log("Getting user info");
  const userInfo = await gmail.users.getProfile({
    userId: "me",
  });
  const email = userInfo.data.emailAddress;

  if (!email) {
    throw new Error("Failed to retrieve user email");
  }

  console.log("User email:", email);

  // Create or find the user in the database
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }

  let lastHistoryId = null;

  const response = await gmail.users.messages.list({
    userId: "me",
    maxResults: 1,
  });

  console.log("Response:", response);

  if (response.data.messages && response.data.messages.length > 0) {
    const messageId = response.data.messages[0].id;
    const message = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
    });

    console.log("Initial historyId:", message.data.historyId);
    lastHistoryId = message.data.historyId;
  }

  // Store the Google credentials
  await GoogleCredentials.updateOne(
    { userId: user._id },
    {
      userId: user._id,
      ...tokens,
      lastHistoryId,
    },
    { upsert: true, new: true }
  );

  const watchResponse = await gmail.users.watch({
    userId: "me",
    requestBody: {
      topicName: process.env.GOOGLE_PUB_SUB_TOPIC,
    },
  });

  // TODO: Some kind of state to track that they have successfully subscribed

  const cookieHeader = new Headers();
  cookieHeader.append(
    "Set-Cookie",
    `userId=${user._id.toString()}; Path=/; HttpOnly`
  );

  return redirect("/", {
    headers: cookieHeader,
  });
};
