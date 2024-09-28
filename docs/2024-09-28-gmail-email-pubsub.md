# 2024-09-28 Gmail Email PubSub

## Google Console Links

APIs & Services Dashboard: https://console.cloud.google.com/apis/dashboard?project=ifbot-434217

Gmail API Dashboard: https://console.cloud.google.com/apis/api/gmail.googleapis.com/metrics?project=ifbot-434217

Email PubSub: https://console.cloud.google.com/cloudpubsub/subscription/detail/email?project=ifbot-434217

Gmail API Oauth Credentials: https://console.cloud.google.com/apis/credentials/oauthclient/404014180522-ij0r67rdeg7c0fij75r5bo3kefrvpp80.apps.googleusercontent.com?project=ifbot-434217

## Subscription Message Format

```
body {
  message: {
    data: 'eyJlbWFpbEFkZHJlc3MiOiJhZGFtanBiZXJnQGdtYWlsLmNvbSIsImhpc3RvcnlJZCI6Mjc5MjY4MX0=',
    messageId: '12415664230315361',
    message_id: '12415664230315361',
    publishTime: '2024-09-28T13:29:02.738Z',
    publish_time: '2024-09-28T13:29:02.738Z'
  },
  subscription: 'projects/ifbot-434217/subscriptions/email'
}
```

## Decode Data

```
const data = Buffer.from(message.data, 'base64').toString('utf-8');
```

## Decode JSON

```json
{
  "emailAddress": "adamjpberg@gmail.com",
  "historyId": 2792681
}
```
