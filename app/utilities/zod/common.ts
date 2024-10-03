import logger from '@funhouse-atelier/logger'
import { z } from 'zod'

const log = logger({ name: '@/app/utilities/zod/common.ts', level: 2 })

export const id58 = z.coerce.string().regex(/^[a-km-zA-HJ-NP-Z1-9]{17}$/)

export type Id58 = z.infer<typeof id58>
