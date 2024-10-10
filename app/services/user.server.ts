import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { GetUserWhereArgs } from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import { onboardingFormData, appSettingsFormData } from '~/utilities/zod/user'
import zodParse from '~/utilities/zod/parser'
import { replaceIdWithId58 } from '~/utilities/data'
import { requireAuthenticated } from './auth.server'

const log = logger({ name: '@/app/services/user.server.ts', level: 2 })

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
})

const selectByScope = {
  basic: { displayName: true, imageUrl: true },
  profile: {
    createdAt: true,
    updatedAt: true,
    displayName: true,
    imageUrl: true,
  },
  onboarding: {
    email: true,
    displayName: true,
    imageUrl: true,
    updatedAt: true,
  },
}

export const createUser = async ({
  routeHandlerArgs,
  updates,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  updates: { [key: string]: FormDataEntryValue }
}) => {
  const authResult = await requireAuthenticated({ routeHandlerArgs })
  const { clerkId } = authResult.success.data

  const { success, failure } = zodParse(updates, onboardingFormData)
  if (failure) return { failure }

  try {
    const clerkUser = await clerkClient.users.getUser(clerkId)
    const { imageUrl } = clerkUser
    const email = clerkUser.emailAddresses[0].emailAddress
    /* Here upsert is used instead of create to handle the edge case where a user was already onboarded but was able to send another POST request to the `/onboarding` route. If the user record already exists `prisma.user.create` would throw an error. */
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email, imageUrl },
      create: {
        clerkId,
        email,
        imageUrl,
        ...success.data,
      },
      select: { id: true, ...selectByScope['basic'] },
    })

    const data = { user: replaceIdWithId58(user) }
    return { success: { data } }
  } catch (error) {
    log.error('Unable to upsert user:\n', error)
    return {
      failure: {
        errors: { _global: 'Unable to upsert user.' },
      },
    }
  }
}

export const getUser = async (
  scope: keyof typeof selectByScope,
  { id, id58, clerkId, email }: GetUserWhereArgs
) => {
  if (!id && id58) id = base58.decode(id58).toLowerCase()
  const select = { id: true, ...selectByScope[scope] }
  try {
    const user = await prisma.user.findUnique({
      where: { id, clerkId, email },
      select,
    })
    if (!user) return { failure: { reason: 'User not found.' } }
    const data = { user: replaceIdWithId58(user) }
    return { success: { data } }
  } catch (error) {
    log.error('Unable to get user:\n', error)
    return { failure: { error } }
  }
}

export const getAllUsers = async (scope: keyof typeof selectByScope) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, ...selectByScope[scope] },
    })
    const data = {
      users: users.map((user) => replaceIdWithId58(user)),
    }
    return { success: { data } }
  } catch (error) {
    log.error('Failed to get users:\n', error)
    return { failure: { reason: 'Failed to get users.' } }
  }
}

export const updateUser = async ({
  routeHandlerArgs,
  updates,
}: {
  routeHandlerArgs: LoaderFunctionArgs | ActionFunctionArgs
  updates: { [key: string]: FormDataEntryValue }
}) => {
  const authResult = await requireAuthenticated({ routeHandlerArgs })
  const { clerkId } = authResult.success.data

  const { success, failure } = zodParse(updates, appSettingsFormData)
  if (failure) return { failure }

  try {
    await prisma.user.update({
      where: { clerkId },
      data: { ...success.data },
      select: { id: true, ...selectByScope['basic'] },
    })
    return { success: true }
  } catch (error) {
    log.error('Unable to update user:\n', error)
    return {
      failure: {
        errors: { _global: 'Unable to update user.' },
      },
    }
  }
}
