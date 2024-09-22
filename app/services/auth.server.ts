import type { LoaderFunctionArgs } from '@remix-run/node'

import logger from '~/utilities/logger'
import { redirect } from '@remix-run/node'
import { getAuth } from '@clerk/remix/ssr.server'

const log = logger({ name: '@/app/services/auth.server.ts', level: 2 })

export async function requireOnboarded({
  loaderFunctionArgs,
  isReverseLogic,
}: {
  loaderFunctionArgs: LoaderFunctionArgs
  isReverseLogic?: boolean
}) {
  const { userId, sessionClaims } = await getAuth(loaderFunctionArgs)

  if (!userId) {
    log.debug('not authenticated')
    if (isReverseLogic) throw redirect('/')
    return { success: true }
  }
  log.debug('authenticated')

  if (sessionClaims.metadata.isOnboarded) {
    log.debug('already onboarded')
    if (isReverseLogic) throw redirect('/')
    return { success: true }
  }
  log.debug('not onboarded')

  if (isReverseLogic) return { success: true }
  throw redirect('/onboarding')
}
