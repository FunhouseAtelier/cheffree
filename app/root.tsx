import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { requireOnboarded } from '~/services/auth.server'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { HeaderNavbar } from './components/navbars'
import { ClerkApp } from '@clerk/remix'
import '~/tailwind.css'
/* Import the styles for the Font Awesome SVG icons to avoid the delay in SVG icons being displayed after server-side navigation. */
import '@fortawesome/fontawesome-svg-core/styles.css'

/* Instantiate the Funhouse Altelier custom logger for this file. This is done in every file that has executable code, with the `name` being the file path relative to the project root folder and the standard suppression level being `2`, which will suppress TRACE and DEBUG messages, but allow INFO, WARN and ERROR messages. For debugging purposes the suppression level is temporarily changed to `0`. (See: https://github.com/FunhouseAtelier/logger#readme) */
const log = logger({ name: '@/app/root.tsx', level: 2 })
/* Export the default metadata to be used on every route unless that route exports its own `meta` function. Note that the default metadata will not be merged with the data exported by a child route, it will be entirely overwritten. (See: https://remix.run/docs/en/main/route/meta) */
export const meta: MetaFunction = () => {
  return [
    { title: 'ChefFree' },
    {
      name: 'description',
      content: 'A web app for storing and sharing recipes.',
    },
  ]
}
/* Export the `<link>` elements that will appear in the `<head>` of every page. If a child route exports its own `links` function those `<link>` elements will be merged with the ones defined below, appearing after any `<link>` elements defined in a parent route. (See: https://remix.run/docs/en/main/route/links) */
export const links: LinksFunction = () => [
  /* Pre-connect to the sources of the fonts to avoid flickering and layout shift caused by first rendering a fallback font. In the future this will be changed to self-hosting all fonts to avoid the additional request/response round-trip needed to get the resources from Google. */
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  /* Link to the stylesheet for the Google variable font named Inter, a popular default sans-serif font. (See: https://fonts.google.com/specimen/Inter) */
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]
/* Export a loader function that is wrapped in the Clerk root auth loader, to make session data available in any route. (See: https://remix.run/docs/en/main/route/loader, https://clerk.com/docs/quickstarts/remix#configure-root-auth-loader) */
export const loader: LoaderFunction = (loaderFunctionArgs) => {
  return rootAuthLoader(loaderFunctionArgs, async (loaderFunctionArgs) => {
    /* Determine the relative pathname of the route that matched the request. */
    const { pathname } = new URL(loaderFunctionArgs.request.url)
    /* If it's the onboarding route, just return a null value for `me`. The onboarding route has it's own particular requirements included in its `loader` function. */
    if (pathname === '/onboarding') return { me: null }
    /* For any other route, require that if the user is authenticated with Clerk they must also have a user record in the ChefFree database. If that requirement is not met, redirect them to the onboarding route so that a user record can be created for them. If they did not need to be redirected and the `requireOnboarded` function finished with no errors, it will return `me` data that is `null` if the user is not authenticated or an object with basic user data. This is exposed to the client, accessible in the return value of the Remix `useRouteLoaderData('root')` hook used in any route. */
    const requireOnboardedResult = await requireOnboarded({
      loaderFunctionArgs,
    })
    return { me: requireOnboardedResult.success.data.me }
  })
}

/* Export a React function component for the root layout. Note that Remix expects this component to be named `Layout`, so changing the name will result in it not being used during rendering. (See: https://remix.run/docs/en/main/file-conventions/root#layout-export) */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* These `<meta>` elements are hard-coded here, instead of exported within the `meta` function above, so they will appear in the `<head>` element on every route, and they will not be overwritten by any `meta` function exports. The Remix boilerplate includes these `<meta>` elements to ensure correct display of Unicode characters and to prevent mobile browsers from attempting to resize the viewport, which is not necessary when designing the UI in a "mobile-first" manner. */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Here is where the elements generated by the `meta` and `links` functions will be injected. */}
        <Meta />
        <Links />
      </head>
      {/* Some global styles are applied to the `<body>` element to make sure it always at least fills the viewport, even if there is not enough content to fill the viewport, and to give the app a subtle color-gradient background with a default text color. */}
      <body
        className="
          min-h-screen min-w-screen
          bg-gradient-to-br from-amber-100 via-amber-200 to-orange-200
          text-zinc-800 
        "
      >
        {/* Remix will asign to `children` whatever the default export of this file is (below), which should be a React node. */}
        {children}
        {/* Remix uses this component to allow for optionally restoring scroll position on a page when navigating to it. (See: https://remix.run/docs/en/main/components/scroll-restoration) */}
        <ScrollRestoration />
        {/* Remix will inject any client-side `<script>` elements here. (See: https://remix.run/docs/en/main/components/scripts) */}
        <Scripts />
      </body>
    </html>
  )
}
/* Create a function component to render the contents of `children` in the root layout. In this app the header navbar will appear at the top of every page, and the contents of `<Outlet />` will be populated by the component exported as the default from the closest child route. */
function App() {
  return (
    <>
      <HeaderNavbar />
      <Outlet />
    </>
  )
}
/* Wrap the `App` function component in `ClerkApp` before exporting it as the default. This allows Clerk session data to be accessible in all React components, regardless of whether they are being rendered server-side or client-side. */
export default ClerkApp(App)
