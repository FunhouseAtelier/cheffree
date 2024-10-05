import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { Id58 } from '~/utilities/zod/common'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import {
  recipeUpdates,
  BasicRecipeData,
  EditRecipeFormData,
} from '~/utilities/zod/recipe'
import zodParse from '~/utilities/zod/parser'
import { requireAuthorizedToEditRecipe } from './auth.server'

const log = logger({ name: '@/app/services/recipe.server.ts', level: 2 })

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

export const createRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  const { userId: clerkId, sessionClaims } = await getAuth(routeHandlerArgs)
  if (!clerkId) throw redirect('/log-in')
  const userId58 = sessionClaims.metadata.id58
  if (!userId58) {
    return {
      failure: { reason: 'Failed to find your id58 in your session claims.' },
    }
  }
  try {
    const newRecipe = await prisma.recipe.create({
      data: {
        authorId: base58.decode(userId58),
      },
    })
    return { success: { data: { id58: base58.encode(newRecipe.id) } } }
  } catch (error) {
    log.error('Unexpected error when creating the recipe record:\n', error)
    return {
      failure: {
        reason: 'Unable to create a new recipe at this time.',
      },
    }
  }
}

export const getRecipeById58 = async ({ id58 }: { id58: Id58 }) => {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: base58.decode(id58) },
    })
    return { success: { data: { recipe } } }
  } catch (error) {
    return { failure: { error } }
  }
}

/* TODO: improve error handling when parsing */
export const updateRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  await requireAuthorizedToEditRecipe({ routeHandlerArgs })
  const { recipeId58 } = routeHandlerArgs.params
  const formData = (await routeHandlerArgs.request.json()) as EditRecipeFormData
  log.debug('formData:\n', formData)
  const { isPublished, title, description, yieldAmt, ingredients, steps } =
    formData
  const updates = {
    isPublished,
    title,
    description,
    yieldAmt: yieldAmt.qty || yieldAmt.unit ? yieldAmt : null,
    ingredients: ingredients
      .filter((i) => !!(i.data.qty || i.data.unit || i.data.name))
      .map((i) => i.data),
    steps: steps.filter((s) => !!s.data).map((s) => s.data),
  }
  log.debug('updates:\n', updates)
  const zodParseResult = zodParse(updates, recipeUpdates)
  log.debug('zodParseResult:\n', zodParseResult)
  if (zodParseResult.failure) {
    return { failure: zodParseResult.failure }
  }
  try {
    await prisma.recipe.update({
      where: { id: base58.decode(recipeId58) },
      data: { ...zodParseResult.success.data },
    })
    return { success: true }
  } catch (error) {
    log.error('Unexpected error when updating the recipe record:\n', error)
    return {
      failure: {
        errors: { _global: 'Unable to update the recipe record at this time.' },
      },
    }
  }
}

export const getRecipes = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
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
    const foundRecipes = await prisma.recipe.findMany({
      where,
      select: {
        id: true,
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
      orderBy: [{ updatedAt: 'desc' }],
    })
    const recipes: BasicRecipeData[] = foundRecipes.map((recipe) => ({
      id58: base58.encode(recipe.id),
      title: recipe.title ?? '',
      description: recipe.description ?? '',
      author: {
        id58: base58.encode(recipe.author.id),
        displayName: recipe.author.displayName,
        imageUrl: recipe.author.imageUrl,
      },
    }))
    return { success: { data: { recipes } } }
  } catch (error) {
    log.error('Unable to get recipe feed:\n', error)
    return { failure: { error } }
  }
}

export const deleteRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  await requireAuthorizedToEditRecipe({ routeHandlerArgs })
  const { recipeId58 } = routeHandlerArgs.params
  try {
    await prisma.recipe.delete({
      where: { id: base58.decode(recipeId58) },
    })
    return { success: true }
  } catch (error) {
    return {
      failure: {
        errors: { _global: 'Unable to delete recipe record at this time.' },
      },
    }
  }
}
