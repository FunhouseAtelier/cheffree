import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireOnboarded } from '~/services/auth.server'
import { getUserById58 } from '~/services/user.server'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { useAuth } from '@clerk/remix'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { DateTime } from 'luxon'

const log = logger({ name: '@/app/routes/user.$userId58.tsx', level: 3 })

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
  const { userId: myClerkId } = useAuth()

  const joinedAt = DateTime.fromISO(user.createdAt).toRelative()
  const activeAt = DateTime.fromISO(user.lastSeenAt).toRelative()

  return (
    <Container tag="main" size="lg">
      <Container
        tag="header"
        className="mt-2 h-[7.25rem] sm:h-[8.5rem] lg:h-[10.5rem] p-4 sm:p-5 lg:p-6 rounded sm:rounded-md lg:rounded-lg bg-lime-200 drop-shadow lg:drop-shadow-md"
      >
        <Heading className="truncate h-10 sm:h-[3.25rem] lg:h-16">
          {user.displayName}
        </Heading>
        <div className="flex">
          <div className="size-28 sm:size-[8.25rem] lg:size-[9.5rem] grow" />
          <div className="text-right">
            <div>
              <Text className="font-semibold">Joined:</Text>{' '}
              <Text>{joinedAt}</Text>
            </div>
            <div>
              <Text className="font-semibold">Active:</Text>{' '}
              <Text>{activeAt}</Text>
            </div>
          </div>
        </div>
      </Container>
      <div className="flex h-24 sm:h-28 lg:h-32 pl-4 sm:pl-5 lg:pl-6">
        <div className="-mt-12 sm:-mt-14 lg:-mt-16 size-24 sm:size-28 lg:size-32 rounded sm:rounded-md lg:rounded-lg drop-shadow lg:drop-shadow-md">
          {!!user && (
            <img
              src={user.imageUrl}
              alt="user avatar"
              className="rounded sm:rounded-md lg:rounded-lg"
            />
          )}
        </div>
        <div className="grow" />
        {user.clerkId === myClerkId && (
          <Container
            center="y"
            className="gap-2 sm:gap-[0.75rem] lg:gap-4 h-12 sm:h-14 lg:h-16 py-1 sm:py-1.5 lg:py-2"
          >
            <button className="flex justify-center items-center size-10 sm:size-11 lg:size-12 border lg:border-2 rounded sm:rounded-md lg:rounded-lg border-emerald-900 bg-emerald-800/80 hover:bg-emerald-800 transition-colors duration-300 ease-out active:bg-emerald-500 active:transition-none drop-shadow lg:drop-shadow-md">
              <Text size="lg">✏️</Text>
            </button>
            <button className="flex justify-center items-center size-10 sm:size-11 lg:size-12 border lg:border-2 rounded sm:rounded-md lg:rounded-lg border-emerald-900 bg-emerald-800/80 hover:bg-emerald-800 transition-colors duration-300 ease-out active:bg-emerald-500 active:transition-none drop-shadow lg:drop-shadow-md">
              <Text size="lg">⚙️</Text>
            </button>
          </Container>
        )}
      </div>
    </Container>
  )
}
