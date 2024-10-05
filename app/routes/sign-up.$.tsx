import type { LoaderFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireNotAuthenticated } from '~/services/auth.server'

import { MainContainer } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { SignUp } from '@clerk/remix'

const log = logger({ name: '@/app/routes/sign-up.$.tsx', level: 2 })

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  await requireNotAuthenticated({ routeHandlerArgs })
  return {}
}

export default function SignUpRoute() {
  return (
    <MainContainer>
      <Heading className="text-center">Sign up</Heading>
      <Text Tag="p">
        Signing up for a ChefFree account is totally free. No billing
        information is required.
      </Text>
      <Text Tag="p">
        You can use one of the social identity providers (Discord, Facebook,
        GitHub) or a valid email address. Funhouse Atelier will never share your
        personal information with any third party without your explicit
        permission, and your email address will be used only to send you
        important information about your ChefFree account.
      </Text>
      <div className="my-[2em] flex justify-center">
        <SignUp />
      </div>
    </MainContainer>
  )
}
