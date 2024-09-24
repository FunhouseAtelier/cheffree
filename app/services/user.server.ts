import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { base58 } from 'base-id'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const log = logger({ name: '@/app/services/user.server.tsx', level: 3 })

interface CreateUserResult {
  success?: boolean
  id58?: string
  error?: {
    form?: string
    displayName?: string
  }
}
export async function onboardUser({
  actionFunctionArgs,
  displayName,
}: {
  actionFunctionArgs: ActionFunctionArgs
  displayName: string
}): Promise<CreateUserResult> {
  if (!displayName || typeof displayName !== 'string') {
    return { error: { displayName: 'Please enter a display name.' } }
  }
  if (displayName.length > 32) {
    return { error: { displayName: 'That display name is too long.' } }
  }

  const { userId } = await getAuth(actionFunctionArgs)
  if (!userId) throw redirect('/')

  log.debug('authenticated session found')

  const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  })
  const { emailAddresses, primaryEmailAddressId } =
    await clerkClient.users.getUser(userId)

  log.debug('session user data found')

  let email
  for (const emailAddress of emailAddresses) {
    if (emailAddress.id === primaryEmailAddressId) {
      email = emailAddress.emailAddress
    }
  }
  if (!email) throw redirect('/')

  log.debug('primary email address found')

  let id58
  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: { clerkId: userId, displayName },
      create: {
        clerkId: userId,
        email,
        displayName,
      },
    })
    log.debug('new user record created')
    id58 = base58.encode(user.id)
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    log.error('unexpected error when creating new user record')
    return {
      error: {
        form: 'Failed to create your profile at this time. Please try again later.',
      },
    }
  }

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        isOnboarded: true,
      },
    })
    log.debug('onboarding status updated in Clerk metadata')
    return { success: true, id58 }
  } catch (err) {
    log.error('unable to update onboarding status in Clerk metadata')
    return { error: { form: 'There was an error updating the user metadata.' } }
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
    return {
      error: {
        form: 'Failed to get all user id58s.',
      },
    }
  }
}
