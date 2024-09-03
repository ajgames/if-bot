#Getting Started

You’ll need to create a .env file in our Remix server off the ground.

1. GOOGLE_PUB_SUB_TOPIC: This is related to Google Cloud Pub/Sub. If you’re using Google Pub/Sub (likely for most
   installs), you need to create a topic in the Google Cloud Console and then copy the topic name or ID here.
2. BASE_URL: This is the base URL of your application. If you’re running locally, it might be something
   like http://localhost:3000. For production, it would be your domain, like https://yourdomain.com.
3. VAPID_PUBLIC_KEY: This key is used for Web Push Notifications. You need to generate this using a tool like web-push
   or another VAPID key generation tool.
4. VAPID_MAILTO: This is your email address used in VAPID key configuration. It should be in the format mailto:
   your-email@example.com.
5. VAPID_PRIVATE_KEY: This is the private key counterpart to your VAPID public key, used for Web Push Notifications.
6. GOOGLE_CLIENT_ID: This is the OAuth 2.0 Client ID from Google. You can get this by setting up OAuth credentials in
   the Google Cloud Console.
7. GOOGLE_API_KEY: (do we need this one?) This is your Google API key, which you can generate in the Google Cloud
   Console.
8. GOOGLE_CLIENT_SECRET: This is the client secret associated with your Google OAuth 2.0 credentials.
9. MONGO_DB_URL: This is a connection string to a Mongo database.

## Steps to Obtain These Values

1. Google Pub/Sub Topic:

- Go to the Google Cloud Console.
- Navigate to Pub/Sub.
- Create a new topic and use the name or ID here.

2. OAuth 2.0 Client ID and Secret:

- In the Google Cloud Console, go to the APIs & Services > Credentials page.
- Create or select an existing OAuth 2.0 Client ID.
- Copy the Client ID and Secret.

3. VAPID Keys:

- If you don’t already have VAPID keys, you can generate them using a tool like web-push:

```bash
npx web-push generate-vapid-keys
```

4. Google API Key:

- In the Google Cloud Console, go to the APIs & Services > Credentials page.
- Create a new API key.

Once you have all these values, put them in your .env file, and your server should be able to start up correctly with
the necessary environment variables.

5. Mongo connection string:

- You can host it locally or head over to Mongo Atlas and start a free server, create a user, and get a string (make
  sure to whitelist your IP).

```env
GOOGLE_PUB_SUB_TOPIC=projects/{project-name}/topics/incoming-user-emails
BASE_URL=http://localhost:2048
VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_MAILTO=mailto:your-email@example.com
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_API_KEY=your_google_api_key
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGO_DB_URL=your_connection_string
```

If you’re still missing some information... yikes, we probably forgot to update the docs somewhere along the way. 