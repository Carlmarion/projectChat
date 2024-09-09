import type {type ActionFunctionArgs, LoaderFunctionArgs} from "@remix-run/node";
import {Form} from "@remix-run/react";
import {json, redirect} from "@remix-run/node";
import { z } from 'zod';
import {getOptionaluser} from "~/auth.server";
import {authenticateUser} from "~/session.server";
import {useActionData} from "react-router";

const registerSchema = z.object({
    email: z.string({required_error: "Email address is required"}).email({message: 'You must enter a valid email address'}),
    password: z.string({required_error:'Password is required'}).min(6, {message:'Password must be at least 6 characters long'}),
    firstName: z.string({required_error:'Please enter your name before validating 😎'}).min(2, {message:'You must enter a valid name'}),
});

export const tokenSchema = z.object({
    access_token: z.string().optional(),
    message: z.string().optional(),
    error: z.boolean().optional(),
});

export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await getOptionaluser({request});
   if(user) {
       console.log('Already connected');
      return redirect('/')
   }
    return json({});
}
export const action = async ({request}: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();
        const jsonData = Object.fromEntries(formData);
        const parsedJson = registerSchema.safeParse(jsonData);

        if(parsedJson.success === false){
            const {error} = parsedJson;

            return json({
                error: true,
                message: error.errors.map(err => err.message).join(', '),
            });
        }
        const response = await fetch('http://localhost:8000/auth/register', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('response',response);
        const {access_token, message,error} = tokenSchema.parse(await response.json());
        if(error){
            return json({
                error,
                message,
            });
        }
        if(access_token){
            return await authenticateUser({
                request,
                userToken: access_token,
            });
        }
        return json({
            error: true,
            message: 'Unexpected error',
        });
    } catch(error) {
        throw new Error(error.message);
    }
}
export default function RegisterForm() {
    const formFeedback = useActionData<typeof action>();
    return (
        <Form method="post" className="w-full max-w-lg">
            <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full px-3">
                    <input
                        placeholder="Your email"
                        className="appearance-none block w-full bg-blue-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3"
                        id="email"
                        name="email"
                        type="text"
                        required={true}
                    />
                    <input
                        placeholder="Choose a password"
                        className="appearance-none block w-full bg-blue-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3"
                        id="password"
                        name="password"
                        type="text"
                        required={true}
                    />
                    <input
                        placeholder="Your first name"
                        className="appearance-none block w-full bg-blue-100 text-gray-700 border border-gray-300 rounded py-3 px-4 mb-3"
                        id="firstName"
                        name="firstName"
                        type="text"
                        required={true}
                    />
                </div>
                {formFeedback?.message ? <span style={{color: formFeedback.error ? 'red': 'green'}}>{formFeedback.message}</span> : null}
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
    )
}

