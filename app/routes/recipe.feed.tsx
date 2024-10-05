import type { LoaderFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { BasicRecipeData } from '~/utilities/zod/recipe'
import { getRecipes } from '~/services/recipe.server'
import { MainContainer } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Link, Form, useLoaderData } from '@remix-run/react'
import { FormSubmitButton } from '~/components/buttons'

const log = logger({
  name: '@/app/routes/recipe.feed.tsx',
  level: 2,
})

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { success, failure } = await getRecipes({ routeHandlerArgs })
  if (success) {
    const { recipes } = success.data
    return { recipes }
  }
  return { loaderError: failure.error }
}

export default function EditRecipeRoute() {
  const { recipes } = useLoaderData<typeof loader>()

  return (
    <MainContainer size="lg">
      <Heading className="text-center">Recipe Feed</Heading>
      <Form
        method="post"
        action="/recipe/new"
      >
        <FormSubmitButton className="max-w-[18em]">
          Create a new recipe
        </FormSubmitButton>
      </Form>
      {!!recipes &&
        recipes.map((recipe: BasicRecipeData) => (
          <Link
            key={recipe.id58}
            to={`/recipe/${recipe.id58}`}
            prefetch="viewport"
            className="my-4 text-base sm:text-lg lg:text-xl bg-lime-200 p-[0.5em] rounded-[0.25em] block"
          >
            <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed sm:leading-relaxed lg:leading-relaxed flex items-center">
              <img
                src={recipe.author.imageUrl}
                alt="user image"
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
        ))}
    </MainContainer>
  )
}
