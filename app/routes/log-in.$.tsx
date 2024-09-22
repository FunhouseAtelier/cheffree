import logger from '~/utilities/logger'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { SignIn } from '@clerk/remix'

const log = logger({ name: '@/app/routes/log-in.$.tsx', level: 2 })

export default function LogInRoute() {
  return (
    <Container tag="main" size="md">
      <Heading className="my-2 text-center">Log In</Heading>
      <Container tag="section">
        <Text tag="p" className="my-1">
          Log in to your account, using one of the social identity providers
          (Discord, Facebook, GitHub) or an email address associated with your
          account.
        </Text>
      </Container>
      <Container tag="section" center="x">
        <SignIn />
      </Container>
    </Container>
  )
}
