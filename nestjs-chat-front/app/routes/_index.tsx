import type {type ActionFunctionArgs} from "@remix-run/node";
import {Form} from "@remix-run/react";
import {fetch} from "@remix-run/web-fetch";
import { z } from 'zod';
import {authenticateUser} from "~/session.server"
import {useOptionalUser} from "~/root";
import {Button, buttonVariants, VariantButton} from "~/components/ui/button";
import {tokenSchema} from "~/routes/register";
import { json } from "@remix-run/node";
import {useActionData} from "react-router";
import type {ActionFeedback} from "~/components/FeedbackComponent";
import {AlertFeedback} from "~/components/FeedbackComponent";

const loginSchema = z.object({
    email: z.string(),
    password: z.string(),
});

export const action = async ({ request }: ActionFunctionArgs) => {
    try {
        const formData = await request.formData();
        const jsonData = Object.fromEntries(formData);
        const parsedJson = loginSchema.parse(jsonData);

        const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: 'POST',
            body: JSON.stringify(parsedJson),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('response', response);
        const { error, message, access_token } = tokenSchema.parse(
            await response.json()
        );

        if (error && message) {
            return json<ActionFeedback>({ error, message });
        } else if (access_token) {
            return await authenticateUser({
                request,
                userToken: access_token,
            });
        }
        throw new Error('Unexpected error');
    } catch (error) {
        const err = error as Error;
        return json<ActionFeedback>({
            error: true,
            message: err.message,
        });
    }
};
export default function Index() {
    const user = useOptionalUser();
    const isConnected = user !== null;
    return (
        <div className="font-sans p-4">
            {isConnected ? <h1 className="text-3xl">Welcome {user.firstName}</h1> : <LoginForm/>}
        </div>
    );
}

const LoginForm = () => {
    const formFeedback = useActionData() as ActionFeedback | undefined;
    return (
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
                <AlertFeedback  feedback={formFeedback}/>
                <div className="w-full px-3">
                    <Button
                        variant='outline'
                        size='lg'
                        type="submit"
                    >
                        Validate
                    </Button>
                </div>
                <Button variant="outline" size="lg" color="success"> Outline</Button>
                <Button variant="outline" size="sm" color="danger"> Outline</Button>
                <Button variant="outline" size='medium' color="base"> Outline</Button>
            </div>
        </Form>
    )
}