import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { SignUp } from '@clerk/remix'

export default function SignUpRoute() {
  return (
    <Container tag="main" size="md">
      <Heading className="my-2 text-center">Sign Up</Heading>
      <Container tag="section">
        <Text tag="p" className="my-1">
          Signing up for a ChefFree account is totally free. No billing
          information is required.
        </Text>
        <Text tag="p" className="my-1">
          You can use one of the social identity providers (Discord, Facebook,
          GitHub) or a valid email address. Funhouse Atelier will never share
          your personal information with any third party without your explicit
          permission, and your email address will be used only to send you
          important information about your ChefFree account.
        </Text>
      </Container>
      <Container tag="section" center="x">
        <SignUp />
      </Container>
    </Container>
  )
}
