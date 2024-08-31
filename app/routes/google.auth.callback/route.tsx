import { google } from "googleapis";

import { LoaderFunction, redirect } from "@remix-run/node";
import { googleOauth2Client } from "~/utils/googleOauthClient";


export const loader: LoaderFunction = async ({ request }) => {
  let { searchParams } = new URL(request.url);
  let code = searchParams.get("code") || "";

  const { tokens } = await googleOauth2Client.getToken(code);
  googleOauth2Client.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: googleOauth2Client });

  gmail.users.watch()

  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: 5, // Number of emails to fetch
    q: '', // Empty query to fetch all emails
  });

  console.log(res.data);

  return redirect("/");
};
