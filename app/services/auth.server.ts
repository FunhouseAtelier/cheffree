/* Import the necessary type declarations for Remix utility function arguments. */
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { Id58 } from '~/utilities/zod/common'

import logger from '@funhouse-atelier/logger'
/* Import the Clerk Client instantiator. */
import { createClerkClient } from '@clerk/remix/api.server'
/* Import the Remix utility functions for redirecting to another route or sending a custom response in case of an unexpected error. */
import { json, redirect } from '@remix-run/node'
/* Import the Clerk `getAuth` function used to determine if the current user is authenticated, and if so what their clerkId is. */
import { getAuth } from '@clerk/remix/ssr.server'
/* Import the Prisma Client to handle database operations. */
import prisma from './prisma.server'
/* Import the `base58` function to convert IDs between MongoDB ObjectId types and shorter base-58 strings. Because IDs are often used in dynamic route URLs it is preferable to shorten the length of IDs from 24 characters to 17 characters, using the base-58 system popularized by Twitter, which is similar to base-64 format but excludes any characters that are not alphanumeric, along with some characters that may look amiguous, namely `O`/`0` and `I`/`l`. */
import { base58 } from 'base-id'
import { getUserByClerkId } from './user.server'
import zodParse from '~/utilities/zod/parser'
import { id58 as id58Schema } from '~/utilities/zod/common'

const log = logger({ name: '@/app/services/auth.server.ts', level: 2 })

/* Instantiate the Clerk Client used to get Clerk account data server-side. */
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

/* Export a `requireOnboarded` function to check if the current user needs to complete the onboarding process, and if so redirects to the onboarding page. If not, it returns the basic current user data as `me`. */
export const requireOnboarded = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  log.debug(
    'requireOnboarded() called from URL:\n',
    routeHandlerArgs.request.url
  )
  /* Use the arguments passed to the loader function in order to check the session for a Clerk ID. */
  const { userId: clerkId, sessionClaims } = await getAuth(routeHandlerArgs)
  /* If no Clerk ID was found the current user is not authenticated, so onboarding is not required and `me` has a value of `null`. */
  if (!clerkId) return { success: { data: { me: null } } }
  /* Check to see if a user record with a matching Clerk ID exists. */
  const getUserByClerkIdResult = await getUserByClerkId({ clerkId })
  if (getUserByClerkIdResult.failure) {
    throw json(null, {
      status: 500,
      statusText: 'Failed to fetch user record. Onboarding status unknown.',
    })
  }
  const { user } = getUserByClerkIdResult.success.data
  if (user) {
    /* A matching user record was found. Get the avatar image URL and first email address from the Clerk account data. */
    const clerkUser = await clerkClient.users.getUser(clerkId)
    const { imageUrl } = clerkUser
    const email = clerkUser.emailAddresses[0].emailAddress
    /* Check to see if the user record data differs from the Clerk account data, or if the user record was last updated at least 60 seconds ago. If so, update the user record. */
    if (
      user.email !== email ||
      user.imageUrl !== imageUrl ||
      Date.now() - user.updatedAt.getTime() >= 60 * 1000
    ) {
      try {
        await prisma.user.update({
          where: { clerkId },
          data: { email, imageUrl },
        })
        log.debug('user record updated')
      } catch (error) {
        throw json(null, {
          status: 500,
          statusText:
            'Failed to update user record. Onboarding status unknown.',
        })
      }
    }
    /* Check to see if the session claims public metadata has the corresponding id58, and if not then update the public metadata. This is done so that the current user's id58 will always be accessible from the session data, preventing the need to find the user by Clerk ID in the database first. */
    const id58 = base58.encode(user.id)
    if (sessionClaims.metadata.id58 !== id58) {
      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: { id58 },
      })
    }
    /* Return a success result with the user data as `me`. */
    const me = {
      id58,
      displayName: user.displayName,
      imageUrl: user.imageUrl,
    }
    return { success: { data: { me } } }
  }
  /* No matching user record was found. Redirect to the onboarding route so that a new user record can be created. */
  throw redirect('/onboarding')
}

