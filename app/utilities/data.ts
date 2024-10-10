import type { Id58 } from '~/utilities/zod/common'

import logger from '@funhouse-atelier/logger'
import { base58 } from 'base-id'
import { filterIdProperty } from './filters'

const log = logger({ name: '@/app/utilities/data.ts', level: 2 })
log.debug('logger instantiated')

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export const replaceIdWithId58 = (obj: any) => {
  return {
    id58: base58.encode(obj.id) as Id58,
    ...filterIdProperty(obj),
  }
}
