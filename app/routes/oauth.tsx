import { useLoaderData } from "@remix-run/react";
import { useEffect } from "react"

export const loader = () => {
  return {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleApiKey: process.env.GOOGLE_API_KEY
  }
}

export default function() {
  const { googleClientId, googleApiKey } = useLoaderData<typeof loader>();

  useEffect(() => {
    async function init() {
      console.log((window as any).gapi)
      await (window as any).gapi.client.init({
        apiKey: googleApiKey,
      });
  
      const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: googleClientId,
        scope: 'https://www.googleapis.com/auth/gmail.readonly',
        callback: '', // defined later
      });
    }

    init();
  }, []);

  return <div>
    <button>Authorize</button>
  </div>
}