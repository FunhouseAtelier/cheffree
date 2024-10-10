import type { LoaderFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireNotAuthenticated } from '~/services/auth.server'

import { Container, MainContainer } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { SignIn } from '@clerk/remix'

const log = logger({ name: '@/app/routes/log-in.$.tsx', level: 2 })

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  await requireNotAuthenticated(routeHandlerArgs)
  return {}
}

export default function LogInRoute() {
  return (
    <MainContainer>
      <Heading className="text-center">Log in</Heading>
      <div className="my-[1em]">
        <Text Tag="p">
          Log in to your account, using one of the social identity providers
          (Discord, Facebook, GitHub) or an email address associated with your
          account.
        </Text>
      </div>
      <Container
        flex
        center="x"
        className="my-[1em]"
      >
        <SignIn />
      </Container>
    </MainContainer>
  )
}