export const requireAuthenticated = async ({
  routeHandlerArgs,
  requireNotOnboarded = false,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  requireNotOnboarded?: boolean
}) => {
  log.debug('requireAuthenticated() from URL:\n', routeHandlerArgs.request.url)
  const { userId: clerkId } = await getAuth(routeHandlerArgs)
  /* If no Clerk ID was found the current user is not authenticated, so redirect to the log in page. */
  if (!clerkId) throw redirect('/log-in')
  if (requireNotOnboarded) {
    /* If the user is also required to not be onboarded (applicable on the onboarding route) check to see if a user record with a matching Clerk ID exists. */
    const getUserByClerkIdResult = await getUserByClerkId({ clerkId })
    if (getUserByClerkIdResult.failure) {
      throw json(null, {
        status: 500,
        statusText: 'Failed to fetch user record. Onboarding status unknown.',
      })
    }
    const { user } = getUserByClerkIdResult.success.data
    /* If a matching user record was found, redirect to the root route. */
    if (user) throw redirect('/')
  }
  /* The user is authenticated, and if not being onboarded was also required there is no matching user record found, so return a success result. */
  return { success: true }
}

export const requireNotAuthenticated = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  const { userId: clerkId } = await getAuth(routeHandlerArgs)
  /* If a Clerk ID was found the current user is authenticated, so redirect to the home page. */
  if (clerkId) throw redirect('/')
  /* The user is not authenticated, so return a success result. */
  return { success: true }
}

export const requireAuthorizedToEditRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  const { sessionClaims } = await getAuth(routeHandlerArgs)
  if (!sessionClaims) throw redirect('/log-in')
  const { recipeId58 } = routeHandlerArgs.params
  const zodParseResult = id58Schema.safeParse(recipeId58)
  if (!zodParseResult.success) {
    throw json(null, {
      status: 400,
      statusText: 'Invalid recipeId58.',
    })
  }
  const { id58: userId58 } = sessionClaims.metadata
  let foundRecipe
  try {
    foundRecipe = await prisma.recipe.findUnique({
      where: { id: base58.decode(recipeId58) },
      select: {
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
      },
    })
  } catch (error) {
    log.error('Failed to determine if authorized to edit recipe:\n', error)
    throw redirect('/')
  }
  if (!foundRecipe) {
    throw json(null, {
      status: 404,
      statusText: 'Recipe not found.',
    })
  }
  if (foundRecipe.author.id !== base58.decode(userId58).toLowerCase()) {
    throw json(null, {
      status: 403,
      statusText: 'Recipe not authored by you.',
    })
  }
  const recipe = {
    id58: recipeId58,
    title: foundRecipe.title,
    description: foundRecipe.description,
    isPublished: foundRecipe.isPublished,
    author: {
      id58: base58.encode(foundRecipe.author.id),
      displayName: foundRecipe.author.displayName,
      imageUrl: foundRecipe.author.imageUrl,
    },
  }
  return { success: { data: { recipe } } }
}

export const requireAuthorizedToViewRecipe = async ({
  routeHandlerArgs,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
}) => {
  const { recipeId58 } = routeHandlerArgs.params
  const zodParseResult = id58Schema.safeParse(recipeId58)
  if (!zodParseResult.success) {
    throw json(null, {
      status: 400,
      statusText: 'Invalid recipeId58.',
    })
  }
  let foundRecipe
  try {
    foundRecipe = await prisma.recipe.findUnique({
      where: { id: base58.decode(recipeId58) },
      select: {
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
      },
    })
  } catch (error) {
    log.error('Failed to determine if authorized to view recipe:\n', error)
    throw redirect('/')
  }
  if (!foundRecipe) {
    throw json(null, {
      status: 404,
      statusText: 'Recipe not found.',
    })
  }
  if (!foundRecipe.isPublished) {
    const { sessionClaims } = await getAuth(routeHandlerArgs)
    if (!sessionClaims) throw redirect('/log-in')
    const { id58: userId58 } = sessionClaims.metadata
    if (foundRecipe.author.id !== base58.decode(userId58).toLowerCase()) {
      throw json(null, {
        status: 403,
        statusText: 'Recipe not published and not authored by you.',
      })
    }
  }
  const recipe = {
    id58: recipeId58,
    title: foundRecipe.title,
    description: foundRecipe.description,
    isPublished: foundRecipe.isPublished,
    author: {
      id58: base58.encode(foundRecipe.author.id),
      displayName: foundRecipe.author.displayName,
      imageUrl: foundRecipe.author.imageUrl,
    },
  }
  return { success: { data: { recipe } } }
}
