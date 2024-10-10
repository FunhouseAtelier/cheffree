import type { RecipeBasicData } from '~/utilities/zod/recipe'
import type { UserBasicData } from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import { Link } from '@remix-run/react'
import { Heading, Text } from './typography'
import { Container } from './containers'

const log = logger({ name: '@/app/components/banners.tsx', level: 2 })

export const RecipeBanner = ({ recipe }: { recipe: RecipeBasicData }) => (
  <Link
    key={recipe.id58}
    to={`/recipe/${recipe.id58}`}
    prefetch="viewport"
    className="
      block
      drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
      rounded-[0.25em]
      p-[0.5em]
      ring-2
      transition-shadow duration-200 ease-out
      ring-lime-200
      bg-lime-200 text-zinc-800
      focus:ring-yellow-400 focus:outline-none
    "
  >
    <Container
      flex
      column
      className="gap-y-[0.5em]"
    >
      <Container
        flex
        center="y"
        textSize="lg"
        className="gap-x-[0.5em]"
      >
        <img
          src={recipe.author.imageUrl}
          alt="user image"
          className="h-[1.5em] w-auto rounded-[0.25em]"
        />
        <span className="font-semibold">{recipe.author.displayName}</span>
      </Container>
      <Heading
        Tag="h2"
        size="xl"
      >
        {recipe.title}
      </Heading>
      <Text Tag="p">
        {recipe.description.slice(0, 512)}
        {recipe.description.length > 512 && '[...]'}
      </Text>
    </Container>
  </Link>
)

export const UserBanner = ({ id58, displayName, imageUrl }: UserBasicData) => {
  return (
    <Text
      size="lg"
      className="font-semibold"
    >
      <Link
        to={`/user/${id58}`}
        prefetch="viewport"
        className="
          inline-flex items-center gap-x-[0.5em]
          drop-shadow sm:drop-shadow-md lg:drop-shadow-lg
          rounded-[0.25em]
          pr-[0.5em]
          ring-2
          transition-shadow duration-200 ease-out
          ring-lime-200
          bg-lime-200 text-zinc-800
          focus:ring-yellow-400 focus:outline-none
        "
      >
        <img
          src={imageUrl}
          alt="user image"
          className="h-[1.5em] w-auto rounded-l-[0.25em]"
        />
        {displayName}
      </Link>
    </Text>
  )
}
