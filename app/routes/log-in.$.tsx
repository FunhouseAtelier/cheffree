import type { LoaderFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireNotAuthenticated } from '~/services/auth.server'

import { MainContainer } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { SignIn } from '@clerk/remix'

const log = logger({ name: '@/app/routes/log-in.$.tsx', level: 2 })

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  await requireNotAuthenticated({ routeHandlerArgs })
  return {}
}

export default function LogInRoute() {
  return (
    <MainContainer>
      <Heading className="text-center">Log in</Heading>
      <Text tag="p">
        Log in to your account, using one of the social identity providers
        (Discord, Facebook, GitHub) or an email address associated with your
        account.
      </Text>
      <div className="my-[2em] flex justify-center">
        <SignIn />
      </div>
    </MainContainer>
  )
}
