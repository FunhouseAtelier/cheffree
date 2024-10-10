import logger from '@funhouse-atelier/logger'
import { z } from 'zod'

const log = logger({ name: '@/app/utilities/zod/common.ts', level: 2 })

export const id = z.string().regex(/^[a-f\d]{24}$/)
export type Id = z.infer<typeof id>

export const id58 = z.string().regex(/^[a-km-zA-HJ-NP-Z1-9]{17}$/)
export type Id58 = z.infer<typeof id58>

export const uuid = z.string().uuid()
export type UUID = z.infer<typeof uuid>

export const createdAt = z.date()
export type CreatedAt = z.infer<typeof createdAt>

export const updatedAt = z.date()
export type UpdatedAt = z.infer<typeof updatedAt>

export const requireSomeProperty = (obj: any) => {
  for (const val of Object.values(obj)) {
    if (val !== undefined) return true
  }
  return false
}

export const requireSomePropertyMsg = {
  message: 'Object must have at least one property *',
}
