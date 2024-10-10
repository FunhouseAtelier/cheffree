import type { LoaderFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'

import { getUser } from '~/services/user.server'
import { json, redirect } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { MainContainer } from '~/components/containers'
import { DateTime } from 'luxon'

const log = logger({ name: '@/app/routes/user.$userId58.tsx', level: 2 })
log.debug('logger instantiated')

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { userId58: id58 } = routeHandlerArgs.params
  if (!id58) {
    throw json(null, {
      status: 400,
      statusText: 'Missing userId58 param.',
    })
  }
  const { success, failure } = await getUser('profile', { id58 })
  if (failure) throw redirect('/')
  const { user } = success.data
  return { user }
}

export default function UserProfileRoute() {
  const { user } = useLoaderData<typeof loader>()
  const joined = DateTime.fromISO(user.createdAt).toRelative()
  const active = DateTime.fromISO(user.updatedAt).toRelative()

  return (
    <MainContainer size="lg">
      <header
        className="
          my-[0.5em] p-[0.5em]
          rounded-sm sm:rounded lg:rounded-md
          bg-cyan-200
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
          <div className="shrink-0 px-[1em]">
            <div className="w-24 sm:w-32 lg:w-36" />
          </div>
          <ul className="grow">
            <li className="text-right">
              <span className="font-semibold">Joined:</span> {joined}
            </li>
            <li className="text-right">
              <span className="font-semibold">Active:</span> {active}
            </li>
          </ul>
        </div>
      </header>
      <div className="flex">
        <div className="shrink-0 -mt-16 sm:-mt-[4.5rem] lg:-mt-20 px-[1em]">
          {user ? (
            <>
              <a
                href={user.imageUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={user.imageUrl}
                  alt="user avatar"
                  className="w-24 sm:w-32 lg:w-36 rounded sm:rounded-md lg:rounded-lg drop-shadow sm:drop-shadow-md lg:drop-shadow-lg"
                />
              </a>
              <div className="my-2 text-zinc-500 text-sm sm:text-base lg:text-lg border border-zinc-400">
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
        <div className="grow min-h-full flex justify-center items-center text-zinc-500 text-lg sm:text-xl lg:text-2xl border border-zinc-400">
          USER BIO (scrollable)
        </div>
      </div>
      <div className="mt-4 flex justify-end text-right text-zinc-500 text-base sm:text-lg lg:text-xl">
        <div className="border border-zinc-400 p-2">TAB-1</div>
        <div className="border border-zinc-400 p-2">TAB-2</div>
        <div className="border border-zinc-400 p-2">TAB-3</div>
      </div>
      <div className="flex justify-center items-center text-zinc-500 text-xl sm:text-2xl lg:text-3xl border border-zinc-400 min-h-64">
        USER STATS/ACTIVITY (tab-switched)
      </div>
    </MainContainer>
  )
}
