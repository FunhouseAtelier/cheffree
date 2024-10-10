// @ts-nocheck

import logger from '@funhouse-atelier/logger'
import { Heading } from '~/components/typography'
import { testSchema } from '~/utilities/zod/test'
import zodParse from '~/utilities/zod/parser'
import { MainContainer } from '~/components/containers'

const log = logger({ name: '@/app/routes/test.tsx', level: 0 })

export default function TestRoute() {
  return (
    <MainContainer>
      <Heading className="text-center">Test Page</Heading>
    </MainContainer>
  )
}
