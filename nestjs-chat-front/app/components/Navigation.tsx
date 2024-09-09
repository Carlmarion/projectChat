import {Form, NavLink, useLocation} from "@remix-run/react";
import {useOptionalUser} from "~/root";
import {Button, VariantButton} from "~/components/ui/button";

type RouteItemType = { url: string; name: string };
export const loggedOutRoutes : RouteItemType[] = [
    {url: '/', name: 'Connexion'},
    {url: '/register', name: 'Inscription'},
];

export const loggedInRoutes: RouteItemType[] = [
    {url: '/', name: 'Dashboard'},
    {url: '/settings', name: 'Settings'},
];


export const Navigation = () => {
    const user = useOptionalUser();
    return (
        <nav className= 'w-full flex items-center bg-primary text-white'>
            <div className='flex items-baseline gap-x-4 mx-auto max-w-lg py-2'>
                {user ? (
                    <>
                        {loggedInRoutes.map((route) => (
                            <RouteItem route={route} key={route.name}/>
                        ))}
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl}
                            className='w-10 h-auto flex-shrink-0'
                                 alt=''
                            />
                        ): null}
                        <Form method='POST' action='logout'>
                            <Button size={'sm'}
                            type='submit'
                                    className='text-sm px-0 py-0 leading-none h-auto'
                                    variant={VariantButton.GHOST}
                            >
                                Disconnect
                            </Button>
                        </Form>
                    </>
                ): null}
            </div>

        </nav>
    );
};

const RouteItem = ({route}: {route: RouteItemType}) => {
    const location = useLocation();
    return (
        <NavLink to={route.url}
                 key={route.name}
                 className={(isActive) => `text-sm ${isActive && location.pathname === route.url ? 'font-bold underline' : 'font-normal'}`}>

            {route.name}
        </NavLink>
    );
};