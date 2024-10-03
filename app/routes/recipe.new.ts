import type { ActionFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { createRecipe } from '~/services/recipe.server'
import { json, redirect } from '@remix-run/node'

const log = logger({ name: '@/app/routes/recipe.new.ts', level: 2 })

export const action: ActionFunction = async (routeHandlerArgs) => {
  const createRecipeResult = await createRecipe({ routeHandlerArgs })
  if (createRecipeResult.failure) {
    throw json(null, {
      status: 500,
      statusText: createRecipeResult.failure.reason,
    })
  }
  const { id58 } = createRecipeResult.success.data
  throw redirect(`/recipe/${id58}/edit`)
}
