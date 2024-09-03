import type {LoaderFunctionArgs} from "@remix-run/node";
import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";

import {getSession} from "~/utils/sessionStorage.server";

export async function loader({request}: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    if (session.has("userId")) {
        return json({loggedIn: true});
    }
    return json({loggedIn: false});
}

export default function LoginSuccess() {
    const {loggedIn} = useLoaderData<typeof loader>();

    return (
        <div>
            {loggedIn ? (
                <div className='text-teal-900'>You are already logged in.</div>
            ) : (
                <div className='text-read-900'>Who are you? You shouldn't be here.</div>
            )}
        </div>
    );
}