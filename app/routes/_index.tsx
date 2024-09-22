import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '~/utilities/logger'
import { requireOnboarded } from '~/services/auth.server'
import { getMe } from '~/services/user.server'
import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'

const log = logger({ name: '@/app/routes/_index.tsx', level: 2 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireOnboarded({ loaderFunctionArgs })
  const result = await getMe({ loaderFunctionArgs })
  return json(result)
}

export default function IndexRoute() {
  const { me, error } = useLoaderData<typeof loader>()

  return (
    <Container tag="main">
      <Heading className="my-4 text-center">Home Page</Heading>
      <Heading tag="h2" className="my-3">
        {me ? `Welcome, ${me.displayName}!` : 'Greetings, traveler!'}
      </Heading>
      <Text
        tag="strong"
        className="block my-1 h-[1.3125rem] sm:h-6 lg:h-[1.6875rem] font-semibold text-red-700"
      >
        {error?.form}
      </Text>
    </Container>
  )
}
