import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { appSettingsFormSchema } from '~/utilities/zod.schemas'

const log = logger({ name: '@/app/services/user.server.tsx', level: 2 })

interface OnboardMeResult {
  success?: boolean
  data?: {
    id58: string
  }
  error?: {
    form?: string
    displayName?: string
  }
}
export async function onboardMe({
  actionFunctionArgs,
  updates,
}: {
  actionFunctionArgs: ActionFunctionArgs
  updates: { displayName: string }
}): Promise<OnboardMeResult> {
  const parseResult = appSettingsFormSchema.safeParse(updates)
  if (parseResult.error) {
    const parseErrors = parseResult.error.format()
    const error: { [key: string]: string | undefined } = {}
    if (parseErrors._errors.length) {
      error.form = parseErrors._errors.join(' • ')
    }
    for (const inputName in updates) {
      error[inputName] =
        parseErrors[inputName as keyof typeof updates]?._errors.join(' • ')
    }
    return { error }
  }

  const { userId } = await getAuth(actionFunctionArgs)
  if (!userId) throw redirect('/')

  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
  const { emailAddresses, primaryEmailAddressId } =
    await clerkClient.users.getUser(userId)

  let email
  for (const emailAddress of emailAddresses) {
    if (emailAddress.id === primaryEmailAddressId) {
      email = emailAddress.emailAddress
    }
  }
  if (!email) throw redirect('/')

  let id58
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { clerkId: userId, ...updates },
      create: {
        clerkId: userId,
        email,
        ...updates,
      },
    })
    id58 = base58.encode(user.id)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    log.error('Unexpected error when creating new user record:\n', error)
    return {
      error: {
        form: 'Unable to create your profile at this time.',
      },
    }
  }

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        isOnboarded: true,
      },
    })
    return { success: true, data: { id58 } }
  } catch (error) {
    log.error('Unable to update onboarding status in Clerk metadata:', error)
    return {
      error: { form: 'Unable to update the Clerk metadata at this time.' },
    }
  }
}

export async function getUserByClerkId({ clerkId }: { clerkId: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    })
    if (!user) return { success: true, me: null }
    const me = {
      id58: base58.encode(user.id),
      displayName: user.displayName,
    }
    return { success: true, me }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    return {
      error: {
        form: 'Failed to get user profile.',
      },
    }
  }
}

interface Me {
  id58: string
  displayName: string
}
interface GetMeResult {
  success?: boolean
  me?: Me | null
  error?: {
    form?: string
  }
}
export async function getMe({
  loaderFunctionArgs,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
}): Promise<GetMeResult> {
  const { userId } = await getAuth(loaderFunctionArgs)
  if (!userId) return { success: true, me: null }
  return await getUserByClerkId({ clerkId: userId })
}

interface User {
  id58: string
  clerkId: string
  displayName: string
  imageUrl: string
  createdAt: Date
  lastSeenAt: Date
}
interface GetUserById58Result {
  success?: boolean
  user?: User | null
  error?: {
    form?: string
  }
}
export async function getUserById58(
  id58: string
): Promise<GetUserById58Result> {
  try {
    const foundUser = await prisma.user.findUnique({
      where: { id: base58.decode(id58) },
    })
    if (!foundUser) return { success: true, user: null }
    const { clerkId, displayName, createdAt, lastSeenAt } = foundUser

    const foundClerkUser = await createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    }).users.getUser(clerkId)
    if (!foundUser) return { error: { form: 'Failed to get session user.' } }
    const { imageUrl } = foundClerkUser

    const user = {
      id58,
      clerkId,
      displayName,
      imageUrl,
      createdAt,
      lastSeenAt,
    }
    return { success: true, user }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    return {
      error: {
        form: 'Failed to get user profile.',
      },
    }
  }
}

export async function getAllUsers() {
  try {
    const foundUsers = await prisma.user.findMany()

    const users = foundUsers.map((user) => {
      return {
        id58: base58.encode(user.id),
        displayName: user.displayName,
      }
    })
    return { success: true, users }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    log.error('Unexpected error when getting all user id58s:\n', error)
    return {
      error: {
        form: 'Failed to get all user id58s.',
      },
    }
  }
}

interface UpdateMeResult {
  success?: boolean
  error?: {
    form?: string
    displayName?: string
  }
}
export async function updateMe({
  actionFunctionArgs,
  updates,
}: {
  actionFunctionArgs: ActionFunctionArgs
  updates: { displayName?: string }
}): Promise<UpdateMeResult> {
  try {
    const { userId: clerkId } = await getAuth(actionFunctionArgs)
    if (!clerkId) throw redirect('/')

    const parseResult = appSettingsFormSchema.safeParse(updates)
    if (parseResult.error) {
      const parseErrors = parseResult.error.format()
      const error: { [key: string]: string | undefined } = {}
      if (parseErrors._errors.length) {
        error.form = parseErrors._errors.join(' • ')
      }
      for (const inputName in updates) {
        error[inputName] =
          parseErrors[inputName as keyof typeof updates]?._errors.join(' • ')
      }
      return { error }
    }

    await prisma.user.update({
      where: { clerkId },
      data: updates,
    })
    return { success: true }
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    log.error('Unexpected error when updating user record:\n', error)
    return { error: { form: 'Unable to update user record at this time.' } }
  }
}
