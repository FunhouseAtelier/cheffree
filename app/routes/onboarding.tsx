import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireOnboarded } from '~/services/auth.server'
import { onboardUser } from '~/services/user.server'
import { json } from '@remix-run/node'
import { redirectDocument, useActionData } from '@remix-run/react'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { useUser } from '@clerk/remix'

const log = logger({ name: '@/app/routes/onboarding.tsx', level: 2 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  log.debug('received new route request')
  await requireOnboarded({
    loaderFunctionArgs,
    isReverseLogic: true,
  })
  return {}
}

interface OnboardingFormData {
  displayName: string
}
export const action = async (actionFunctionArgs: ActionFunctionArgs) => {
  const formData = await actionFunctionArgs.request.formData()
  const { displayName } = Object.fromEntries(
    formData
  ) as unknown as OnboardingFormData
  const result = await onboardUser({ actionFunctionArgs, displayName })
  if (result.error) return json({ error: result.error })
  log.debug('completed onboarding with no errors')
  return redirectDocument(`/user/${result.id58}`)
}

export default function OnboardingRoute() {
  const { error } = useActionData<typeof action>() ?? {}
  const { isLoaded, user } = useUser()
  const { fullName } = user ?? {}
  const defaultDisplayName = fullName ?? ''

  return (
    <Container tag="main" size="md">
      <Heading className="mt-2 mb-4 text-center">Onboarding</Heading>
      <Text tag="p" className="my-1">
        To complete the setup of your ChefFree account, please review your
        profile information and make any changes you want before it is
        published.
      </Text>
      {isLoaded && (
        <Container tag="section" size="sm">
          <Form method="post" className="my-4">
            <fieldset className="my-2">
              <label htmlFor="display-name-input" className="block my-1">
                <Text className="font-semibold">Display Name</Text>
              </label>
              <input
                id="display-name-input"
                type="text"
                name="displayName"
                defaultValue={defaultDisplayName}
                placeholder="What do you want to be called?"
                required
                autoFocus
                className="block w-full px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-base sm:text-lg lg:text-xl text-zinc-200 bg-amber-950 drop-shadow lg:drop-shadow-md"
              />
              <Text
                tag="strong"
                size="xs"
                className="block my-0.5 h-[1.125rem] sm:h-[1.3125rem] lg:h-6 font-semibold text-red-700"
              >
                {error?.displayName}
              </Text>
            </fieldset>
            <button
              type="submit"
              className="flex justify-center items-center my-2 sm:my-3 lg:my-4 h-8 sm:h-10 lg:h-12 w-full text-base sm:text-lg lg:text-xl border lg:border-2 rounded-[1rem] sm:rounded-[1.25rem] lg:rounded-[1.5rem] text-zinc-200 border-emerald-900 bg-emerald-800/80 hover:bg-emerald-800 transition-colors duration-300 ease-out active:bg-emerald-500 active:transition-none drop-shadow lg:drop-shadow-md"
            >
              Create Profile
            </button>
            <Text
              tag="strong"
              className="block my-1 h-[1.3125rem] sm:h-6 lg:h-[1.6875rem] font-semibold text-red-700"
            >
              {error?.form}
            </Text>
          </Form>
        </Container>
      )}
    </Container>
  )
}
