import type { LoaderFunctionArgs } from '@remix-run/node'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

import logger from '~/utilities/logger'
import { getUserByClerkId } from './user.server'
import { json, redirect } from '@remix-run/node'
import { getAuth } from '@clerk/remix/ssr.server'
import prisma from './prisma.server'

const log = logger({ name: '@/app/services/auth.server.ts', level: 2 })

export async function requireAuthenticated({
  loaderFunctionArgs,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
}) {
  const { userId } = await getAuth(loaderFunctionArgs).catch((error) => {
    throw json(null, {
      status: 500,
      statusText: 'Unable to check Clerk session.',
    })
  })
  if (userId) return { success: true }
  throw redirect('/')
}

export async function requireOnboarded({
  loaderFunctionArgs,
  isReverseLogic,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
  isReverseLogic?: boolean
}) {
  const { userId } = await getAuth(loaderFunctionArgs)
  if (!userId) return { success: true }

  const result = await getUserByClerkId({ clerkId: userId })
  if (result.error) {
    throw json(null, {
      status: 500,
      statusText: 'Unable to check onboarding status.',
    })
  }
  const { me } = result

  if (me) {
    log.debug('already onboarded')
    try {
      await prisma.user.update({
        where: { clerkId: userId },
        data: { lastSeenAt: new Date(Date.now()) },
      })
      log.debug('last seen at timestamp updated')
      if (isReverseLogic) throw redirect('/')
      return { success: true }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        switch (error.code) {
          default:
            log.error(error)
        }
      }
      log.error('unexpected error when updating user record')
      return {
        error: {
          form: 'Failed to update last seet at timestamp in user record.',
        },
      }
    }
  }
  log.debug('not onboarded')
  if (isReverseLogic) return { success: true }
  throw redirect('/onboarding')
}
