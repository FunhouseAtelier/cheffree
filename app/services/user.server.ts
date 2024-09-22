import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

import logger from '~/utilities/logger'
import prisma from './prisma.server'
import { getAuth } from '@clerk/remix/ssr.server'
import { redirect } from '@remix-run/react'
import { createClerkClient } from '@clerk/remix/api.server'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

const log = logger({ name: '@/app/services/user.server.tsx', level: 2 })

interface CreateUserResult {
  success?: boolean
  error?: {
    form?: string
    displayName?: string
  }
}
export async function createUser({
  actionFunctionArgs,
  displayName,
}: {
  actionFunctionArgs: ActionFunctionArgs
  displayName: string
}): Promise<CreateUserResult> {
  if (!displayName || typeof displayName !== 'string') {
    return { error: { displayName: 'Please enter a display name.' } }
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

  try {
    await prisma.user.upsert({
      where: { email },
      update: { clerkId: userId, displayName },
      create: {
        clerkId: userId,
        email,
        displayName,
      },
    })
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        default:
          log.error(error)
      }
    }
    return {
      error: {
        form: 'Unable to create your profile at this time. Please try again later.',
      },
    }
  }

  try {
    await clerkClient.users.updateUser(userId, {
      publicMetadata: {
        isOnboarded: true,
      },
    })
    return { success: true }
  } catch (err) {
    return { error: { form: 'There was an error updating the user metadata.' } }
  }
}

interface Me {
  id: string
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

  try {
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    })
    if (!user) return { success: true, me: null }
    const me = {
      id: user.id,
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
        form: 'Unable to get your user profile. Please try again later.',
      },
    }
  }
}
