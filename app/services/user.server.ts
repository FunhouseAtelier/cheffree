/* Import the necessary type declarations for Remix utility function arguments. */
import type { ActionFunctionArgs } from '@remix-run/node'

import type {
  ClerkId,
  OnboardingForm,
  OnboardingFormErrors,
  AppSettingsForm,
  AppSettingsFormErrors,
  UserId58,
} from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { json, redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import {
  onboardingFormSchema,
  appSettingsFormSchema,
} from '~/utilities/zod/user'

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
  actionFunctionArgs,
  updates,
}: {
  actionFunctionArgs: ActionFunctionArgs
  updates: { [key: string]: FormDataEntryValue }
}) => {
  log.debug('onboardMe() called')
  const { userId: clerkId } = await getAuth(actionFunctionArgs)
  if (!clerkId) throw redirect('/log-in')

  const parseResult = onboardingFormSchema.safeParse(updates)
  if (parseResult.error) {
    const parseErrors = parseResult.error.format()
    const errors: OnboardingFormErrors = {}
    if (parseErrors._errors.length) {
      errors.form = parseErrors._errors.join(' • ')
    }
    for (const inputName in parseErrors) {
      if (inputName !== '_errors') {
        const inputError =
          parseErrors[inputName as keyof OnboardingForm] ?? null
        if (inputError) {
          errors[inputName as keyof OnboardingFormErrors] =
            parseErrors[inputName as keyof OnboardingForm]?._errors.join(' • ')
        }
      }
    }
    return { failure: { errors } }
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
        ...(updates as OnboardingForm),
      },
      select: {
        id: true,
        displayName: true,
        imageUrl: true,
      },
    })
    const me = {
      id58: base58.encode(upsertedUser.id),
      displayName: upsertedUser.displayName,
      imageUrl: upsertedUser.imageUrl,
    }
    return { success: { data: { me } } }
  } catch (error) {
    log.error('Unexpected error when upserting the user record:\n', error)
    return {
      failure: {
        errors: { form: 'Unable to create your profile at this time.' },
      },
    }
  }
}

export const updateMe = async ({
  actionFunctionArgs,
  updates,
}: {
  actionFunctionArgs: ActionFunctionArgs
  updates: { [key: string]: FormDataEntryValue }
}) => {
  const { userId: clerkId } = await getAuth(actionFunctionArgs)
  if (!clerkId) throw redirect('/log-in')

  const parseResult = appSettingsFormSchema.safeParse(updates)
  if (parseResult.error) {
    const parseErrors = parseResult.error.format()
    const errors: AppSettingsFormErrors = {}
    if (parseErrors._errors.length) {
      errors.form = parseErrors._errors.join(' • ')
    }
    for (const inputName in parseErrors) {
      if (inputName !== '_errors') {
        const inputError =
          parseErrors[inputName as keyof AppSettingsForm] ?? null
        if (inputError) {
          errors[inputName as keyof AppSettingsFormErrors] =
            parseErrors[inputName as keyof AppSettingsForm]?._errors.join(' • ')
        }
      }
    }
    return { failure: { errors } }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { clerkId },
      data: { ...updates },
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
        errors: { form: 'Unable to update user record at this time.' },
      },
    }
  }
}

/* Export a function to find a user based on a base-58 ID. */
export const getUserById58 = async ({ userId58 }: { userId58: UserId58 }) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: base58.decode(userId58) },
    })
    return { success: { data: { user } } }
  } catch (error) {
    return { failure: { error } }
  }
}
