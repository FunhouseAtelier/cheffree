import logger from '@funhouse-atelier/logger'
import { Heading } from '~/components/typography'
import { testSchema } from '~/utilities/zod/test'
import zodParse from '~/utilities/zod/parser'

const data = {
  age: '93',
  username: 'MalcolmReynoldsMalcolmReynoldsMalcolmReynolds',
  imageUrl: 'httLCJyaWQiOiJ1c2VyXzJtamxKQWhlSjVkZ01TT0F3QXhPU05YdnRxViJ9',
  nested: {
    eggOne: '',
    eggTwo: '123456789',
    eggThree: 'imposs',
  },
}

const log = logger({ name: '@/app/routes/test.tsx', level: 0 })

export const loader = async () => {
  const zodParseResult = zodParse(data, testSchema)
  log.debug('zodParseResult:\n', zodParseResult)
  log.debug(
    'zodParseResult.failure.errors.nested:\n',
    zodParseResult.failure?.errors.nested
  )
  return {}
}

export default function Route() {
  return <Heading className="text-center">Testing zodParse</Heading>
}
