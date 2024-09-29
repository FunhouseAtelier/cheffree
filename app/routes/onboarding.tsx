import type { ActionFunction, LoaderFunction } from '@remix-run/node'
import type { OnboardingForm, OnboardingFormErrors } from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import { requireAuthenticated } from '~/services/auth.server'
import { onboardMe } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { redirectDocument, useActionData } from '@remix-run/react'
import { onboardingFormSchema } from '~/utilities/zod/user'
import { MainContainer, Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { FormSubmitButton } from '~/components/buttons'
import { useUser } from '@clerk/remix'
import { FormError, TextFieldSet } from '~/components/forms'

const log = logger({ name: '@/app/routes/onboarding.tsx', level: 2 })

export const loader: LoaderFunction = async (loaderFunctionArgs) => {
  await requireAuthenticated({ loaderFunctionArgs, requireNotOnboarded: true })
  return {}
}

export const action: ActionFunction = async (actionFunctionArgs) => {
  const formData = await actionFunctionArgs.request.formData()
  const updates = Object.fromEntries(formData)
  const onboardMeResult = await onboardMe({ actionFunctionArgs, updates })
  if (onboardMeResult.success) {
    throw redirectDocument(`/user/${onboardMeResult.success.data.me.id58}`)
  }
  return { actionErrors: onboardMeResult.failure.errors }
}

export default function OnboardingRoute() {
  const { actionErrors } = useActionData<typeof action>() ?? {}
  const { isLoaded, user: clerkMe } = useUser()

  const [formValues, setFormValues] = useState<OnboardingForm>({
    displayName: '',
  })
  const [formErrors, setFormErrors] = useState<OnboardingFormErrors>({})

  useEffect(() => {
    if (isLoaded) {
      setFormValues({ ...formValues, displayName: clerkMe?.fullName ?? '' })
    }
  }, [isLoaded])

  useEffect(() => {
    if (actionErrors) setFormErrors(actionErrors)
  }, [actionErrors])

  const handleChange = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    const newFormValues = { ...formValues, [name]: value }
    setFormValues(newFormValues)
    /* TODO: refactor Zod parsing into a utility function. */
    const parseResult = onboardingFormSchema.safeParse(newFormValues)
    if (parseResult.success) {
      setFormErrors({})
    } else {
      const parseErrors = parseResult.error.format()
      const newFormErrors: OnboardingFormErrors = {}
      for (const inputName in parseErrors) {
        if (inputName !== '_errors') {
          const inputError =
            parseErrors[inputName as keyof OnboardingForm] ?? null
          if (inputError) {
            newFormErrors[inputName as keyof OnboardingFormErrors] =
              parseErrors[inputName as keyof OnboardingForm]?._errors.join(
                ' • '
              )
          }
        }
      }
      setFormErrors(newFormErrors)
    }
  }

  return (
    <MainContainer>
      <Heading className="text-center">Onboarding</Heading>
      <Text tag="p">
        To complete the setup of your ChefFree account, please review your
        profile information and make any changes you want before it is
        published.
      </Text>
      {isLoaded && (
        <Container size="sm">
          <Form method="post" className="flex flex-col gap-y-[0.125em]">
            <TextFieldSet
              fieldName="displayName"
              label="Display Name"
              placeholder="What do you want to be called?"
              required
              autoFocus
              value={formValues.displayName}
              onChange={handleChange}
              error={formErrors.displayName}
            />
            <FormSubmitButton>Create Profile</FormSubmitButton>
            <FormError>{formErrors.form}</FormError>
          </Form>
        </Container>
      )}
    </MainContainer>
  )
}
