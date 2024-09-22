import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '~/utilities/logger'
import { getUserByClerkId } from './user.server'
import { json, redirect } from '@remix-run/node'
import { getAuth } from '@clerk/remix/ssr.server'

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
    if (isReverseLogic) throw redirect('/')
    return { success: true }
  }

  log.debug('not onboarded')
  if (isReverseLogic) return { success: true }
  throw redirect('/onboarding')
}
