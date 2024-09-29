import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunction, json } from "@remix-run/node";
import { User } from "~/models/User";

export const meta: MetaFunction = () => {
  return [
    { title: "ifbot.ai" },
    {
      name: "description",
      content:
        "ifbot.ai: Intelligent push notifications powered by AI. Stay informed with personalized, timely updates delivered straight to your device.",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = new URLSearchParams(cookieHeader?.split("; ").join("&"));
  const userId = cookies.get("userId");

  if (!userId) {
    return json({ user: null });
  }

  const user = await User.findById(userId);
  return json({ user });
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div>
      {user ? <h1>Hello, {user.email}</h1> : <h1>Welcome to ifbot.ai</h1>}
    </div>
  );
}
