import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  console.log("EMAIL SUBSCRIPTION");

  const body = await request.json();

  return {};
};
