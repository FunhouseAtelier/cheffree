import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireOnboarded } from '~/services/auth.server'
import { getAllUsers, getMe } from '~/services/user.server'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Link } from '@remix-run/react'

const log = logger({ name: '@/app/routes/_index.tsx', level: 3 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireOnboarded({ loaderFunctionArgs })
  const getMeResult = await getMe({ loaderFunctionArgs })
  const { me } = getMeResult
  const getAllUsersResult = await getAllUsers()
  const { users } = getAllUsersResult
  return json({ me, users })
}

export default function IndexRoute() {
  const { me, users } = useLoaderData<typeof loader>()

  return (
    <Container tag="main" size="md">
      <Heading className="mt-4 mb-6 text-center">Home Page</Heading>
      <Heading tag="h2" className="my-4">
        {me ? `Welcome, ${me.displayName}!` : 'Greetings, traveler!'}
      </Heading>
      <Heading tag="h3" className="my-4">
        User profile links:
      </Heading>
      <ul className="my-4">
        {!!users &&
          users.map((user) => (
            <li key={user.id58} className="my-2">
              <Link
                to={`/user/${user.id58}`}
                prefetch="render"
                className="text-pink-800 hover:underline active:text-pink-500"
              >
                <Text size="lg">{user.displayName}</Text>
              </Link>
            </li>
          ))}
      </ul>
    </Container>
  )
}
