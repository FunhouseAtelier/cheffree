import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { GetRecipeWhereArgs } from '~/utilities/zod/recipe'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import {
  RecipeBasicData,
  editRecipeFormData,
  EditRecipeFormData,
} from '~/utilities/zod/recipe'
import zodParse from '~/utilities/zod/parser'
import {
  requireAuthenticated,
  requireAuthorizedToEditRecipe,
} from './auth.server'
import { replaceIdWithId58 } from '~/utilities/data'

const log = logger({ name: '@/app/services/recipe.server.ts', level: 2 })

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

const selectByScope = {
  basic: {
    title: true,
    description: true,
    author: {
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
    },
  },
  view: {
    isPublished: true,
    title: true,
    description: true,
    author: {
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
    },
    yieldAmt: true,
    ingredients: true,
    steps: true,
  },
  edit: {
    isPublished: true,
    title: true,
    description: true,
    author: {
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
    },
    yieldAmt: true,
    ingredients: true,
    steps: true,
  },
}

export const createRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  const authResult = await requireAuthenticated({ routeHandlerArgs })
  const { sessionClaims } = authResult.success.data

  const userId58 = sessionClaims.metadata.id58
  if (!userId58) throw redirect('/onboarding')

  try {
    const recipe = await prisma.recipe.create({
      data: { authorId: base58.decode(userId58).toLowerCase() },
      select: { id: true },
    })
    const data = { recipe: replaceIdWithId58(recipe) }
    return { success: { data } }
  } catch (error) {
    log.error('Failed to create recipe:\n', error)
    return { failure: { reason: 'Failed to create recipe.' } }
  }
}

export const getRecipe = async (
  scope: keyof typeof selectByScope,
  { id, id58 }: GetRecipeWhereArgs
) => {
  if (!id && id58) id = base58.decode(id58).toLowerCase()

  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
      select: { id: true, ...selectByScope[scope] },
    })

    if (!recipe) return { failure: { reason: 'Recipe not found.' } }

    const data = {
      ...replaceIdWithId58(recipe),
      author: replaceIdWithId58(recipe.author),
    }
    return { success: { data } }
  } catch (error) {
    log.error('Unable to get recipe basic data:\n', error)
    return { failure: { reason: 'Failed to get recipe.' } }
  }
}

export const getAllRecipes = async (
  scope: keyof typeof selectByScope,
  {
    routeHandlerArgs,
  }: {
    routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  }
) => {
  const { sessionClaims } = await getAuth(routeHandlerArgs)
  const meId = sessionClaims
    ? base58.decode(sessionClaims.metadata.id58).toLowerCase()
    : null

  const where = meId
    ? {
        OR: [{ isPublished: true }, { authorId: meId }],
      }
    : { isPublished: true }
  try {
    const recipes = await prisma.recipe.findMany({
      where,
      select: {
        id: true,
        ...selectByScope[scope],
      },
      orderBy: [{ updatedAt: 'desc' }],
    })
    const data = {
      recipes: recipes.map((recipe) => ({
        ...replaceIdWithId58(recipe),
        author: replaceIdWithId58(recipe.author),
      })),
    }
    return { success: { data } }
  } catch (error) {
    log.error('Failed to get recipes:\n', error)
    return { failure: { reason: 'Failed to get recipes.' } }
  }
}

export const updateRecipe = async (
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
) => {
  await requireAuthorizedToEditRecipe(routeHandlerArgs)
  const { recipeId58 } = routeHandlerArgs.params
  const formData = (await routeHandlerArgs.request.json()) as EditRecipeFormData
  const updates = {
    ...formData,
    ingredients: formData.ingredients.filter(
      (i) => !!(i.qty || i.unit || i.item)
    ),
    steps: formData.steps.filter((s) => !!s.text),
  }
  const { success, failure } = zodParse(updates, editRecipeFormData)
  if (failure) return { failure }
  try {
    await prisma.recipe.update({
      where: { id: base58.decode(recipeId58).toLowerCase() },
      data: { ...success.data },
    })
    return { success: true }
  } catch (error) {
    log.error('Failed to update recipe:\n', error)
    return {
      failure: {
        errors: { _global: 'Failed to update recipe.' },
      },
    }
  }
}

export const deleteRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  await requireAuthorizedToEditRecipe(routeHandlerArgs)
  const { recipeId58 } = routeHandlerArgs.params
  try {
    await prisma.recipe.delete({
      where: { id: base58.decode(recipeId58).toLowerCase() },
    })
    return { success: true }
  } catch (error) {
    return {
      failure: {
        errors: { _global: 'Failed to delete recipe.' },
      },
    }
  }
}
