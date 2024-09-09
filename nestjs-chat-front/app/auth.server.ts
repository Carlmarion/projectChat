import {fetch} from "@remix-run/web-fetch";
import {z} from "zod";
import {getUserToken, logout} from "~/session.server";



const getAuthenticatedUserSchema = z.object({
    email: z.string(),
    id: z.string(),
    firstName: z.string(),
})
export const getOptionaluser = async ({request}: {request: Request}) => {

   try {
       const userToken = await getUserToken({request});

       if(userToken === undefined){
           return null;
       }
       const response = await fetch('http://localhost:8000/auth', {
           headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${userToken}`,
           }
       });
       const data = await response.json();
       return getAuthenticatedUserSchema.parse(data);
   } catch (error){
       console.error(error);
throw logout({request});
   }

}