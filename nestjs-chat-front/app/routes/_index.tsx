import type {type ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {Form} from "@remix-run/react";
import {json} from "@remix-run/node";
import {fetch} from "@remix-run/web-fetch";
import { z } from 'zod';
import {useLoaderData} from "react-router";
import {commitUserToken, getUserToken} from "~/session.server"

const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const tokenSchema = z.object({
   access_token: z.string(),
});

export const loader = async ({request}: LoaderFunctionArgs) => {
    const userToken = await getUserToken({request});
    const isLoggedIn = Boolean(userToken);
    return json({isLoggedIn});
}
export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
   const jsonData = Object.fromEntries(formData);
   const parsedJson = loginSchema.parse(jsonData);
   console.log({parsedJson});
   const response = await fetch('http://localhost:8000/auth/login', {
       method: 'POST',
       body: JSON.stringify(jsonData),
       headers: {
           'Content-Type': 'application/json',
       }
   });
   console.log('response',response);
   const {access_token} = tokenSchema.parse(await response.json());
   console.log({access_token});
    return json({}, {
        headers: {
            'Set-Cookie': await commitUserToken({
                request, userToken: access_token
            }),
        }
    });
}
export default function Index() {
    const {isLoggedIn} = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
        <span>{isLoggedIn ? "👌": "✋❗️"}</span>
        <Form method="post" className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <input
                        placeholder="email"
                        className="appearance-none block w-full bg-blue-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3"
                        id="email"
                        name="email"
                        type="text"
                    />
                    <input
                        placeholder="password"
                        className="appearance-none block w-full bg-blue-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3"
                        id="password"
                        name="password"
                        type="text"
                    />
                </div>
                <div className="w-full px-3">
                    <button
                        className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow"
                        type="submit"
                    >
                        Validate
                    </button>
                </div>
            </div>
        </Form>
    </div>
  );
}
