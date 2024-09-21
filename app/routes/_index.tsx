import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'

export default function IndexRoute() {
  return (
    <Container tag="main">
      <Heading className="my-2">Home Page</Heading>
      <hr className="border-zinc-800" />
      <Heading tag="h1" className="my-2">
        Heading 1
      </Heading>
      <Heading tag="h2" className="my-2">
        Heading 2
      </Heading>
      <Heading tag="h3" className="my-2">
        Heading 3
      </Heading>
      <Heading tag="h4" className="my-2">
        Heading 4
      </Heading>
      <Heading tag="h5" className="my-2">
        Heading 5
      </Heading>
      <Heading tag="h6" className="my-2">
        Heading 6
      </Heading>
      <hr className="border-zinc-800" />
      <Text tag="div" className="my-2">
        Home Page
      </Text>
      <hr className="border-zinc-800" />
      <Text tag="div" size="xs" className="my-2">
        Text
      </Text>
      <Text tag="div" size="sm" className="my-2">
        Text
      </Text>
      <Text tag="div" size="md" className="my-2">
        Text
      </Text>
      <Text tag="div" size="lg" className="my-2">
        Text
      </Text>
      <Text tag="div" size="xl" className="my-2">
        Text
      </Text>
      <Text tag="div" size="2xl" className="my-2">
        Text
      </Text>
      <Text tag="div" size="3xl" className="my-2">
        Text
      </Text>
      <hr className="border-zinc-800" />
      <Text tag="div" className="my-2">
        WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW
      </Text>
    </Container>
  )
}
