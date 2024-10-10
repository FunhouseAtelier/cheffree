import type { ActionFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { createRecipe } from '~/services/recipe.server'
import { json, redirect } from '@remix-run/node'

const log = logger({ name: '@/app/routes/recipe.new.ts', level: 2 })
log.debug('logger instantiated')

export const action: ActionFunction = async (routeHandlerArgs) => {
  const { success, failure } = await createRecipe({ routeHandlerArgs })
  if (failure) {
    throw json(null, {
      status: 500,
      statusText: failure.reason,
    })
  }
  const { id58 } = success.data.recipe
  throw redirect(`/recipe/${id58}/edit`)
}
