import type { LoaderFunction } from '@remix-run/node'
import type { BasicUserData } from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import { getAllUsers } from '~/services/user.server'
import { useLoaderData, useRouteLoaderData } from '@remix-run/react'
import { MainContainer } from '~/components/containers'
import { Heading, TextLink } from '~/components/typography'

const log = logger({ name: '@/app/routes/_index.tsx', level: 2 })

export const loader: LoaderFunction = async () => {
  const getAllUsersResult = await getAllUsers()
  const users = getAllUsersResult.success?.data.users ?? []
  return { users }
}

export default function IndexRoute() {
  const { users } = useLoaderData<typeof loader>()
  const { me } = useRouteLoaderData<{ me: BasicUserData }>('root') ?? {}

  return (
    <MainContainer>
      <Heading className="text-center">Home Page</Heading>
      <Heading tag="h2">
        {me ? `Welcome, ${me.displayName}!` : 'Greetings, traveler!'}
      </Heading>
      <Heading tag="h3">Member List:</Heading>
      <ul>
        {users.map((user: BasicUserData) => (
          <li key={user.id58} className="my-[0.25em]">
            <TextLink to={`/user/${user.id58}`} size="lg">
              {user.displayName}
            </TextLink>
          </li>
        ))}
      </ul>
    </MainContainer>
  )
}
