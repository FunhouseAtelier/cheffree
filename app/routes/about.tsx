import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireOnboarded } from '~/services/auth.server'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'

const log = logger({ name: '@/app/routes/about.tsx', level: 3 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireOnboarded({ loaderFunctionArgs })
  return {}
}

export default function AboutRoute() {
  return (
    <Container tag="main" size="md">
      <Heading className="my-2 text-center">About ChefFree</Heading>
      <Heading tag="h2" className="my-2">
        Introduction
      </Heading>
      <Text tag="p" className="my-1">
        ChefFree is a project by Funhouse Atelier to build a free web app where
        users can store and share recipes. That's "free" as in free of charge,
        and also as in freedom of information.
      </Text>
      <Text tag="p" className="my-1">
        If you have any feedback or questions about the app, please contact us
        at{' '}
        <a
          href="mailto:funhouse_atelier@protonmail.com"
          className="text-pink-800 hover:underline active:text-pink-500"
        >
          funhouse_atelier@protonmail.com
        </a>
      </Text>
    </Container>
  )
}
