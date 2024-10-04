import type { LoaderFunction } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireAuthorizedToViewRecipe } from '~/services/auth.server'
import { MainContainer } from '~/components/containers'
import { Heading } from '~/components/typography'
import { Text } from '~/components/typography'
import { useLoaderData } from '@remix-run/react'
import { useUser } from '@clerk/remix'
import { EditDocumentIconButton, UserButton } from '~/components/buttons'

const log = logger({
  name: '@/app/routes/recipe.$recipeId58.tsx',
  level: 2,
})

export const loader: LoaderFunction = async (routeHandlerArgs) => {
  const { success } = await requireAuthorizedToViewRecipe({ routeHandlerArgs })
  const { recipe } = success.data
  return { recipe }
}

export default function ViewRecipeRoute() {
  const { recipe } = useLoaderData<typeof loader>()
  const { user: clerkMe } = useUser()

  return (
    <MainContainer size="lg">
      <UserButton
        id58={recipe.author.id58}
        displayName={recipe.author.displayName}
        imageUrl={recipe.author.imageUrl}
      />
      <Heading className="flex items-center gap-x-[0.5em]">
        {recipe.title || `Untitled Recipe ${recipe.id58}`}
        {recipe.author.id58 === clerkMe?.publicMetadata.id58 && (
          <EditDocumentIconButton to={`/recipe/${recipe.id58}/edit`} />
        )}
      </Heading>
      <Text tag="p">{recipe.description}</Text>
      <Heading tag="h2">
        Yield:{' '}
        {recipe.yieldAmt
          ? `${recipe.yieldAmt.qty} ${recipe.yieldAmt.unit}`
          : ''}
      </Heading>
      <Heading tag="h2">Ingredients:</Heading>
      <ul>
        {recipe.ingredients.map(
          (
            ingredient: { qty: number; unit: string; name: string },
            index: number
          ) => (
            <li key={index}>
              {ingredient.qty} {ingredient.unit} {ingredient.name}
            </li>
          )
        )}
      </ul>
      <Heading tag="h2">Process:</Heading>
      <ol className="list-decimal ml-[2.5em] mb-[4em]">
        {recipe.steps.map((step: string, index: number) => (
          <li key={index} className="my-[0.5em]">
            {step}
          </li>
        ))}
      </ol>
    </MainContainer>
  )
}
