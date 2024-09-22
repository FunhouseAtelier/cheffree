import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'

import logger from '~/utilities/logger'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react'
import { HeaderNavbar } from './components/navbars'
import { rootAuthLoader } from '@clerk/remix/ssr.server'
import { ClerkApp } from '@clerk/remix'

import './tailwind.css'

const log = logger({ name: '@/app/root.tsx', level: 2 })

export const meta: MetaFunction = () => {
  return [
    { title: 'ChefFree' },
    {
      name: 'description',
      content: 'A web app for storing and sharing recipes.',
    },
  ]
}

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export const loader = (args: LoaderFunctionArgs) => rootAuthLoader(args)

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen h-full min-w-screen w-full text-zinc-800 bg-gradient-to-br from-amber-100 via-amber-200 to-orange-200">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

function App() {
  return (
    <>
      <HeaderNavbar />
      <Outlet />
    </>
  )
}

export default ClerkApp(App)
