import { LoaderFunction, redirect } from "@remix-run/node";
import { googleOauth2Client } from "~/utils/googleOauthClient";

export const loader: LoaderFunction = () => {
  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/gmail.labels',
    'https://www.googleapis.com/auth/pubsub'
  ];

  const url = googleOauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    redirect_uri: `${process.env.BASE_URL}/google/auth/callback`
  });

  return redirect(url);
};
