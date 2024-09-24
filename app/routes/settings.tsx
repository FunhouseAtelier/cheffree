import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'
import type { AppSettingsForm } from '~/utilities/zod.types'

import logger from '@funhouse-atelier/logger'
import { requireAuthenticated, requireOnboarded } from '~/services/auth.server'
import { getMe } from '~/services/user.server'
import { redirect } from '@remix-run/node'
import { updateMe } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { useLoaderData, useActionData } from '@remix-run/react'
import { appSettingsFormSchema } from '~/utilities/zod.schemas'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { CheckIcon, XmarkIcon } from '~/components/icons'

const log = logger({ name: '@app/routes/settings.tsx', level: 2 })

interface Me {
  id58: string
  displayName: string
}
export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireAuthenticated({ loaderFunctionArgs })
  await requireOnboarded({ loaderFunctionArgs })
  const getMeResult = await getMe({ loaderFunctionArgs })
  if (getMeResult.error) throw redirect('/')
  const { me } = getMeResult as { me: Me }
  return { me }
}

export const action = async (actionFunctionArgs: ActionFunctionArgs) => {
  const formData = await actionFunctionArgs.request.formData()
  const updates = Object.fromEntries(formData) as AppSettingsForm
  const updateMeResult = await updateMe({ actionFunctionArgs, updates })
  return updateMeResult
}

export default function AppSettingsRoute() {
  const { me } = useLoaderData<typeof loader>()
  const { error: actionErrors } = useActionData<typeof action>() ?? {}

  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<{ displayName: string }>({
    displayName: me.displayName,
  })
  const [formErrors, setFormErrors] = useState<{ displayName?: string }>({})

  useEffect(() => {
    setFormValues({ ...formValues, displayName: me.displayName })
  }, [me])

  useEffect(() => {
    if (actionErrors) {
      setFormErrors(actionErrors)
      setActiveForm(Object.keys(actionErrors)[0])
    }
  }, [actionErrors])

  const handleInput = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    const newFormValues = { ...formValues, [name]: value }
    setFormValues(newFormValues)
    const parseResult = appSettingsFormSchema.safeParse(newFormValues)
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

  const handleCancel = () => {
    setActiveForm(null)
    setFormValues({ displayName: me.displayName })
    setFormErrors({})
  }

  const handleSubmit = () => {
    setActiveForm(null)
  }

  return (
    <Container tag="main" size="md">
      <Heading className="my-4 text-center">App Settings</Heading>
      <Container tag="section" size="sm" className="my-6">
        {activeForm === 'displayName' ? (
          <Form method="post" className="my-2" onSubmit={handleSubmit}>
            <label htmlFor="display-name-input" className="block my-1">
              <Text className="font-semibold">Display Name</Text>
            </label>
            <div className="flex gap-2">
              <input
                id="display-name-input"
                type="text"
                name="displayName"
                placeholder="What do you want to be called?"
                required
                autoFocus
                value={formValues.displayName}
                onInput={handleInput}
                className="block grow px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-base sm:text-lg lg:text-xl text-zinc-200 bg-amber-950 drop-shadow lg:drop-shadow-md"
              />
              <button
                type="submit"
                disabled={!!Object.keys(formErrors).length}
                className="flex justify-center items-center size-8 sm:size-10 lg:size-11 rounded bg-emerald-800 text-zinc-200 drop-shadow lg:drop-shadow-md disabled:bg-emerald-800/50"
              >
                <Text>
                  <CheckIcon />
                </Text>
              </button>
              <button
                onClick={handleCancel}
                className="flex justify-center items-center size-8 sm:size-10 lg:size-11 rounded bg-zinc-500 text-zinc-200 drop-shadow lg:drop-shadow-md"
              >
                <Text>
                  <XmarkIcon />
                </Text>
              </button>
            </div>
            <Text
              tag="strong"
              size="xs"
              className="block my-1 h-[1.125rem] sm:h-[1.3125rem] lg:h-6 font-semibold text-red-700"
            >
              {formErrors.displayName}
            </Text>
          </Form>
        ) : (
          <div className="my-2">
            <div className="my-1">
              <Text className="font-semibold">Display Name</Text>
            </div>
            <div className="flex gap-2">
              <div
                onClick={() => setActiveForm('displayName')}
                className="grow px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-base sm:text-lg lg:text-xl bg-amber-300"
              >
                {formValues.displayName}
              </div>
              <div className="size-8 sm:size-10 lg:size-11" />
              <div className="size-8 sm:size-10 lg:size-11" />
            </div>
            <div className=" my-0.5 h-[1.125rem] sm:h-[1.3125rem] lg:h-6" />
          </div>
        )}
        {/* add form error display */}
      </Container>
    </Container>
  )
}
