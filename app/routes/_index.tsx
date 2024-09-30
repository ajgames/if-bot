import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
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
      <h1 className="text-3xl">Welcome to If Bot</h1>
      {user ? <h1>Hello, {user.email}</h1> : <Link to={"/google/auth"} className="text-blue-700 underline visited:text-purple-900">Auth, bro</Link>}
    </div>
  );
}
