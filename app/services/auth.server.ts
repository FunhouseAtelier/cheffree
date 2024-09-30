/* Import the necessary type declarations for Remix utility function arguments. */
import type { LoaderFunctionArgs } from '@remix-run/node'

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

const log = logger({ name: '@/app/services/auth.server.ts', level: 2 })

/* Instantiate the Clerk Client used to get Clerk account data server-side. */
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

/* Export a `requireOnboarded` function to check if the current user needs to complete the onboarding process, and if so redirects to the onboarding page. If not, it returns the basic current user data as `me`. */
export const requireOnboarded = async ({
  loaderFunctionArgs,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
}) => {
  log.debug(
    'requireOnboarded() called from URL:\n',
    loaderFunctionArgs.request.url
  )
  /* Use the arguments passed to the loader function in order to check the session for a Clerk ID. */
  const { userId: clerkId } = await getAuth(loaderFunctionArgs)
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
    /* Return a success result with the user data as `me`. */
    const me = {
      id58: base58.encode(user.id),
      displayName: user.displayName,
      imageUrl: user.imageUrl,
    }
    return { success: { data: { me } } }
  }
  /* No matching user record was found. Redirect to the onboarding route so that a new user record can be created. */
  throw redirect('/onboarding')
}

export const requireAuthenticated = async ({
  loaderFunctionArgs,
  requireNotOnboarded = false,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
  requireNotOnboarded?: boolean
}) => {
  log.debug(
    'requireAuthenticated() from URL:\n',
    loaderFunctionArgs.request.url
  )
  const { userId: clerkId } = await getAuth(loaderFunctionArgs)
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
  loaderFunctionArgs,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
}) => {
  const { userId: clerkId } = await getAuth(loaderFunctionArgs)
  /* If a Clerk ID was found the current user is authenticated, so redirect to the home page. */
  if (clerkId) throw redirect('/')
  /* The user is not authenticated, so return a success result. */
  return { success: true }
}
