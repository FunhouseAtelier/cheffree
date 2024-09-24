import type { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node'

import logger from '@funhouse-atelier/logger'
import { requireAuthenticated, requireOnboarded } from '~/services/auth.server'
import { getMe } from '~/services/user.server'
import { redirect } from '@remix-run/node'
import { updateUser } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/remix'
import { useLoaderData, useActionData } from '@remix-run/react'
import { Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { CheckIcon, XmarkIcon } from '~/components/icons'

const log = logger({ name: '@app/routes/settings.tsx', level: 0 })

export const loader = async (loaderFunctionArgs: LoaderFunctionArgs) => {
  await requireAuthenticated({ loaderFunctionArgs })
  await requireOnboarded({ loaderFunctionArgs })
  const getMeResult = await getMe({ loaderFunctionArgs })
  if (getMeResult.error) throw redirect('/')
  const { me } = getMeResult
  if (!me) throw redirect('/onboarding')
  return { me }
}

interface SettingsFormData {
  displayName: string
}
export const action = async (actionFunctionArgs: ActionFunctionArgs) => {
  const formData = await actionFunctionArgs.request.formData()
  const updates = Object.fromEntries(formData) as unknown as SettingsFormData
  const result = await updateUser({ actionFunctionArgs, updates })
  return result
}

export default function AppSettingsRoute() {
  const { isLoaded } = useUser()
  const { me } = useLoaderData<typeof loader>()
  const { error } = useActionData<typeof action>() ?? {}

  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string>(me.displayName)
  const [formErrors, setFormErrors] = useState<{ displayName?: string } | null>(
    {}
  )

  useEffect(() => {
    if (error) {
      setFormErrors(error ?? {})
      setActiveForm(Object.keys(error)[0])
    }
  }, [error])

  return (
    <Container tag="main" size="md">
      <Heading className="my-4 text-center">App Settings</Heading>
      {isLoaded && (
        <Container tag="section" size="sm" className="my-6">
          {activeForm === 'displayName' || formErrors?.displayName ? (
            <Form
              method="post"
              className="my-2"
              onSubmit={() => setActiveForm(null)}
            >
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
                  className="block grow px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-base sm:text-lg lg:text-xl text-zinc-200 bg-amber-950 drop-shadow lg:drop-shadow-md"
                  value={displayName}
                  onInput={(e) => {
                    setDisplayName((e.target as HTMLInputElement).value)
                    setFormErrors(null)
                  }}
                />
                <button
                  type="submit"
                  className="flex justify-center items-center size-8 sm:size-10 lg:size-11 rounded bg-green-800 text-zinc-200 drop-shadow lg:drop-shadow-md"
                >
                  <Text>
                    <CheckIcon />
                  </Text>
                </button>
                <button
                  className="flex justify-center items-center size-8 sm:size-10 lg:size-11 rounded bg-red-800 text-zinc-200 drop-shadow lg:drop-shadow-md"
                  onClick={() => {
                    setDisplayName(me.displayName)
                    setActiveForm(null)
                    setFormErrors(null)
                  }}
                >
                  <Text>
                    <XmarkIcon />
                  </Text>
                </button>
              </div>
              <Text
                tag="strong"
                size="xs"
                className="block my-0.5 h-[1.125rem] sm:h-[1.3125rem] lg:h-6 font-semibold text-red-700"
              >
                {formErrors?.displayName}
              </Text>
            </Form>
          ) : (
            <div className="my-2">
              <div className="my-1">
                <Text className="font-semibold">Display Name</Text>
              </div>
              <div className="flex gap-2">
                <div
                  className="grow px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded text-base sm:text-lg lg:text-xl bg-amber-300"
                  onClick={() => setActiveForm('displayName')}
                >
                  {displayName}
                </div>
                <div className="size-8 sm:size-10 lg:size-11" />
                <div className="size-8 sm:size-10 lg:size-11" />
              </div>
              <div className=" my-0.5 h-[1.125rem] sm:h-[1.3125rem] lg:h-6" />
            </div>
          )}
        </Container>
      )}
    </Container>
  )
}
