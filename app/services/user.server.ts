/* Import the necessary type declarations for Remix utility function arguments. */
import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { Id58 } from '~/utilities/zod/common'
import type { ClerkId } from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import { onboardingForm, appSettingsForm } from '~/utilities/zod/user'
import zodParse from '~/utilities/zod/parser'

const log = logger({ name: '@/app/services/user.server.ts', level: 2 })

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

/* Export a function to find a user based on a Clerk ID. */
export const getUserByClerkId = async ({ clerkId }: { clerkId: ClerkId }) => {
  try {
    const user = await prisma.user.findUnique({ where: { clerkId } })
    return { success: { data: { user } } }
  } catch (error) {
    return { failure: { error } }
  }
}

/* Export a `getAllUsers` function to return the basic data for all users  as a `users` arrray, or returns the caught error in case of failure. */
export const getAllUsers = async () => {
  log.debug('getAllUsers() called')
  try {
    const foundUsers = await prisma.user.findMany({
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
      orderBy: [{ updatedAt: 'desc' }],
    })
    const users = foundUsers.map((user) => ({
      id58: base58.encode(user.id),
      displayName: user.displayName,
      imageUrl: user.imageUrl,
    }))
    return { success: { data: { users } } }
  } catch (error) {
    log.error('Unable to get users:\n', error)
    return { failure: { error } }
  }
}

export const onboardMe = async ({
  routeHandlerArgs,
  updates,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  updates: { [key: string]: FormDataEntryValue }
}) => {
  log.debug('onboardMe() called')
  const { userId: clerkId } = await getAuth(routeHandlerArgs)
  if (!clerkId) throw redirect('/log-in')

  const zodParseResult = zodParse(updates, onboardingForm)
  if (zodParseResult.failure) {
    return { failure: zodParseResult.failure }
  }

  const clerkUser = await clerkClient.users.getUser(clerkId)
  const { imageUrl } = clerkUser
  const email = clerkUser.emailAddresses[0].emailAddress

  try {
    const upsertedUser = await prisma.user.upsert({
      where: { clerkId },
      update: { email, imageUrl },
      create: {
        clerkId,
        email,
        imageUrl,
        ...zodParseResult.success.data,
      },
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
    })
    const id58 = base58.encode(upsertedUser.id)
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { id58 },
    })
    const me = {
      id58,
      displayName: upsertedUser.displayName,
      imageUrl: upsertedUser.imageUrl,
    }
    return { success: { data: { me } } }
  } catch (error) {
    log.error('Unexpected error when onboarding the user:\n', error)
    return {
      failure: {
        errors: { _global: 'Unable to onboard you at this time.' },
      },
    }
  }
}

export const updateMe = async ({
  routeHandlerArgs,
  updates,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  updates: { [key: string]: FormDataEntryValue }
}) => {
  const { userId: clerkId } = await getAuth(routeHandlerArgs)
  if (!clerkId) throw redirect('/log-in')

  const zodParseResult = zodParse(updates, appSettingsForm)
  if (zodParseResult.failure) {
    return { failure: zodParseResult.failure }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: { ...zodParseResult.success.data },
    })
    const me = {
      id58: base58.encode(updatedUser.id),
      displayName: updatedUser.displayName,
      imageUrl: updatedUser.imageUrl,
    }
    return { success: { data: { me } } }
  } catch (error) {
    return {
      failure: {
        errors: { _global: 'Unable to update user record at this time.' },
      },
    }
  }
}

/* Export a function to find a user based on a base-58 ID. */
export const getUserById58 = async ({ id58 }: { id58: Id58 }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: base58.decode(id58) },
    })
    return { success: { data: { user } } }
  } catch (error) {
    return { failure: { error } }
  }
}
