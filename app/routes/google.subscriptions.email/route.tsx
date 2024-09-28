import { LoaderFunction } from "@remix-run/node";

export const action: LoaderFunction = async ({ request }) => {
  console.log("EMAIL SUBSCRIPTION");

  const body = await request.json();

  console.log("body", body);

  return {};
};
