import {logout} from "~/session.server";
import {ActionFunctionArgs} from "@remix-run/node";

export const action = async ({request}: ActionFunctionArgs) => {
    return await logout({request});
}