import logger from '@funhouse-atelier/logger'
import { MainContainer } from '~/components/containers'
import { Heading, Text, TextExternalLink } from '~/components/typography'

const log = logger({ name: '@/app/routes/about.tsx', level: 2 })
log.debug('logger instantiated')

export default function AboutRoute() {
  return (
    <MainContainer>
      <Heading className="text-center">
        About ChefFree <Text className="text-zinc-500">v0.2</Text>
      </Heading>
      <div className="my-[1em] flex flex-col gap-y-[0.5em]">
        <Heading Tag="h2">Introduction</Heading>
        <Text Tag="p">
          ChefFree is a project by Funhouse Atelier to build a free web app
          where users can store and share recipes. That{"'"}s {'"'}free{'"'} as
          in free of charge, and also as in freedom of information.
        </Text>
        <Text Tag="p">
          If you have any feedback or questions about the app, please contact us
          at{' '}
          <TextExternalLink href="mailto:funhouse_atelier@protonmail.com">
            funhouse_atelier@protonmail.com
          </TextExternalLink>
        </Text>
      </div>
    </MainContainer>
  )
}
