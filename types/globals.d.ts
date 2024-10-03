import type { Id58 } from '~/utilities/zod/common'

export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      id58?: Id58
    }
  }
}
