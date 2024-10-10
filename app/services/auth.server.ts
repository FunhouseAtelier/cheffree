/* Import the necessary type declarations for Remix utility function arguments. */
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'

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
import { getUser } from './user.server'
import { id58 } from '~/utilities/zod/common'
import { getRecipe } from './recipe.server'

const log = logger({ name: '@/app/services/auth.server.ts', level: 2 })

/* Instantiate the Clerk Client used to get Clerk account data server-side. */
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

/* Export a `requireOnboarded` function to check if the current user needs to complete the onboarding process, and if so redirects to the onboarding page. If not, it returns the basic current user data as `me`. */
export const requireOnboarded = async (
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
) => {
  /* Use the arguments passed to the loader or action function in order to check the session for a Clerk ID. */
  const { userId: clerkId, sessionClaims } = await getAuth(routeHandlerArgs)
  /* If no Clerk ID was found the current user is not authenticated, so onboarding is not required and `me` has a value of `null`. */
  if (!clerkId) return { success: { data: { me: null } } }
  /* Check to see if a user record with a matching Clerk ID exists. */
  const { success, failure } = await getUser('onboarding', { clerkId })
  if (failure) {
    if (failure.reason === 'User not found.') {
      /* No matching user record was found. Redirect to the onboarding route so that a new user record can be created. */
      throw redirect('/onboarding')
    }
    /* ATTN: Redirecting to any route here could cause an infinite loop of redirects!
    
    An error was caught. In this case we cannot know a good destination to redirect to, so we must respond to the request with an error.  */
    throw json(null, {
      status: 500,
      statusText: 'Failed to fetch user record; onboarding status unknown.',
    })
  }
  const { user } = success.data
  if (user) {
    try {
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
        await prisma.user.update({
          where: { clerkId },
          data: { email, imageUrl },
        })
      }
      /* Check to see if the session claims public metadata has the corresponding id58, and if not then update the public metadata. This is done so that the current user's id58 will always be accessible from the session data, preventing the need to find the user by Clerk ID in the database first. */
      if (sessionClaims.metadata.id58 !== user.id58) {
        await clerkClient.users.updateUser(clerkId, {
          publicMetadata: { id58: user.id58 },
        })
      }
    } catch (error) {
      log.error('Unable to update user:\n', error)
      throw json(null, {
        status: 500,
        statusText: 'Failed to update user record; onboarding status unknown.',
      })
    }
  }
  /* Return a success result with the user data as `me`. */
  const me = {
    id58: user.id58,
    displayName: user.displayName,
    imageUrl: user.imageUrl,
  }
  return { success: { data: { me } } }
}

export const requireAuthenticated = async ({
  routeHandlerArgs,
  requireNotOnboarded = false,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  requireNotOnboarded?: boolean
}) => {
  const { userId: clerkId, sessionClaims } = await getAuth(routeHandlerArgs)
  /* If no Clerk ID was found the current user is not authenticated, so redirect to the log in page. */
  if (!clerkId) throw redirect('/log-in')
  if (requireNotOnboarded) {
    /* If the user is also required to not be onboarded (applicable on the onboarding route) check to see if a user record with a matching Clerk ID exists. */
    const { success, failure } = await getUser('basic', { clerkId })
    if (failure) {
      if (failure.error) {
        /* As in the `requiredOnboarded` function above, if the user record could not be retrieved due to an error, we don't know where to redirect without the possibility of infinite redirects, so just respond to the request with an error. */
        throw json(null, {
          status: 500,
          statusText: 'Failed to fetch user record; onboarding status unknown.',
        })
      }
    }
    /* If a matching user record was found, redirect to the root route. */
    if (success?.data.user) throw redirect('/')
  }
  /* The user is authenticated, and if not being onboarded was also required there is no matching user record found, so return a success result with their Clerk data. */
  return { success: { data: { clerkId, sessionClaims } } }
}

export const requireNotAuthenticated = async (
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
) => {
  const { userId: clerkId } = await getAuth(routeHandlerArgs)
  /* If a Clerk ID was found the current user is authenticated, so redirect to the home page. */
  if (clerkId) throw redirect('/')
  /* The user is not authenticated, so return a success result. */
  return { success: true }
}

export const requireAuthorizedToEditRecipe = async (
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
) => {
  const { sessionClaims } = await getAuth(routeHandlerArgs)
  if (!sessionClaims) throw redirect('/log-in')
  const { recipeId58 } = routeHandlerArgs.params
  const zodParseResult = id58.safeParse(recipeId58)
  log.debug(zodParseResult)
  if (!zodParseResult.success) {
    throw json(null, {
      status: 400,
      statusText: 'Invalid recipeId58.',
    })
  }
  const { id58: userId58 } = sessionClaims.metadata
  const { success, failure } = await getRecipe('edit', { id58: recipeId58 })
  if (failure) {
    let status
    switch (failure.reason) {
      case 'Recipe not found.':
        status = 404
        break
      case 'Failed to get recipe.':
      default:
        status = 500
    }
    throw json(null, {
      status,
      statusText: failure.reason,
    })
  }

  const { recipe } = success.data
  if (recipe.author.id58 !== userId58) {
    throw json(null, {
      status: 403,
      statusText: 'Recipe not authored by you.',
    })
  }
  return { success }
}

export const requireAuthorizedToViewRecipe = async (
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
) => {
  const { recipeId58 } = routeHandlerArgs.params
  const zodParseResult = id58.safeParse(recipeId58)
  if (!zodParseResult.success) {
    throw json(null, {
      status: 400,
      statusText: 'Invalid recipeId58.',
    })
  }
  const { success, failure } = await getRecipe('view', { id58: recipeId58 })
  if (failure) {
    let status
    switch (failure.reason) {
      case 'Recipe not found.':
        status = 404
        break
      case 'Failed to get recipe.':
      default:
        status = 500
    }
    throw json(null, {
      status,
      statusText: failure.reason,
    })
  }

  const { recipe } = success.data
  if (!recipe.isPublished) {
    const { sessionClaims } = await getAuth(routeHandlerArgs)
    if (!sessionClaims) throw redirect('/log-in')
    const { id58: userId58 } = sessionClaims.metadata
    if (recipe.author.id58 !== userId58) {
      throw json(null, {
        status: 403,
        statusText: 'Recipe not published and not authored by you.',
      })
    }
  }
  return { success }
}
