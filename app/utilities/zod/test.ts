import { z } from 'zod'
import '~/utilities/zod/error-map'

export const testSchema = z.object({
  age: z.coerce.number(),
  username: z.coerce.string().min(1).max(24),
  imageUrl: z.coerce.string().url(),
  nested: z.object({
    eggOne: z.coerce.string().min(1).max(8),
    eggTwo: z.coerce.string().min(1).max(8),
  }),
})
