import type { ActionFunction } from '@remix-run/node'
import type {
  AppSettingsForm,
  AppSettingsFormErrors,
  BasicUserData,
} from '~/utilities/zod/user'

import logger from '@funhouse-atelier/logger'
import { updateMe } from '~/services/user.server'
import { useState, useEffect } from 'react'
import { useRouteLoaderData, useActionData } from '@remix-run/react'
import { appSettingsForm } from '~/utilities/zod/user'
import zodParse from '~/utilities/zod/parser'
import { MainContainer, Container } from '~/components/containers'
import { Heading, Text } from '~/components/typography'
import { Form } from '@remix-run/react'
import { SingletonTextFieldSet } from '~/components/forms'

const log = logger({ name: '@app/routes/settings.tsx', level: 2 })

export const action: ActionFunction = async (routeHandlerArgs) => {
  const formData = await routeHandlerArgs.request.formData()
  const updates = Object.fromEntries(formData)
  const updateMeResult = await updateMe({ routeHandlerArgs, updates })
  return { actionErrors: updateMeResult.failure?.errors }
}

export default function AppSettingsRoute() {
  const { me } = useRouteLoaderData<{ me: BasicUserData }>('root') ?? {}
  const { actionErrors } = useActionData<typeof action>() ?? {}

  const [activeFieldName, setActiveFieldName] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<AppSettingsForm>({
    displayName: '',
  })
  const [formErrors, setFormErrors] = useState<AppSettingsFormErrors>({})

  useEffect(() => {
    if (me) setFormValues({ ...formValues, displayName: me.displayName })
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
    const zodParseResult = zodParse(newFormValues, appSettingsForm)
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
      <Text Tag="p">Click on a field to edit the value.</Text>
      <Container size="sm">
        <Form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col gap-y-[0.125em]"
        >
          <SingletonTextFieldSet
            fieldName="displayName"
            label="Display Name"
            placeholder="What do you want to be called?"
            required
            autoFocus
            value={formValues.displayName}
            onChange={handleChange}
            error={formErrors.displayName}
            activeFieldName={activeFieldName}
            onCancel={handleCancel}
            setActiveFieldName={setActiveFieldName}
          />
        </Form>
      </Container>
    </MainContainer>
  )
}
