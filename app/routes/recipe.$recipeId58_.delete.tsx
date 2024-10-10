import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { EditRecipeFormErrors } from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import { redirect } from '@remix-run/node'
import { requireAuthorizedToEditRecipe } from '~/services/auth.server'
import { useState, useEffect } from 'react'
import { deleteRecipe } from '~/services/recipe.server'
import { MainContainer } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Link, Form, useLoaderData, useActionData } from '@remix-run/react'
import { FormError } from '~/components/forms'
import { FormCancelButton, FormDeleteButton } from '~/components/buttons'

const log = logger({
  name: '@/app/routes/recipe.$recipeId58_.delete.tsx',
  level: 2,
})
log.debug('logger instantiated')

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { success } = await requireAuthorizedToEditRecipe(routeHandlerArgs)
  const { recipe } = success.data
  return { recipe }
}

export const action: ActionFunction = async (routeHandlerArgs) => {
  const { failure } = await deleteRecipe(routeHandlerArgs)
  if (!failure) throw redirect(`/`)
  return { actionErrors: failure.errors }
}

export default function EditRecipeRoute() {
  const { recipe } = useLoaderData<typeof loader>()
  const { actionErrors } = useActionData<typeof action>() ?? {}

  const [formErrors, setFormErrors] = useState<EditRecipeFormErrors>({})

  useEffect(() => {
    if (actionErrors) setFormErrors(actionErrors)
  }, [actionErrors])

  return (
    <MainContainer size="lg">
      <Heading className="text-center">Delete Recipe</Heading>
      <div className="my-[1em]">
        <Text Tag="p">
          Are you sure you want to delete this recipe? Deleting a recipe is
          permanent and cannot be undone.
        </Text>
      </div>
      <Form method="post">
        <div className="flex gap-x-[1em] my-[1em]">
          <FormCancelButton
            to={`/recipe/${recipe.id58}`}
            className="w-full"
          >
            Cancel
          </FormCancelButton>
          <FormDeleteButton className="w-full">Delete Recipe</FormDeleteButton>
        </div>
        <FormError>{formErrors._global}</FormError>
      </Form>
      <Link
        key={recipe.id58}
        to={`/recipe/${recipe.id58}`}
        prefetch="viewport"
        className="my-[1em] text-base sm:text-lg lg:text-xl bg-lime-200 p-[0.5em] rounded-[0.25em] block"
      >
        <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed sm:leading-relaxed lg:leading-relaxed flex items-center">
          <img
            src={recipe.author.imageUrl}
            alt="user avatar"
            className="h-[1.625em] w-auto rounded-[0.25em]"
          />
          <span className="font-semibold px-[0.5em]">
            {recipe.author.displayName}
          </span>
        </div>
        <Heading
          Tag="h2"
          size="xl"
        >
          {recipe.title}
        </Heading>
        <Text Tag="p">{recipe.description}</Text>
      </Link>
    </MainContainer>
  )
}
