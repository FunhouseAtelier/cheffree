import type { LoaderFunction } from '@remix-run/node'
import type { Ingredient, Step } from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import { requireAuthorizedToViewRecipe } from '~/services/auth.server'
import { MainContainer } from '~/components/containers'
import { Heading } from '~/components/typography'
import { Text } from '~/components/typography'
import { useLoaderData } from '@remix-run/react'
import { useUser } from '@clerk/remix'
import { UserBanner } from '~/components/banners'
import { EditDocumentButton } from '~/components/buttons'

const log = logger({
  name: '@/app/routes/recipe.$recipeId58.tsx',
  level: 2,
})

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { success } = await requireAuthorizedToViewRecipe(routeHandlerArgs)
  const { recipe } = success.data
  return { recipe }
}

export default function ViewRecipeRoute() {
  const { recipe } = useLoaderData<typeof loader>()
  const { user: clerkMe } = useUser()

  return (
    <MainContainer size="lg">
      <UserBanner
        id58={recipe.author.id58}
        displayName={recipe.author.displayName}
        imageUrl={recipe.author.imageUrl}
      />
      <Heading className="flex items-center gap-x-[0.5em]">
        {recipe.title || `Untitled Recipe ${recipe.id58}`}
        {recipe.author.id58 === clerkMe?.publicMetadata.id58 && (
          <EditDocumentButton to={`/recipe/${recipe.id58}/edit`} />
        )}
      </Heading>
      <Text
        Tag="p"
        className="my-[0.5em]"
      >
        {recipe.description}
      </Text>
      {recipe.yieldAmt && (
        <Heading
          Tag="h2"
          className="my-[0.5em]"
        >
          Yield: {recipe.yieldAmt.qty} {recipe.yieldAmt.unit}
        </Heading>
      )}
      {!!recipe.ingredients.length && (
        <div className="my-[0.5em]">
          <Heading Tag="h2">Ingredients:</Heading>
          <ul className="my-[0.5em]">
            {recipe.ingredients.map((ingredient: Ingredient) => (
              <li key={ingredient.key}>
                {ingredient.qty} • {ingredient.unit} • {ingredient.item}
              </li>
            ))}
          </ul>
        </div>
      )}
      {!!recipe.steps.length && (
        <div className="my-[0.5em]">
          <Heading Tag="h2">Process:</Heading>
          <ol className="list-decimal ml-[1.75em]">
            {recipe.steps.map((step: Step) => (
              <li
                key={step.key}
                className="my-[0.25em]"
              >
                {step.text}
              </li>
            ))}
          </ol>
        </div>
      )}
    </MainContainer>
  )
}
