import { Form, useActionData } from "@remix-run/react";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { User } from "~/models/User";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");

  if (!email || typeof email !== "string") {
    return json({ error: "Email is required" }, { status: 400 });
  }

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email });
  }

  return redirect("/", {
    headers: {
      "Set-Cookie": `userId=${user._id.toString()}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    },
  });
};

export default function GoogleLogin() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <h1>Google Login</h1>
      <Form method="post">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />
        {actionData?.error && (
          <p style={{ color: "red" }}>{actionData.error}</p>
        )}
        <button type="submit">Login</button>
      </Form>
    </div>
  );
}
