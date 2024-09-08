import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Form, useActionData, useLoaderData} from "@remix-run/react";

import {getSession, commitSession} from "~/utils/sessionStorage.server";
import {collection} from "~/utils/mongoDbClient";
import Input from "~/forms/Input";
import Button from "~/forms/Button";

async function validateCredentials(username: FormDataEntryValue | null, password: FormDataEntryValue | null): Promise<boolean | null> {
    if (username === "farquad@ifbot.ai" && password === "forFarquadAndBeyond") {
        return true
    }
    return null;
}

export async function loader({request}: LoaderFunctionArgs) {
    const fullUrl = new URL(request.url);
    await collection.metrics.insertOne({
        event: "PageView",
        uri: `${fullUrl.origin}${fullUrl.pathname}`,
        user: null,
        createdAt: new Date()
    })
    const session = await getSession(request.headers.get("Cookie"));
    if (session.has("userId")) {
        return json({loggedIn: true});
    }
    return json({loggedIn: false});
}

export async function action({request}: ActionFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");
    const success = await validateCredentials(username, password);

    if (!success) {
        return json({message: "Invalid username/password"}, {status: 401});
    }
    // Set userId in the session
    session.set("userId", 'nice');
    // Redirect to the success page with the Set-Cookie header
    return redirect("/user/auth/login/success", {
        headers: {
            "Set-Cookie": await commitSession(session),
        },
    });
}

export default function Login() {
    const {loggedIn} = useLoaderData<typeof loader>();
    const actionData = useActionData<{ message?: string, success?: boolean }>();

    return (
        <div className='flex items-start justify-center h-full pt-80'>
            {loggedIn ? (
                <div className='text-teal-900'>You are already logged in.</div>
            ) : (
                <>
                    <Form method="post">
                        {actionData?.message && <div className="text-red-700">{actionData.message}</div>}
                        <div>
                            <p>Please do sign in:</p>
                        </div>
                        <Input type="text" name="username" label='Username'
                               placeholder='farquad@ifbot.ai'/>
                        <Input type="password" name="password" label='Password'
                               placeholder='***'/>
                        <Button>Login</Button>
                    </Form>
                </>
            )}
        </div>
    );
}