import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireOnboarded } from '~/services/auth.server'
import { getUserById58 } from '~/services/user.server'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Container } from '~/components/containers'
import { DateTime } from 'luxon'

const log = logger({ name: '@/app/routes/user.$userId58.tsx', level: 2 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireOnboarded({ loaderFunctionArgs })
  const { userId58 } = loaderFunctionArgs.params
  if (!userId58) {
    throw json(null, {
      status: 400,
      statusText: 'Missing userId58 param.',
    })
  }
  const { user, error } = await getUserById58(userId58)
  if (error) {
    throw json(null, {
      status: 500,
      statusText: 'Unable to get user from database.',
    })
  }
  if (!user) {
    throw json(null, {
      status: 404,
      statusText: 'User not found.',
    })
  }

  return json({ user })
}

export default function UserProfileRoute() {
  const { user } = useLoaderData<typeof loader>()

  const joinedAt = DateTime.fromISO(user.createdAt).toRelative()
  const activeAt = DateTime.fromISO(user.lastSeenAt).toRelative()

  return (
    <Container tag="main" size="lg">
      <header
        className="
          text-base sm:text-lg lg:text-xl
          my-[0.5em] p-[0.5em]
          bg-lime-200
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
        "
      >
        <h1
          className="
            text-xl sm:text-2xl lg:text-3xl
            leading-relaxed sm:leading-relaxed lg:leading-relaxed
            font-semibold truncate
          "
        >
          {user.displayName}
        </h1>
        <div className="flex">
          <div className="shrink-0 px-3 sm:px-3.5 lg:px-4">
            <div className="w-24 sm:w-32 lg:w-36" />
          </div>
          <ul className="grow">
            <li className="leading-relaxed sm:leading-relaxed lg:leading-relaxed text-right">
              <span className="font-semibold">Joined:</span> {joinedAt}
            </li>
            <li className="leading-relaxed sm:leading-relaxed lg:leading-relaxed text-right">
              <span className="font-semibold">Active:</span> {activeAt}
            </li>
          </ul>
        </div>
      </header>
      <div className="flex">
        <div className="shrink-0 -mt-16 sm:-mt-[4.5rem] lg:-mt-20 px-3 sm:px-4 lg:px-5">
          {user ? (
            <>
              <a href={user.imageUrl} target="_blank">
                <img
                  src={user.imageUrl}
                  alt="user avatar"
                  className="w-24 sm:w-32 lg:w-36 rounded sm:rounded-md lg:rounded-lg drop-shadow sm:drop-shadow-md lg:drop-shadow-lg"
                />
              </a>
              <div className="my-2 text-zinc-500 text-sm sm:text-base lg:text-lg">
                <button className="block w-full text-center">USER</button>
                <button className="block w-full text-center">
                  INTERACTION
                </button>
                <button className="block w-full text-center">BUTTONS</button>
              </div>
            </>
          ) : (
            <div className="w-24 sm:w-32 lg:w-36" />
          )}
        </div>
        <div className="grow min-h-full flex justify-center items-center text-zinc-500 text-lg sm:text-xl lg:text-2xl">
          USER STATS
        </div>
      </div>
      <div className="text-right text-zinc-500 text-base sm:text-lg lg:text-xl">
        [TAB-1] [TAB-2] [TAB-3]
      </div>
      <div className="text-center text-zinc-500 text-xl sm:text-2xl lg:text-3xl">
        USER ACTIVITY
      </div>
    </Container>
  )
}
