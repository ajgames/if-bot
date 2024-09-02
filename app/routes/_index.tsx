import type { MetaFunction } from "@remix-run/node";
import {Link} from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "If Bot" },
    { name: "description", content: "In the beginning, intelligence created life. So, why do we think that true intelligence is that far away?" },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to If Bot.ai</h1>
      <ul>
        <li><Link className='underline text-purple-600' to={'/google/auth'}>Login Google</Link></li>
      </ul>
    </div>
  );
}
