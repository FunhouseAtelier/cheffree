import type { ActionFunction } from '@remix-run/node'
import type {
  AppSettingsFormData,
  AppSettingsFormErrors,
  UserBasicData,
} from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import { updateUser } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { useRouteLoaderData, useActionData, Form } from '@remix-run/react'
import { appSettingsFormData } from '~/utilities/zod/user'
import zodParse from '~/utilities/zod/parser'
import { MainContainer, Container } from '~/components/containers'
import { Heading } from '~/components/typography'
import { SingletonTextField } from '~/components/forms'

const log = logger({ name: '@app/routes/settings.tsx', level: 2 })
log.debug('logger instantiated')

export const action: ActionFunction = async (routeHandlerArgs) => {
  const formData = await routeHandlerArgs.request.formData()
  const updates = Object.fromEntries(formData)
  const { failure } = await updateUser({ routeHandlerArgs, updates })
  return { actionErrors: failure?.errors }
}

export default function AppSettingsRoute() {
  const { me } = useRouteLoaderData<{ me: UserBasicData }>('root') ?? {}
  const { actionErrors } = useActionData<typeof action>() ?? {}

  const [activeFieldName, setActiveFieldName] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<AppSettingsFormData>({
    displayName: '',
  })
  const [formErrors, setFormErrors] = useState<AppSettingsFormErrors>({})

  useEffect(() => {
    if (me) setFormValues((f) => ({ ...f, displayName: me.displayName }))
  }, [me])

  useEffect(() => {
    if (actionErrors) {
      setFormErrors(actionErrors)
      setActiveFieldName(Object.keys(actionErrors)[0])
    }
  }, [actionErrors])

  const handleChange = (event: React.FormEvent) => {
    const { name, value } = event.target as HTMLInputElement
    const newFormValues = { ...formValues, [name]: value }
    setFormValues(newFormValues)
    const zodParseResult = zodParse(newFormValues, appSettingsFormData)
    if (zodParseResult.success) {
      setFormErrors({})
    } else {
      setFormErrors(zodParseResult.failure.errors)
    }
  }

  const handleCancel = () => {
    setActiveFieldName(null)
    setFormValues({ displayName: me?.displayName ?? '' })
    setFormErrors({})
  }

  const handleSubmit = () => {
    setActiveFieldName(null)
  }

  return (
    <MainContainer>
      <Heading className="text-center">App Settings</Heading>
      <Container
        centered
        containerSize="sm"
        className="my-[1em]"
      >
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-[0.5em]"
        >
          <SingletonTextField
            fieldName="displayName"
            label="Display Name"
            placeholder="What do you want to be called?"
            required
            value={formValues.displayName}
            handleChange={handleChange}
            error={formErrors.displayName}
            activeFieldName={activeFieldName}
            handleCancel={handleCancel}
            setActiveFieldName={setActiveFieldName}
          />
        </Form>
      </Container>
    </MainContainer>
  )
}
