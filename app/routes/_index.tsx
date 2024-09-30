import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "If Bot" },
    { name: "description", content: "If Bot landing page. Usually you won't be hitting this route directly, but it's the first page that loads when you hit the website." },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to If Bot</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <Link to={"/google/auth"}
            className="text-blue-700 underline visited:text-purple-900"
          >
            Auth, bro
          </Link>
        </li>
 
      </ul>
    </div>
  );
}
