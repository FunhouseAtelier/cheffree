import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import type { OnboardingForm } from '~/utilities/zod.types'

import logger from '@funhouse-atelier/logger'
import { requireOnboarded } from '~/services/auth.server'
import { onboardMe } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { redirectDocument, useActionData } from '@remix-run/react'
import { onboardingFormSchema } from '~/utilities/zod.schemas'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { useUser } from '@clerk/remix'

const log = logger({ name: '@/app/routes/onboarding.tsx', level: 2 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireOnboarded({
    loaderFunctionArgs,
    isReverseLogic: true,
  })
  return {}
}

export const action = async (actionFunctionArgs: ActionFunctionArgs) => {
  const formData = await actionFunctionArgs.request.formData()
  const updates = Object.fromEntries(formData) as OnboardingForm
  const { data, error } = await onboardMe({
    actionFunctionArgs,
    updates,
  })
  if (error) return { error }
  /* avoid `data?` with discriminated union */
  return redirectDocument(`/user/${data?.id58}`)
}

export default function OnboardingRoute() {
  const { error: actionErrors } = useActionData<typeof action>() ?? {}
  const { isLoaded, user } = useUser()

  const [formValues, setFormValues] = useState<{ displayName: string }>({
    displayName: '',
  })
  const [formErrors, setFormErrors] = useState<{
    form?: string
    displayName?: string
  }>({})

  useEffect(() => {
    if (isLoaded) {
      setFormValues({ ...formValues, displayName: user?.fullName ?? '' })
    }
  }, [isLoaded])

  useEffect(() => {
    if (actionErrors) {
      setFormErrors(actionErrors)
    }
  }, [actionErrors])

  const handleInput = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    const newFormValues = { ...formValues, [name]: value }
    setFormValues(newFormValues)
    const parseResult = onboardingFormSchema.safeParse(newFormValues)
    if (parseResult.success) {
      setFormErrors({})
    } else {
      const parseErrors = parseResult.error.format()
      const newFormErrors: { [key: string]: string | undefined } = {}

      for (const inputName in newFormValues) {
        newFormErrors[inputName] =
          parseErrors[inputName as keyof typeof newFormValues]?._errors.join(
            ' • '
          )
      }
      setFormErrors(newFormErrors)
    }
  }

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
                placeholder="What do you want to be called?"
                required
                autoFocus
                value={formValues.displayName}
                onInput={handleInput}
                className="block w-full px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-base sm:text-lg lg:text-xl text-zinc-200 bg-amber-950 drop-shadow lg:drop-shadow-md"
              />
              <Text
                tag="strong"
                size="xs"
                className="block my-0.5 h-[1.125rem] sm:h-[1.3125rem] lg:h-6 font-semibold text-red-700"
              >
                {formErrors.displayName}
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
              {formErrors.form}
            </Text>
          </Form>
        </Container>
      )}
    </Container>
  )
}
