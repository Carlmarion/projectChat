import {
    Form, Link,
    Links, LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import "./tailwind.css";
import type {LoaderFunctionArgs} from "@remix-run/node";
import {getOptionaluser} from "~/auth.server";
import {json} from "@remix-run/node";
import {useRouteLoaderData} from "react-router";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await getOptionaluser({request});
    return json({user});
}

export const useOptionalUser = () => {
    const data = useRouteLoaderData<typeof loader>("root");
    if(data.user){
        return data.user;
    }
    return null;
};
export default function App() {
  const user = useOptionalUser();
    return (
    <html lang="en">
      <head title='Chat nestjs'>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
      <nav style={{
          display:'flex',
          flexDirection:'row',
          gap:4
      }}>
          {user ? (<Form method="POST" action="logout">
              <button type="submit" className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow">Logout</button>
          </Form>) :
              (
                  <div>
                      <button
                          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow">
                          <Link to="/register">Create an account</Link>
                      </button>
                      <button
                          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded shadow">
                          <Link to="/">Login</Link>
                      </button>
                  </div>

              )
          }
      </nav>
      <Outlet/>
      <ScrollRestoration/>
      <Scripts/>
      <LiveReload/>
      </body>
    </html>
    );
}

