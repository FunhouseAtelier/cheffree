import type { LoaderFunction } from '@remix-run/node'
import type { RecipeBasicData } from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import { getAllRecipes } from '~/services/recipe.server'
import { MainContainer } from '~/components/containers'
import { Heading } from '~/components/typography'
import { Form, useLoaderData } from '@remix-run/react'
import { FormSubmitButton } from '~/components/buttons'
import { RecipeBanner } from '~/components/banners'
import { FormError } from '~/components/forms'

const log = logger({ name: '@/app/routes/_index.tsx', level: 2 })
log.debug('logger instantiated')

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { success, failure } = await getAllRecipes('basic', {
    routeHandlerArgs,
  })
  if (success) {
    const { recipes } = success.data
    return { recipes }
  }
  return { loaderError: failure.reason }
}

export default function HomeRoute() {
  const { recipes, loaderError } = useLoaderData<typeof loader>()

  return (
    <MainContainer size="lg">
      <Heading className="text-center">Recipe Feed</Heading>
      <Form
        method="post"
        action="/recipe/new"
        className="flex justify-center my-[1em]"
      >
        <FormSubmitButton>Create a new recipe</FormSubmitButton>
      </Form>
      <div className="flex flex-col gap-y-[1em] my-[2em]">
        {recipes.map((recipe: RecipeBasicData) => (
          <RecipeBanner
            key={recipe.id58}
            recipe={recipe}
          />
        ))}
      </div>
      <FormError>{loaderError}</FormError>
    </MainContainer>
  )
}
